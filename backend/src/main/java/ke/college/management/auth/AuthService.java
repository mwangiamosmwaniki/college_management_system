package ke.college.management.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import ke.college.management.audit.AuditService;
import ke.college.management.auth.dto.AuthResponse;
import ke.college.management.auth.dto.LoginRequest;
import ke.college.management.auth.dto.UserDto;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.UnauthorizedException;
import ke.college.management.security.CustomUserDetails;
import ke.college.management.security.SecurityUtils;
import ke.college.management.users.entity.User;
import ke.college.management.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Transactional
    public AuthResponse authenticate(LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        String requestId = UUID.randomUUID().toString();

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

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .filter(a -> a.startsWith("ROLE_"))
                    .map(a -> a.substring(5))
                    .toList();

            List<String> permissions = userDetails.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .filter(a -> !a.startsWith("ROLE_"))
                    .toList();

            // Audit record for successful authentication
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

            return AuthResponse.builder()
                    .userId(userDetails.getId())
                    .identifier(userDetails.getIdentifier())
                    .email(userDetails.getEmail())
                    .fullName(userDetails.getFullName())
                    .institutionId(userDetails.getInstitutionId())
                    .roles(roles)
                    .permissions(permissions)
                    .sessionId(session.getId())
                    .build();

        } catch (BadCredentialsException ex) {
            // Track failed attempts
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
}
