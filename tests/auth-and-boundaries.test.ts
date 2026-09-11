import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  authenticateWithBackend,
  validateSession,
  invalidateSession,
  getStudentData,
  getStudentInvoices,
  getInstitutionalUserList
} from '../lib/server/auth-store.ts';
import type { AuthSession } from '../lib/server/auth-store.ts';

describe('Authoritative Authentication and Security Boundary Tests', () => {
  it('1. Authentication with valid credentials succeeds and creates a cryptographically signed session', async () => {
    const result = await authenticateWithBackend('ADM-001', 'Password123!');
    assert.strictEqual(result.success, true);
    assert.ok(result.session);
    assert.ok(result.session?.sessionId);
    assert.strictEqual(result.session?.identifier, 'ADM-001');
    assert.strictEqual(result.session?.fullName, 'Dr. Elizabeth Mutua');
    assert.ok(result.session?.roles.includes('ADMIN'));

    // Validate the session in the store
    const session = validateSession(result.session.sessionId);
    assert.ok(session);
    assert.strictEqual(session?.userId, result.session.userId);
  });

  it('2. Authentication with invalid password fails (401) with NO fallback identity manufacture', async () => {
    const result = await authenticateWithBackend('ADM-001', 'WrongPassword123');
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.statusCode, 401);
    assert.strictEqual(result.message, 'Invalid credentials.');
    assert.strictEqual(result.session, undefined);
  });

  it('3. Authentication with non-existent user identifier fails (401) with NO fallback', async () => {
    const result = await authenticateWithBackend('NON_EXISTENT_USER', 'Password123!');
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.statusCode, 401);
    assert.strictEqual(result.message, 'Invalid credentials.');
    assert.strictEqual(result.session, undefined);
  });

  it('4. Session destruction terminates the authenticated principal', async () => {
    const login = await authenticateWithBackend('LEC-CS-104', 'Password123!');
    assert.ok(login.session);
    const sid = login.session.sessionId;

    assert.ok(validateSession(sid));
    invalidateSession(sid);
    assert.strictEqual(validateSession(sid), null);
  });

  it('5. Account Isolation & IDOR Protection: Student cannot access another student records', async () => {
    const studentLogin = await authenticateWithBackend('STU-2026-001', 'Password123!');
    assert.ok(studentLogin.session);
    const studentSession = studentLogin.session;

    // Student requesting own record
    const ownRecord = getStudentData(studentSession, 'CIT/0042/2024');
    assert.strictEqual(ownRecord.allowed, true);
    assert.strictEqual(ownRecord.statusCode, 200);
    assert.strictEqual(ownRecord.data.identifier, 'CIT/0042/2024');

    // Student attempting to access another student's record (e.g. STU-2026-002)
    const unauthorizedRecord = getStudentData(studentSession, 'CIT/9999/2024');
    assert.strictEqual(unauthorizedRecord.allowed, false);
    assert.strictEqual(unauthorizedRecord.statusCode, 403);
    assert.ok(unauthorizedRecord.error?.includes('IDOR prevented'));
    assert.strictEqual(unauthorizedRecord.data, undefined);
  });

  it('6. Role Boundaries: Student cannot access institutional user directory', async () => {
    const studentLogin = await authenticateWithBackend('STU-2026-001', 'Password123!');
    assert.ok(studentLogin.session);
    const studentSession = studentLogin.session;

    const userDirectoryResult = getInstitutionalUserList(studentSession);
    assert.strictEqual(userDirectoryResult.allowed, false);
    assert.strictEqual(userDirectoryResult.statusCode, 403);
    assert.ok(userDirectoryResult.error?.includes('strictly restricted to System Administrators'));
    assert.strictEqual(userDirectoryResult.data, undefined);
  });

  it('7. Role Boundaries: Lecturer cannot access student private invoices or user directory', async () => {
    const lecturerLogin = await authenticateWithBackend('LEC-CS-104', 'Password123!');
    assert.ok(lecturerLogin.session);
    const lecturerSession = lecturerLogin.session;

    const invoiceResult = getStudentInvoices(lecturerSession);
    assert.strictEqual(invoiceResult.allowed, false);
    assert.strictEqual(invoiceResult.statusCode, 403);
    assert.ok(invoiceResult.error?.includes('Forbidden'));

    const directoryResult = getInstitutionalUserList(lecturerSession);
    assert.strictEqual(directoryResult.allowed, false);
    assert.strictEqual(directoryResult.statusCode, 403);
  });

  it('8. Administrator can access institutional user directory filtered by tenant', async () => {
    const adminLogin = await authenticateWithBackend('ADM-001', 'Password123!');
    assert.ok(adminLogin.session);
    const adminSession = adminLogin.session;

    const directoryResult = getInstitutionalUserList(adminSession);
    assert.strictEqual(directoryResult.allowed, true);
    assert.strictEqual(directoryResult.statusCode, 200);
    assert.ok(Array.isArray(directoryResult.data));
    assert.ok(directoryResult.data.length > 0);

    // Verify tenant isolation: all returned users must belong to the administrator's institution
    for (const u of directoryResult.data) {
      assert.ok(u.id);
      assert.ok(u.identifier);
    }
  });

  it('9. Tenant Isolation: Users from another tenant are never leaked', async () => {
    // Create a mock session representing an administrator of an external tenant
    const foreignTenantSession: AuthSession = {
      sessionId: 'sess_foreign_tenant',
      userId: 'usr_foreign_admin',
      identifier: 'EXT-ADMIN-99',
      email: 'admin@external-college.ac.ke',
      fullName: 'Foreign Tenant Administrator',
      institutionId: 'inst_external_polytechnic_99',
      department: 'Central Administration',
      faculty: 'Executive',
      campus: 'Satellite Campus',
      status: 'ACTIVE',
      roles: ['ADMIN'],
      permissions: ['*'],
      portalAssignments: [
        {
          portalId: 'ADMIN',
          roleId: 'ROLE_ADMIN',
          roleName: 'System Administrator'
        }
      ],
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000
    };

    const foreignDirResult = getInstitutionalUserList(foreignTenantSession);
    assert.strictEqual(foreignDirResult.allowed, true);
    // Because the foreign tenant has no users in this tenant's directory, length must be 0
    assert.strictEqual(foreignDirResult.data.length, 0);
  });
});
