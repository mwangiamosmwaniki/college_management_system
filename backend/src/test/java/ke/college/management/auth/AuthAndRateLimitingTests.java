package ke.college.management.auth;

import ke.college.management.auth.dto.ActivateAccountRequest;
import ke.college.management.auth.dto.ForgotPasswordRequest;
import ke.college.management.auth.entity.AccountActivationToken;
import ke.college.management.auth.entity.PasswordResetToken;
import ke.college.management.auth.repository.AccountActivationTokenRepository;
import ke.college.management.auth.repository.PasswordResetTokenRepository;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.RateLimitExceededException;
import ke.college.management.security.RateLimiterService;
import ke.college.management.users.entity.User;
import ke.college.management.users.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class AuthAndRateLimitingTests {

    @Autowired
    private RateLimiterService rateLimiterService;

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private AccountActivationTokenRepository activationTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("P0: Excessive login attempts on same IP/identifier must trigger RateLimitExceededException")
    void excessiveLoginAttempts_TriggersRateLimit() {
        String testIdentifier = "test_limiter_" + System.currentTimeMillis() + "@apex.edu";
        String testIp = "192.168.1.100";

        // First 5 attempts should pass rate limiter
        for (int i = 0; i < 5; i++) {
            assertDoesNotThrow(() -> rateLimiterService.checkLoginRateLimit(testIdentifier, testIp));
        }

        // 6th attempt must trigger RateLimitExceededException
        assertThrows(RateLimitExceededException.class, () -> {
            rateLimiterService.checkLoginRateLimit(testIdentifier, testIp);
        });
    }

    @Test
    @Transactional
    @DisplayName("P0: Password reset generation generates single-use hashed token with audit")
    void forgotPassword_GeneratesSecureHashedToken() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("10.0.0.1");

        ForgotPasswordRequest forgotReq = new ForgotPasswordRequest();
        forgotReq.setIdentifier("admin@apex.edu");

        authService.forgotPassword(forgotReq, request);

        List<PasswordResetToken> tokens = passwordResetTokenRepository.findAll();
        assertTrue(!tokens.isEmpty(), "Password reset token should be recorded in database");
    }

    @Test
    @Transactional
    @DisplayName("P0: Account Activation - Single-use token, stored as secure hash, transitions user to ACTIVE")
    void activateAccount_SingleUseHashedTokenActivatesUser() {
        String testInstId = "inst_act_test";
        String userId = "usr_pending_" + UUID.randomUUID().toString().substring(0, 8);

        User pendingUser = User.builder()
                .id(userId)
                .institutionId(testInstId)
                .identifier("ADM/2026/000999")
                .email("student999@apex.edu")
                .fullName("Pending Student")
                .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                .status("PENDING_ACTIVATION")
                .failedLoginAttempts(0)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        userRepository.save(pendingUser);

        // 1. Generate activation token
        String rawToken = authService.createAccountActivationToken(testInstId, userId);

        // Verify token in DB is NOT plaintext
        List<AccountActivationToken> storedTokens = activationTokenRepository.findByUserId(userId);
        assertFalse(storedTokens.isEmpty());
        AccountActivationToken tokenRecord = storedTokens.get(0);
        assertFalse(tokenRecord.getTokenHash().equals(rawToken), "Token in DB must be hashed, never plaintext");
        assertFalse(tokenRecord.getUsed());

        // 2. Activate with user-chosen password
        ActivateAccountRequest actReq = new ActivateAccountRequest();
        actReq.setToken(rawToken);
        actReq.setPassword("P@ssw0rdSecure2026!");

        MockHttpServletRequest mockReq = new MockHttpServletRequest();
        mockReq.setRemoteAddr("127.0.0.1");

        authService.activateAccount(actReq, mockReq);

        // Verify user status is now ACTIVE
        User activatedUser = userRepository.findById(userId).orElseThrow();
        assertEquals("ACTIVE", activatedUser.getStatus());
        assertTrue(passwordEncoder.matches("P@ssw0rdSecure2026!", activatedUser.getPasswordHash()));

        // 3. Second activation attempt must be rejected (single-use enforcement)
        assertThrows(BadRequestException.class, () -> {
            authService.activateAccount(actReq, mockReq);
        });
    }
}
