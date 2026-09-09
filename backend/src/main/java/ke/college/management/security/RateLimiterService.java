package ke.college.management.security;

import ke.college.management.exceptions.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Slf4j
@RequiredArgsConstructor
public class RateLimiterService {

    private final StringRedisTemplate stringRedisTemplate;

    // In-memory fallback in case Redis connection is temporarily unavailable or in local mock testing
    private final ConcurrentHashMap<String, FallbackEntry> fallbackMap = new ConcurrentHashMap<>();

    private static class FallbackEntry {
        final AtomicInteger count = new AtomicInteger(1);
        final long expiresAt;

        FallbackEntry(long durationMillis) {
            this.expiresAt = System.currentTimeMillis() + durationMillis;
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expiresAt;
        }
    }

    public boolean tryAcquire(String key, int maxAttempts, Duration window) {
        try {
            Long count = stringRedisTemplate.opsForValue().increment(key);
            if (count != null && count == 1) {
                stringRedisTemplate.expire(key, window);
            }
            return count != null && count <= maxAttempts;
        } catch (Exception ex) {
            log.warn("Redis unavailable for rate limiting key {}. Utilizing resilient fallback: {}", key, ex.getMessage());
            long now = System.currentTimeMillis();
            FallbackEntry entry = fallbackMap.compute(key, (k, existing) -> {
                if (existing == null || existing.isExpired()) {
                    return new FallbackEntry(window.toMillis());
                }
                existing.count.incrementAndGet();
                return existing;
            });
            return entry.count.get() <= maxAttempts;
        }
    }

    public void checkLoginRateLimit(String identifier, String ipAddress) {
        String ipKey = "rl:login:ip:" + (ipAddress != null ? ipAddress.replace(":", "_") : "unknown");
        String accountKey = "rl:login:acc:" + identifier.toLowerCase().trim();

        // Allow up to 20 attempts per 10 minutes per IP
        if (!tryAcquire(ipKey, 20, Duration.ofMinutes(10))) {
            throw new BusinessRuleException("Too many login attempts from this IP address. Please wait 10 minutes.");
        }

        // Allow up to 5 failed attempts per 5 minutes per account
        if (!tryAcquire(accountKey, 5, Duration.ofMinutes(5))) {
            throw new BusinessRuleException("Too many consecutive login attempts for this account. Please wait 5 minutes before trying again.");
        }
    }

    public void resetLoginRateLimit(String identifier, String ipAddress) {
        try {
            String ipKey = "rl:login:ip:" + (ipAddress != null ? ipAddress.replace(":", "_") : "unknown");
            String accountKey = "rl:login:acc:" + identifier.toLowerCase().trim();
            stringRedisTemplate.delete(ipKey);
            stringRedisTemplate.delete(accountKey);
        } catch (Exception ignored) {
            fallbackMap.remove("rl:login:acc:" + identifier.toLowerCase().trim());
        }
    }

    public void checkPasswordResetRateLimit(String identifier, String ipAddress) {
        String ipKey = "rl:pwd_reset:ip:" + (ipAddress != null ? ipAddress.replace(":", "_") : "unknown");
        String accountKey = "rl:pwd_reset:acc:" + identifier.toLowerCase().trim();

        if (!tryAcquire(ipKey, 5, Duration.ofHours(1))) {
            throw new BusinessRuleException("Password reset request limit exceeded for this IP. Try again in an hour.");
        }
        if (!tryAcquire(accountKey, 3, Duration.ofHours(1))) {
            throw new BusinessRuleException("Password reset requests exceeded for this account. Try again in an hour.");
        }
    }

    public void checkSensitiveOpRateLimit(String userId, String operation) {
        String key = "rl:sensitive:" + operation + ":" + userId;
        if (!tryAcquire(key, 10, Duration.ofMinutes(1))) {
            throw new BusinessRuleException("Rate limit exceeded for sensitive operation: " + operation + ". Please slow down.");
        }
    }
}
