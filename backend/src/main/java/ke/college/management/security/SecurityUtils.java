package ke.college.management.security;

import ke.college.management.exceptions.TenantViolationException;
import ke.college.management.exceptions.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static CustomUserDetails getCurrentUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new UnauthorizedException("User is not authenticated in this session");
        }
        return (CustomUserDetails) auth.getPrincipal();
    }

    public static String getCurrentUserId() {
        return getCurrentUserDetails().getId();
    }

    public static String getCurrentInstitutionId() {
        return getCurrentUserDetails().getInstitutionId();
    }

    /**
     * Enforce tenant boundary: Ensures the requested resource's institution ID strictly matches
     * the authenticated user's institution ID derived from the session.
     */
    public static void validateTenantAccess(String resourceInstitutionId) {
        String currentTenant = getCurrentInstitutionId();
        if (resourceInstitutionId == null || !resourceInstitutionId.equals(currentTenant)) {
            throw new TenantViolationException("Cross-tenant access prohibited: attempted to access institution "
                    + resourceInstitutionId + " from authenticated tenant " + currentTenant);
        }
    }
}
