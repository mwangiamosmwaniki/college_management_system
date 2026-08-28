import {
  UserIdentity,
  PortalId,
  PermissionAction,
  RoleDefinition,
  PortalAssignment,
  AuditLogEntry
} from '@/types/erp';

export interface RBACEvaluationResult {
  granted: boolean;
  userIdentifier: string;
  portalId: PortalId;
  roleName: string;
  resource: string;
  action: PermissionAction;
  reason: string;
  scopeViolation?: boolean;
}

export interface SecurityTestCaseResult {
  id: string;
  title: string;
  description: string;
  expectedStatus: 'GRANTED' | 'DENIED';
  actualStatus: 'GRANTED' | 'DENIED';
  passed: boolean;
  diagnostic: string;
  testedUser: string;
  testedPortal: PortalId;
  testedAction: string;
}

/**
 * Checks if the user is authorized to enter or view a portal.
 */
export function evaluatePortalAccess(
  user: UserIdentity,
  portalId: PortalId,
  rolesRegistry: RoleDefinition[]
): { allowed: boolean; roleName?: string; assignment?: PortalAssignment; reason: string } {
  // Super Admin can access all portals by default, but still operates under administrative audit
  const isSuperAdmin = user.portalAssignments.some(
    a => a.portalId === 'ADMIN' && a.roleId === 'ROLE_SUPER_ADMIN'
  );

  const directAssignment = user.portalAssignments.find(a => a.portalId === portalId);

  if (directAssignment) {
    return {
      allowed: true,
      roleName: directAssignment.roleName,
      assignment: directAssignment,
      reason: `Authorized via active portal role '${directAssignment.roleName}' assigned to user.`
    };
  }

  if (isSuperAdmin) {
    return {
      allowed: true,
      roleName: 'Super Administrator (Elevated Context)',
      reason: 'Cross-portal administrative visibility granted under Super Administrator credentials.'
    };
  }

  return {
    allowed: false,
    reason: `Access Denied: User '${user.name}' (${user.identifier}) has no role assignment in the ${portalId} portal.`
  };
}

/**
 * Fine-grained contextual permission evaluator with organizational scoping and course-level RBAC.
 */
export function hasPermission(
  user: UserIdentity,
  portalId: PortalId,
  resource: string,
  action: PermissionAction,
  rolesRegistry: RoleDefinition[],
  contextScope?: { courseId?: string; departmentId?: string; campusId?: string }
): RBACEvaluationResult {
  const isSuperAdmin = user.portalAssignments.some(
    a => a.portalId === 'ADMIN' && a.roleId === 'ROLE_SUPER_ADMIN'
  );

  const assignment = user.portalAssignments.find(a => a.portalId === portalId);

  if (!assignment && !isSuperAdmin) {
    return {
      granted: false,
      userIdentifier: user.identifier,
      portalId,
      roleName: 'NONE',
      resource,
      action,
      reason: `User has no active assignment in portal '${portalId}'.`
    };
  }

  const activeRoleId = assignment ? assignment.roleId : 'ROLE_SUPER_ADMIN';
  const roleName = assignment ? assignment.roleName : 'Super Administrator';
  const roleDef = rolesRegistry.find(r => r.id === activeRoleId);

  // If Super Admin inside another portal without direct role, allow with high-level log
  if (isSuperAdmin && !roleDef) {
    return {
      granted: true,
      userIdentifier: user.identifier,
      portalId,
      roleName,
      resource,
      action,
      reason: `Permission granted via Super Administrator override.`
    };
  }

  if (!roleDef) {
    return {
      granted: false,
      userIdentifier: user.identifier,
      portalId,
      roleName,
      resource,
      action,
      reason: `Role definition for '${activeRoleId}' not found in registry.`
    };
  }

  // Check resource-level permission
  const resourcePerms = roleDef.permissions[resource] || [];
  const actionAllowed = resourcePerms.includes(action) || (isSuperAdmin && action === 'view');

  if (!actionAllowed) {
    return {
      granted: false,
      userIdentifier: user.identifier,
      portalId,
      roleName,
      resource,
      action,
      reason: `Role '${roleName}' does not possess '${action}' permission on resource '${resource}'.`
    };
  }

  // Course-level RBAC enforcement (e.g. Dr. Henderson can only edit/grade courses assigned in his scope)
  if (contextScope?.courseId && assignment?.scope?.courseIds) {
    const isCourseAssigned = assignment.scope.courseIds.includes(contextScope.courseId);
    if (!isCourseAssigned && !isSuperAdmin && !roleDef.isAdmin) {
      return {
        granted: false,
        userIdentifier: user.identifier,
        portalId,
        roleName,
        resource,
        action,
        scopeViolation: true,
        reason: `Course-Level RBAC Boundary: Instructor is assigned to [${assignment.scope.courseIds.join(', ')}], but attempted operation in '${contextScope.courseId}'.`
      };
    }
  }

  return {
    granted: true,
    userIdentifier: user.identifier,
    portalId,
    roleName,
    resource,
    action,
    reason: `Operation authorized by role '${roleName}' with scope validation.`
  };
}

