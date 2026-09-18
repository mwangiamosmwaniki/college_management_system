import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Strict Navigation Model and Portal Authority Contract Tests', () => {
  const rootDir = process.cwd();

  it('1. CentralHeader top bar has NO portal switcher, dropdown, or cross-portal navigation', () => {
    const centralHeaderPath = path.join(rootDir, 'components/layout/CentralHeader.tsx');
    assert.ok(fs.existsSync(centralHeaderPath), 'CentralHeader.tsx must exist');
    const content = fs.readFileSync(centralHeaderPath, 'utf8');

    // Forbidden UI / IDs / attributes in CentralHeader
    assert.ok(!content.includes('btn-my-workspaces'), 'CentralHeader must not contain btn-my-workspaces');
    assert.ok(!content.includes('Authorized Portals'), 'CentralHeader must not contain Authorized Portals dropdown');
    assert.ok(!content.includes('switch-workspace-'), 'CentralHeader must not contain workspace switcher items');
    assert.ok(!content.includes('navigateToPortal'), 'CentralHeader must not call navigateToPortal');
    assert.ok(!content.includes('isWorkspaceMenuOpen'), 'CentralHeader must not have workspace menu state');
    assert.ok(!content.includes('assignedPortals'), 'CentralHeader must not compute assignedPortals for switching');
    
    // Top bar must remain clean: notifications, help, user profile only
    assert.ok(content.includes('notifications-btn'), 'CentralHeader must retain notifications button');
    assert.ok(content.includes('user-profile-menu-btn'), 'CentralHeader must retain user profile menu');
    assert.ok(content.includes('btn_header_sign_out'), 'CentralHeader profile menu must retain sign out');
  });

  it('2. Staff portals do NOT contain cross-portal navigation buttons or navigateToPortal calls', () => {
    const elearningPath = path.join(rootDir, 'components/portals/learning/ELearningPortalView.tsx');
    const elibraryPath = path.join(rootDir, 'components/portals/elibrary/ELibraryPortalView.tsx');
    const lecturerPath = path.join(rootDir, 'components/portals/lecturer/LecturerPortalView.tsx');

    const elearningContent = fs.readFileSync(elearningPath, 'utf8');
    const elibraryContent = fs.readFileSync(elibraryPath, 'utf8');
    const lecturerContent = fs.readFileSync(lecturerPath, 'utf8');

    assert.ok(!elearningContent.includes('navigateToPortal'), 'ELearningPortalView must not call navigateToPortal');
    assert.ok(!elearningContent.includes('Return to Student Portal'), 'ELearning must not have Return to Student button');
    
    assert.ok(!elibraryContent.includes('navigateToPortal'), 'ELibraryPortalView must not call navigateToPortal');
    assert.ok(!elibraryContent.includes('Return to Student Portal'), 'ELibrary must not have Return to Student button');
    assert.ok(!elibraryContent.includes('Open E-Learning LMS'), 'ELibrary must not have Open LMS button');

    assert.ok(!lecturerContent.includes('navigateToPortal'), 'LecturerPortalView must not call navigateToPortal');
  });

  it('3. Students portal retains authorized learning portal access conditionally based on assignments', () => {
    const studentPath = path.join(rootDir, 'components/portals/student/StudentPortalView.tsx');
    const studentContent = fs.readFileSync(studentPath, 'utf8');

    assert.ok(studentContent.includes('canAccessELearning'), 'Student portal must check for ELEARNING assignment');
    assert.ok(studentContent.includes('canAccessELibrary'), 'Student portal must check for ELIBRARY assignment');
    assert.ok(studentContent.includes('student-access-elearning'), 'Student portal retains authorized LMS button');
    assert.ok(studentContent.includes('student-access-elibrary'), 'Student portal retains authorized Library button');
    assert.ok(studentContent.includes("navigateToPortal('ELEARNING')"), 'Student portal links to ELEARNING when authorized');
    assert.ok(studentContent.includes("navigateToPortal('ELIBRARY')"), 'Student portal links to ELIBRARY when authorized');
  });

  it('4. PortalNavigation sidebar is the authoritative feature navigation for all portals', () => {
    const sidebarPath = path.join(rootDir, 'components/layout/PortalNavigation.tsx');
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

    // Sidebar maps all portals
    const expectedPortals = [
      "'STUDENT'",
      "'LECTURER'",
      "'FINANCE'",
      "'ADMISSIONS'",
      "'APPLICANT'",
      "'HR'",
      "'ELEARNING'",
      "'ELIBRARY'",
      "'EXAMINATIONS'",
      "'HOSTEL'",
      "'HOD'",
      "'REGISTRAR'",
      "'ATTACHMENT'",
      "'PROCUREMENT'",
      "'PRINCIPAL'",
      "'ADMIN'"
    ];

    for (const portal of expectedPortals) {
      assert.ok(sidebarContent.includes(portal), `Sidebar must contain navigation config for ${portal}`);
    }

    // Sidebar does NOT navigate across portals
    assert.ok(!sidebarContent.includes('navigateToPortal'), 'Sidebar must not contain navigateToPortal calls');
    assert.ok(sidebarContent.includes('setActiveNavTab'), 'Sidebar must navigate via setActiveNavTab');
  });

  it('5. Frontend portal routing lib/portal-routing.ts enforces strict assignment-driven resolution', () => {
    const routingPath = path.join(rootDir, 'lib/portal-routing.ts');
    const content = fs.readFileSync(routingPath, 'utf8');

    assert.ok(content.includes('resolveUserDestinationPortal'), 'Must export resolveUserDestinationPortal');
    assert.ok(!content.includes("portalId: 'STUDENT', isDefault: false, isValid: true"), 'Must NOT default to STUDENT fallback');
    assert.ok(content.includes('authorizedAssignments[0].portalId'), 'Must fall back to first authorized assignment');
    assert.ok(content.includes('user.defaultPortalId && authorizedPortalIds.has(user.defaultPortalId)'), 'Must validate defaultPortalId against authorized assignments');
    assert.ok(content.includes('authorizedPortalIds.has(targetPortalHint)'), 'Must validate targetPortalHint against authorized assignments');
    assert.ok(content.includes("'NO_PORTAL_ASSIGNED'"), 'Must resolve to NO_PORTAL_ASSIGNED when user has 0 assignments');
  });

  it('6. Backend AuthService.java enforces authoritative assignment resolution without hard-coded fallbacks', () => {
    const authServicePath = path.join(rootDir, 'backend/src/main/java/ke/college/management/auth/AuthService.java');
    const content = fs.readFileSync(authServicePath, 'utf8');

    assert.ok(content.includes('resolveAndValidateDefaultPortal'), 'AuthService must implement resolveAndValidateDefaultPortal');
    assert.ok(content.includes('assignments.get(0).getPortalId()'), 'Must select first authorized assignment as fallback');
    assert.ok(content.includes('authorizedPortalIds.contains(persisted)'), 'Must validate persisted default against authorized assignments');
    assert.ok(!content.includes('if (hasAdmin) return "ADMIN"'), 'Must not have hard-coded role fallback order');
    assert.ok(content.includes('getActivePortalAssignments'), 'AuthService must read active portal assignments from repository');
  });

  it('7. Database migration V8__user_portal_assignments.sql defines persistent portal assignment domain model', () => {
    const migrationPath = path.join(rootDir, 'backend/src/main/resources/db/migration/V8__user_portal_assignments.sql');
    assert.ok(fs.existsSync(migrationPath), 'V8 migration must exist');
    const content = fs.readFileSync(migrationPath, 'utf8');

    assert.ok(content.includes('CREATE TABLE user_portal_assignments'), 'Migration must create user_portal_assignments table');
    assert.ok(content.includes('user_id VARCHAR(64) NOT NULL'), 'Must link to user_id');
    assert.ok(content.includes('portal_id VARCHAR(32) NOT NULL'), 'Must define portal_id');
    assert.ok(content.includes('is_default BOOLEAN'), 'Must define is_default boolean flag');
    assert.ok(content.includes('active BOOLEAN'), 'Must define active boolean flag');
    assert.ok(content.includes('assigned_at TIMESTAMP WITH TIME ZONE'), 'Must track assigned_at timestamp');
    assert.ok(content.includes('revoked_at TIMESTAMP WITH TIME ZONE'), 'Must track revoked_at timestamp');
    assert.ok(content.includes('idx_user_portal_assignments_active'), 'Must index user and active status');
  });

  it('8. UserPortalAssignment JPA Entity and Repository exist and bind correctly', () => {
    const entityPath = path.join(rootDir, 'backend/src/main/java/ke/college/management/users/entity/UserPortalAssignment.java');
    const repoPath = path.join(rootDir, 'backend/src/main/java/ke/college/management/users/repository/UserPortalAssignmentRepository.java');

    assert.ok(fs.existsSync(entityPath), 'UserPortalAssignment.java must exist');
    assert.ok(fs.existsSync(repoPath), 'UserPortalAssignmentRepository.java must exist');

    const entityContent = fs.readFileSync(entityPath, 'utf8');
    assert.ok(entityContent.includes('@Table(name = "user_portal_assignments")'), 'Entity maps to user_portal_assignments');
    assert.ok(entityContent.includes('private User user;'), 'Entity holds relation to User');
    assert.ok(entityContent.includes('private String portalId;'), 'Entity defines portalId');
    assert.ok(entityContent.includes('Boolean isDefault'), 'Entity defines isDefault');
    assert.ok(entityContent.includes('Boolean active'), 'Entity defines active');
    assert.ok(entityContent.includes('Instant revokedAt;'), 'Entity defines revokedAt');

    const repoContent = fs.readFileSync(repoPath, 'utf8');
    assert.ok(repoContent.includes('findByUserIdAndActiveTrue'), 'Repository provides findByUserIdAndActiveTrue');
    assert.ok(repoContent.includes('findByUserIdAndPortalId'), 'Repository provides findByUserIdAndPortalId');
  });

  it('9. UserController provides administrator-governed portal assignment management', () => {
    const controllerPath = path.join(rootDir, 'backend/src/main/java/ke/college/management/users/UserController.java');
    const content = fs.readFileSync(controllerPath, 'utf8');

    assert.ok(content.includes('userPortalAssignmentRepository'), 'UserController must inject userPortalAssignmentRepository');
    assert.ok(content.includes('assignPortalToUser'), 'UserController must implement assignPortalToUser endpoint');
    assert.ok(content.includes('revokePortalFromUser'), 'UserController must implement revokePortalFromUser endpoint');
    assert.ok(content.includes('getActivePortalAssignments'), 'UserController queries active portal assignments for users');
  });

  it('10. App renders dedicated NoPortalAssignedView without defaulting to Student', () => {
    const pagePath = path.join(rootDir, 'app/page.tsx');
    const noPortalViewPath = path.join(rootDir, 'components/common/NoPortalAssignedView.tsx');

    assert.ok(fs.existsSync(noPortalViewPath), 'NoPortalAssignedView.tsx must exist');
    const pageContent = fs.readFileSync(pagePath, 'utf8');

    assert.ok(pageContent.includes('NoPortalAssignedView'), 'Page must import NoPortalAssignedView');
    assert.ok(pageContent.includes("case 'NO_PORTAL_ASSIGNED':"), 'Page must handle NO_PORTAL_ASSIGNED');
    assert.ok(!pageContent.includes("default:\n        return <StudentPortalView />;"), 'Page default case must NOT return StudentPortalView');
    assert.ok(pageContent.includes("activePortalId === 'NO_PORTAL_ASSIGNED'"), 'Page checks activePortalId === NO_PORTAL_ASSIGNED');
  });
});
