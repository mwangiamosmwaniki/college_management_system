package ke.college.management.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import ke.college.management.audit.AuditService;
import ke.college.management.auth.dto.AuthResponse;
import ke.college.management.auth.dto.ChangePasswordRequest;
import ke.college.management.auth.dto.ForgotPasswordRequest;
import ke.college.management.auth.dto.LoginRequest;
import ke.college.management.auth.dto.ResetPasswordRequest;
import ke.college.management.auth.dto.UserDto;
import ke.college.management.auth.entity.PasswordResetToken;
import ke.college.management.auth.repository.PasswordResetTokenRepository;
import ke.college.management.common.EmailService;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.UnauthorizedException;
import ke.college.management.security.CustomUserDetails;
import ke.college.management.security.RateLimiterService;
import ke.college.management.security.SecurityUtils;
import ke.college.management.users.entity.User;
import ke.college.management.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;
    private final RateLimiterService rateLimiterService;
    private final EmailService emailService;

    @Value("${app.mail.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public AuthResponse authenticate(LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        String requestId = UUID.randomUUID().toString();

        // 1. Rate limiting check (Account and IP-based)
        rateLimiterService.checkLoginRateLimit(request.getIdentifier(), clientIp);

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
            );

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);

            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

            // Reset failed login attempts on successful login
            User user = userRepository.findById(userDetails.getId()).orElse(null);
            if (user != null) {
                user.setFailedLoginAttempts(0);
                user.setLockedUntil(null);
                user.setLastLoginAt(Instant.now());
                userRepository.save(user);
            }

            // Clear rate limiting counter on successful authentication
            rateLimiterService.resetLoginRateLimit(request.getIdentifier(), clientIp);

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .filter(a -> a.startsWith("ROLE_"))
                    .map(a -> a.substring(5))
                    .toList();

            List<String> permissions = userDetails.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .filter(a -> !a.startsWith("ROLE_"))
                    .toList();

            // Audit record for successful authentication (actor derived authoritatively)
            auditService.recordEvent(
                    userDetails.getInstitutionId(),
                    userDetails.getId(),
                    userDetails.getIdentifier(),
                    "AUTH_LOGIN_SUCCESS",
                    "USER_SESSION",
                    session.getId(),
                    "SUCCESS",
                    clientIp,
                    userAgent,
                    requestId,
                    "User successfully authenticated via institutional Spring Security",
                    null,
                    null
            );

            // Return AuthResponse WITHOUT exposing sessionId in response payload (HTTP-only cookie handles session)
            return AuthResponse.builder()
                    .userId(userDetails.getId())
                    .identifier(userDetails.getIdentifier())
                    .email(userDetails.getEmail())
                    .fullName(userDetails.getFullName())
                    .institutionId(userDetails.getInstitutionId())
                    .roles(roles)
                    .permissions(permissions)
                    .build();

        } catch (BadCredentialsException ex) {
            // Track failed attempts in DB
            userRepository.findByEmailOrIdentifier(request.getIdentifier()).ifPresent(u -> {
                int attempts = (u.getFailedLoginAttempts() != null ? u.getFailedLoginAttempts() : 0) + 1;
                u.setFailedLoginAttempts(attempts);
                if (attempts >= 5) {
                    u.setLockedUntil(Instant.now().plusSeconds(900)); // 15-minute lockout
                }
                userRepository.save(u);

                auditService.recordEvent(
                        u.getInstitutionId(),
                        u.getId(),
                        u.getIdentifier(),
                        "AUTH_LOGIN_FAILURE",
                        "USER_CREDENTIALS",
                        u.getId(),
                        "FAILED",
                        clientIp,
                        userAgent,
                        requestId,
                        "Invalid password attempt (" + attempts + "/5)",
                        null,
                        null
                );
            });
            throw new UnauthorizedException("Invalid institutional identifier or password.");
        } catch (LockedException ex) {
            throw new BadRequestException("This account is temporarily locked due to excessive failed attempts. Please retry later.");
        }
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = "ANONYMOUS";
        String identifier = "ANONYMOUS";
        String institutionId = "GLOBAL";

        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails userDetails) {
            userId = userDetails.getId();
            identifier = userDetails.getIdentifier();
            institutionId = userDetails.getInstitutionId();
        }

        HttpSession session = request.getSession(false);
        String sessionId = session != null ? session.getId() : "NONE";
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        // Clear session cookie explicitly
        Cookie cookie = new Cookie("COLLEGE_ERP_SESSION", "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        response.addCookie(cookie);

        auditService.recordEvent(
                institutionId,
                userId,
                identifier,
                "AUTH_LOGOUT",
                "USER_SESSION",
                sessionId,
                "SUCCESS",
                request.getRemoteAddr(),
                request.getHeader("User-Agent"),
                UUID.randomUUID().toString(),
                "User successfully logged out and invalidated session",
                null,
                null
        );
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        CustomUserDetails details = SecurityUtils.getCurrentUserDetails();
        User user = userRepository.findById(details.getId())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));

        List<String> roles = user.getRoles().stream()
                .map(r -> r.getCode())
                .toList();

        List<String> permissions = user.getRoles().stream()
                .flatMap(r -> r.getPermissions().stream())
                .map(p -> p.getCode())
                .distinct()
                .toList();

        return UserDto.builder()
                .id(user.getId())
                .identifier(user.getIdentifier())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .institutionId(user.getInstitutionId())
                .departmentId(user.getDepartmentId())
                .campusId(user.getCampusId())
                .status(user.getStatus())
                .roles(roles)
                .permissions(permissions)
                .build();
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request, HttpServletRequest httpRequest) {
        String userId = SecurityUtils.getCurrentUserId();
        rateLimiterService.checkSensitiveOpRateLimit(userId, "CHANGE_PASSWORD");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password does not match.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        auditService.recordEvent(
                user.getInstitutionId(),
                user.getId(),
                user.getIdentifier(),
                "AUTH_PASSWORD_CHANGE",
                "USER",
                user.getId(),
                "SUCCESS",
                httpRequest.getRemoteAddr(),
                httpRequest.getHeader("User-Agent"),
                UUID.randomUUID().toString(),
                "User changed their password",
                null,
                null
        );
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        rateLimiterService.checkPasswordResetRateLimit(request.getIdentifier(), clientIp);

        Optional<User> userOpt = userRepository.findByEmailOrIdentifier(request.getIdentifier().trim());
        if (userOpt.isEmpty()) {
            // Constant-time behavior: don't reveal whether user exists
            log.info("Password reset requested for non-existent identifier: {}", request.getIdentifier());
            return;
        }

        User user = userOpt.get();

        // Invalidate old tokens for this user
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // Generate 32-byte secure random token
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .id("rst_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(user.getInstitutionId())
                .userId(user.getId())
                .tokenHash(tokenHash)
                .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                .used(false)
                .createdAt(Instant.now())
                .build();

        passwordResetTokenRepository.save(resetToken);

        auditService.recordEvent(
                user.getInstitutionId(),
                user.getId(),
                user.getIdentifier(),
                "AUTH_PASSWORD_RESET_REQUEST",
                "PASSWORD_RESET_TOKEN",
                resetToken.getId(),
                "SUCCESS",
                clientIp,
                httpRequest.getHeader("User-Agent"),
                UUID.randomUUID().toString(),
                "Password reset token generated (expires in 15 minutes)",
                null,
                null
        );

        // Dispatch reset token via configured email provider. Never log the raw token!
        String resetLink = frontendUrl + "/app?action=reset-password&token=" + rawToken;
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), resetLink);
        log.info("Password reset email successfully dispatched for user: {}", user.getId());
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request, HttpServletRequest httpRequest) {
        String tokenHash = hashToken(request.getToken().trim());
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token."));

        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("Password reset token has already been used or has expired.");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new BadRequestException("User associated with token not found."));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        auditService.recordEvent(
                user.getInstitutionId(),
                user.getId(),
                user.getIdentifier(),
                "AUTH_PASSWORD_RESET_SUCCESS",
                "USER",
                user.getId(),
                "SUCCESS",
                httpRequest.getRemoteAddr(),
                httpRequest.getHeader("User-Agent"),
                UUID.randomUUID().toString(),
                "User password successfully reset using one-time token",
                null,
                null
        );
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