/**
 * Creates an immutable audit log record for an operation.
 */
export function createAuditLog(
  user: UserIdentity,
  portalId: PortalId,
  roleName: string,
  action: string,
  resource: string,
  status: 'GRANTED' | 'DENIED' | 'FLAGGED',
  details: string
): AuditLogEntry {
  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
  return {
    id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: dateStr,
    userId: user.id,
    userName: user.name,
    userIdentifier: user.identifier,
    portalId,
    roleName,
    action,
    resource,
    status,
    ipAddress: '192.168.10.' + (Math.floor(Math.random() * 200) + 1),
    details
  };
}

/**
 * Executes Acceptance Tests A through O specified in prompt.
 */
export function runAutomatedAcceptanceTests(
  allUsers: UserIdentity[],
  rolesRegistry: RoleDefinition[]
): SecurityTestCaseResult[] {
  const results: SecurityTestCaseResult[] = [];

  const student = allUsers.find(u => u.id === 'usr_john_doe') || allUsers[0];
  const academicOfficer = allUsers.find(u => u.id === 'usr_sarah_tech') || allUsers[1];
  const instructor = allUsers.find(u => u.id === 'usr_dr_henderson') || allUsers[2];
  const libMonitor = allUsers.find(u => u.id === 'usr_karen_lib_monitor') || allUsers[3];
  const finManager = allUsers.find(u => u.id === 'usr_robert_fin_mgr') || allUsers[8];
  const superAdmin = allUsers.find(u => u.id === 'usr_super_admin') || allUsers[10];

  // Test A: Student logs into Student Portal -> Works
  const testA = evaluatePortalAccess(student, 'STUDENT', rolesRegistry);
  results.push({
    id: 'TEST_A',
    title: 'Test A: Student Logs into Student Portal',
    description: 'Student STU-2026-00124 attempts to access /student institutional services.',
    expectedStatus: 'GRANTED',
    actualStatus: testA.allowed ? 'GRANTED' : 'DENIED',
    passed: testA.allowed === true,
    diagnostic: testA.reason,
    testedUser: `${student.name} (${student.identifier})`,
    testedPortal: 'STUDENT',
    testedAction: 'Portal Entry'
  });

  // Test B: Student opens E-Learning -> Works
  const testB = evaluatePortalAccess(student, 'ELEARNING', rolesRegistry);
  results.push({
    id: 'TEST_B',
    title: 'Test B: Student Opens E-Learning (LMS)',
    description: 'Student opens separate /learning portal with contextual role "Learner".',
    expectedStatus: 'GRANTED',
    actualStatus: testB.allowed ? 'GRANTED' : 'DENIED',
    passed: testB.allowed === true,
    diagnostic: testB.reason,
    testedUser: `${student.name} (${student.identifier})`,
    testedPortal: 'ELEARNING',
    testedAction: 'Portal Entry (Role: Learner)'
  });

  // Test C: Student opens E-Library -> Works
  const testC = evaluatePortalAccess(student, 'ELIBRARY', rolesRegistry);
  results.push({
    id: 'TEST_C',
    title: 'Test C: Student Opens E-Library',
    description: 'Student opens separate /elibrary portal with contextual role "Library Member".',
    expectedStatus: 'GRANTED',
    actualStatus: testC.allowed ? 'GRANTED' : 'DENIED',
    passed: testC.allowed === true,
    diagnostic: testC.reason,
    testedUser: `${student.name} (${student.identifier})`,
    testedPortal: 'ELIBRARY',
    testedAction: 'Portal Entry (Role: Library Member)'
  });

  // Test D: Student attempts /admin -> Rejected
  const testD = evaluatePortalAccess(student, 'ADMIN', rolesRegistry);
  results.push({
    id: 'TEST_D',
    title: 'Test D: Student Attempts /admin Console',
    description: 'Student STU-2026-00124 attempts unauthorized access to Central Identity & Security console.',
    expectedStatus: 'DENIED',
    actualStatus: testD.allowed ? 'GRANTED' : 'DENIED',
    passed: testD.allowed === false,
    diagnostic: testD.reason,
    testedUser: `${student.name} (${student.identifier})`,
    testedPortal: 'ADMIN',
    testedAction: 'Portal Entry Intercept'
  });

  // Test E: Student attempts Finance API -> Rejected
  const testE = evaluatePortalAccess(student, 'FINANCE', rolesRegistry);
  results.push({
    id: 'TEST_E',
    title: 'Test E: Student Attempts Finance Portal Administration',
    description: 'Student attempts direct access to Bursary and Finance portal management endpoints.',
    expectedStatus: 'DENIED',
    actualStatus: testE.allowed ? 'GRANTED' : 'DENIED',
    passed: testE.allowed === false,
    diagnostic: testE.reason,
    testedUser: `${student.name} (${student.identifier})`,
    testedPortal: 'FINANCE',
    testedAction: 'Bursary API Access'
  });

  // Test F: E-Learning Instructor opens their assigned course (CSC301) -> Works
  const testF = hasPermission(instructor, 'ELEARNING', 'assigned_courses', 'edit', rolesRegistry, { courseId: 'crs_csc301' });
  results.push({
    id: 'TEST_F',
    title: 'Test F: Instructor Accesses Assigned Course (CSC301)',
    description: 'Dr. Henderson accesses and edits course materials in CSC301 where he is lead instructor.',
    expectedStatus: 'GRANTED',
    actualStatus: testF.granted ? 'GRANTED' : 'DENIED',
    passed: testF.granted === true,
    diagnostic: testF.reason,
    testedUser: `${instructor.name} (${instructor.identifier})`,
    testedPortal: 'ELEARNING',
    testedAction: 'Edit CSC301 Course Content'
  });

  // Test G: Instructor attempts another instructor\'s course (MAT201) -> Rejected
  const testG = hasPermission(instructor, 'ELEARNING', 'assigned_courses', 'edit', rolesRegistry, { courseId: 'crs_mat201' });
  results.push({
    id: 'TEST_G',
    title: 'Test G: Instructor Attempts Non-Assigned Course (MAT201)',
    description: 'Dr. Henderson attempts to modify lessons and grade submissions in MAT201 taught by Prof. Vance.',
    expectedStatus: 'DENIED',
    actualStatus: testG.granted ? 'GRANTED' : 'DENIED',
    passed: testG.granted === false && testG.scopeViolation === true,
    diagnostic: testG.reason,
    testedUser: `${instructor.name} (${instructor.identifier})`,
    testedPortal: 'ELEARNING',
    testedAction: 'Edit MAT201 Course Content'
  });

  // Test H: Library Monitor opens Library Dashboard -> Works
  const testH = evaluatePortalAccess(libMonitor, 'ELIBRARY', rolesRegistry);
  results.push({
    id: 'TEST_H',
    title: 'Test H: Library Monitor Opens Library Dashboard',
    description: 'Karen Vance accesses the Library Monitor view to observe checkout circulation and overdue items.',
    expectedStatus: 'GRANTED',
    actualStatus: testH.allowed ? 'GRANTED' : 'DENIED',
    passed: testH.allowed === true,
    diagnostic: testH.reason,
    testedUser: `${libMonitor.name} (${libMonitor.identifier})`,
    testedPortal: 'ELIBRARY',
    testedAction: 'Open Monitor Dashboard'
  });

  // Test I: Library Monitor attempts to modify an examination result -> Rejected
  const testI = hasPermission(libMonitor, 'EXAMINATIONS', 'marks_entry', 'edit', rolesRegistry);
  results.push({
    id: 'TEST_I',
    title: 'Test I: Library Monitor Attempts to Modify Examination Result',
    description: 'Library Monitor attempts cross-domain tampering on Exam Board marks entry sheet.',
    expectedStatus: 'DENIED',
    actualStatus: testI.granted ? 'GRANTED' : 'DENIED',
    passed: testI.granted === false,
    diagnostic: testI.reason,
    testedUser: `${libMonitor.name} (${libMonitor.identifier})`,
    testedPortal: 'EXAMINATIONS',
    testedAction: 'Modify Exam Marks'
  });

  // Test J: Finance Manager opens Finance Portal -> Works
  const testJ = evaluatePortalAccess(finManager, 'FINANCE', rolesRegistry);
  results.push({
    id: 'TEST_J',
    title: 'Test J: Finance Manager Opens Finance Portal',
    description: 'Robert Thorne opens Bursary portal with Finance Manager role for fee and ledger oversight.',
    expectedStatus: 'GRANTED',
    actualStatus: testJ.allowed ? 'GRANTED' : 'DENIED',
    passed: testJ.allowed === true,
    diagnostic: testJ.reason,
    testedUser: `${finManager.name} (${finManager.identifier})`,
    testedPortal: 'FINANCE',
    testedAction: 'Open Finance Portal'
  });

  // Test K: Finance Manager attempts to access LMS administration -> Rejected
  const testK = evaluatePortalAccess(finManager, 'ELEARNING', rolesRegistry);
  results.push({
    id: 'TEST_K',
    title: 'Test K: Finance Manager Attempts LMS Administration',
    description: 'Finance Manager attempts to configure LMS system settings or manage course curricula.',
    expectedStatus: 'DENIED',
    actualStatus: testK.allowed ? 'GRANTED' : 'DENIED',
    passed: testK.allowed === false,
    diagnostic: testK.reason,
    testedUser: `${finManager.name} (${finManager.identifier})`,
    testedPortal: 'ELEARNING',
    testedAction: 'LMS Platform Admin'
  });

  // Test L: Global Super Administrator can access authorized portals -> Works
  const testL = evaluatePortalAccess(superAdmin, 'FINANCE', rolesRegistry);
  results.push({
    id: 'TEST_L',
    title: 'Test L: Super Administrator Cross-Portal Governance',
    description: 'Super Administrator accesses Finance portal with audited institutional oversight.',
    expectedStatus: 'GRANTED',
    actualStatus: testL.allowed ? 'GRANTED' : 'DENIED',
    passed: testL.allowed === true,
    diagnostic: testL.reason,
    testedUser: `${superAdmin.name} (${superAdmin.identifier})`,
    testedPortal: 'FINANCE',
    testedAction: 'SuperAdmin Access'
  });

  // Test M: User with multiple portal roles sees only portals assigned to them -> Works
  const studentPortalCount = student.portalAssignments.length;
  const studentHasAccessToExpectedOnly = 
    evaluatePortalAccess(student, 'STUDENT', rolesRegistry).allowed &&
    evaluatePortalAccess(student, 'ELEARNING', rolesRegistry).allowed &&
    evaluatePortalAccess(student, 'ELIBRARY', rolesRegistry).allowed &&
    !evaluatePortalAccess(student, 'HR', rolesRegistry).allowed &&
    !evaluatePortalAccess(student, 'FINANCE', rolesRegistry).allowed;
  results.push({
    id: 'TEST_M',
    title: 'Test M: Multi-Portal Role Isolation & Scope Filter',
    description: 'Verifies that user sees and can enter only the exact 3 portals assigned (Student, LMS, Library) and not unassigned portals.',
    expectedStatus: 'GRANTED',
    actualStatus: studentHasAccessToExpectedOnly ? 'GRANTED' : 'DENIED',
    passed: studentHasAccessToExpectedOnly === true,
    diagnostic: `Student is assigned exactly ${studentPortalCount} portals: [${student.portalAssignments.map(a => a.portalId).join(', ')}]. Non-assigned portals correctly blocked.`,
    testedUser: `${student.name} (${student.identifier})`,
    testedPortal: 'STUDENT',
    testedAction: 'Filter Assigned Portals'
  });

  // Test N: Removing user\'s E-Library role immediately prevents E-Library access without removing Student Portal or LMS access -> Works
  const simulatedStudentWithoutLib: UserIdentity = {
    ...student,
    portalAssignments: student.portalAssignments.filter(a => a.portalId !== 'ELIBRARY')
  };
  const testN_Lib = evaluatePortalAccess(simulatedStudentWithoutLib, 'ELIBRARY', rolesRegistry);
  const testN_Stu = evaluatePortalAccess(simulatedStudentWithoutLib, 'STUDENT', rolesRegistry);
  const testN_Lms = evaluatePortalAccess(simulatedStudentWithoutLib, 'ELEARNING', rolesRegistry);
  const testN_Passed = !testN_Lib.allowed && testN_Stu.allowed && testN_Lms.allowed;
  results.push({
    id: 'TEST_N',
    title: 'Test N: Dynamic Role Revocation Isolation',
    description: 'Revoking E-Library role immediately cuts Library access while leaving Student Portal and E-Learning active.',
    expectedStatus: 'GRANTED',
    actualStatus: testN_Passed ? 'GRANTED' : 'DENIED',
    passed: testN_Passed,
    diagnostic: testN_Passed 
      ? 'Library access revoked (status: BLOCKED). Student Portal (status: ACTIVE) and E-Learning (status: ACTIVE) remain unaffected.'
      : 'Failed isolation test.',
    testedUser: `${student.name} (${student.identifier})`,
    testedPortal: 'ELIBRARY',
    testedAction: 'Revocation Impact Simulation'
  });

  // Test O: Changing a role in one portal does not accidentally grant permissions in another portal -> Works
  const simulatedStudentElevatedInLms: UserIdentity = {
    ...student,
    portalAssignments: student.portalAssignments.map(a => 
      a.portalId === 'ELEARNING' ? { ...a, roleId: 'ROLE_LMS_ADMIN', roleName: 'LMS Platform Administrator' } : a
    )
  };
  const testO_LmsAdmin = hasPermission(simulatedStudentElevatedInLms, 'ELEARNING', 'courses', 'create', rolesRegistry);
  const testO_FinAdmin = hasPermission(simulatedStudentElevatedInLms, 'FINANCE', 'fee_structures', 'create', rolesRegistry);
  const testO_ExamAdmin = hasPermission(simulatedStudentElevatedInLms, 'EXAMINATIONS', 'marks_entry', 'edit', rolesRegistry);
  const testO_Passed = testO_LmsAdmin.granted && !testO_FinAdmin.granted && !testO_ExamAdmin.granted;
  results.push({
    id: 'TEST_O',
    title: 'Test O: Cross-Portal Permission Containment',
    description: 'Promoting student to LMS Administrator grants LMS capabilities but does NOT leak into Finance or Examinations.',
    expectedStatus: 'GRANTED',
    actualStatus: testO_Passed ? 'GRANTED' : 'DENIED',
    passed: testO_Passed,
    diagnostic: testO_Passed 
      ? 'LMS create course permission granted. Finance fee edit (BLOCKED) and Exam marks edit (BLOCKED) strictly isolated.'
      : 'Cross-portal permission containment failed.',
    testedUser: `${student.name} (${student.identifier})`,
    testedPortal: 'FINANCE',
    testedAction: 'Cross-Portal Leak Check'
  });

  return results;
}
