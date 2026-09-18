import { PortalId, UserIdentity, RoleDefinition } from '@/types/erp';
import { evaluatePortalAccess } from './rbac-engine';

export interface PortalResolutionResult {
  portalId: PortalId;
  isDefault: boolean;
  isValid: boolean;
  reason?: string;
}

/**
 * Single authoritative source of truth for resolving and validating a user's destination portal.
 * Enforces:
 * 1. Target portal hint validation (strictly a navigation hint, only honored if user is authorized)
 * 2. Authoritative default portal validation (must be in user's active, authorized portal assignments)
 * 3. Fallback strictly to first active authorized assignment
 * 4. Zero valid assignments -> 'NO_PORTAL_ASSIGNED' (never silently default to STUDENT or fabricate access)
 */
export function resolveUserDestinationPortal(
  user: UserIdentity | null,
  targetPortalHint?: PortalId | 'STAFF' | null,
  rolesRegistry?: RoleDefinition[]
): PortalResolutionResult {
  // Unauthenticated visitors or guest browsing
  if (!user || user.identifier === 'GUEST') {
    return { portalId: 'PUBLIC', isDefault: false, isValid: true };
  }

  // Active, unrevoked portal assignments
  const authorizedAssignments = (user.portalAssignments || []).filter((a) => {
    if (a.active === false || a.revokedAt) {
      return false;
    }
    if (rolesRegistry) {
      return evaluatePortalAccess(user, a.portalId, rolesRegistry).allowed;
    }
    return true;
  });

  const authorizedPortalIds = new Set(authorizedAssignments.map((a) => a.portalId));

  // If user has NO active authorized portal assignments -> authenticated-but-no-portal state
  if (authorizedAssignments.length === 0) {
    return {
      portalId: 'NO_PORTAL_ASSIGNED',
      isDefault: false,
      isValid: false,
      reason: 'Your account is active, but no application portal or access rights have been assigned. Please contact your institution administrator.'
    };
  }

  // 1. If explicit target portal hint provided (navigation request), check if user is actually authorized
  if (targetPortalHint && targetPortalHint !== 'STAFF' && targetPortalHint !== 'PUBLIC' && targetPortalHint !== 'NO_PORTAL_ASSIGNED') {
    if (authorizedPortalIds.has(targetPortalHint)) {
      return {
        portalId: targetPortalHint,
        isDefault: targetPortalHint === user.defaultPortalId,
        isValid: true
      };
    }
    // Target portal hint is NOT authorized; ignore hint and proceed to authoritative resolution
  }

  // 2. Authoritative default portal check
  if (user.defaultPortalId && authorizedPortalIds.has(user.defaultPortalId)) {
    return {
      portalId: user.defaultPortalId,
      isDefault: true,
      isValid: true
    };
  }

  // Check if any assignment is marked isDefault
  const explicitDefaultAssignment = authorizedAssignments.find((a) => a.isDefault);
  if (explicitDefaultAssignment) {
    return {
      portalId: explicitDefaultAssignment.portalId,
      isDefault: true,
      isValid: true
    };
  }

  // 3. Fallback strictly to first authorized assignment
  return {
    portalId: authorizedAssignments[0].portalId,
    isDefault: false,
    isValid: true,
    reason: 'Routed to first authorized institutional assignment'
  };
}
