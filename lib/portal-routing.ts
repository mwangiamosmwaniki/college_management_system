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
 * 1. Target portal hint validation (if user is authorized)
 * 2. Authoritative default portal validation (must be in user's authorized portal assignments)
 * 3. Fallback strictly to first authorized assignment
 * 4. Never blindly grant access or default to STUDENT for unauthorized users.
 */
export function resolveUserDestinationPortal(
  user: UserIdentity | null,
  targetPortalHint?: PortalId | 'STAFF' | null,
  rolesRegistry?: RoleDefinition[]
): PortalResolutionResult {
  if (!user) {
    return { portalId: 'PUBLIC', isDefault: false, isValid: true };
  }

  const authorizedAssignments = user.portalAssignments.filter((a) =>
    rolesRegistry ? evaluatePortalAccess(user, a.portalId, rolesRegistry).allowed : true
  );

  const authorizedPortalIds = new Set(authorizedAssignments.map((a) => a.portalId));

  // 1. If explicit target portal hint provided (e.g. user clicked "Student Login" or navigated to a specific portal)
  if (targetPortalHint && targetPortalHint !== 'STAFF' && targetPortalHint !== 'PUBLIC') {
    if (authorizedPortalIds.has(targetPortalHint)) {
      return {
        portalId: targetPortalHint,
        isDefault: targetPortalHint === user.defaultPortalId,
        isValid: true
      };
    }
  }

  // 2. Authoritative default portal check
  if (user.defaultPortalId && authorizedPortalIds.has(user.defaultPortalId)) {
    return {
      portalId: user.defaultPortalId,
      isDefault: true,
      isValid: true
    };
  }

  // 3. Fallback to first authorized assignment
  if (authorizedAssignments.length > 0) {
    return {
      portalId: authorizedAssignments[0].portalId,
      isDefault: false,
      isValid: true,
      reason: 'Default portal was unassigned or unauthorized; routed to primary assigned portal'
    };
  }

  // 4. No authorized internal portal
  return {
    portalId: 'PUBLIC',
    isDefault: false,
    isValid: false,
    reason: 'User has no authorized internal portal assignments'
  };
}
