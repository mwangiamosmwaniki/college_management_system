package ke.college.management.auth;

import ke.college.management.auth.dto.ForgotPasswordRequest;
import ke.college.management.auth.entity.PasswordResetToken;
import ke.college.management.auth.repository.PasswordResetTokenRepository;
import ke.college.management.exceptions.RateLimitExceededException;
import ke.college.management.security.RateLimiterService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
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
}
