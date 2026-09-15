export interface PortalAssignmentPayload {
  portalId: string;
  roleId: string;
  roleName: string;
  isAdmin: boolean;
  isMonitor: boolean;
  assignedAt: string;
}

export interface FallbackUser {
  userId: string;
  id: string;
  identifier: string;
  email: string;
  fullName: string;
  name: string;
  institutionId: string;
  institution: string;
  department: string;
  faculty: string;
  campus: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'ON_LEAVE';
  roles: string[];
  permissions: string[];
  portalAssignments: PortalAssignmentPayload[];
}

export const FALLBACK_USERS: FallbackUser[] = [
  {
    userId: 'usr_admin',
    id: 'usr_admin',
    identifier: 'ADM-001',
    email: 'admin@apex.edu',
    fullName: 'Dr. Elizabeth Mutua',
    name: 'Dr. Elizabeth Mutua',
    institutionId: 'inst_apex_tvet',
    institution: 'Apex National Polytechnic',
    department: 'Computing & Informatics',
    faculty: 'School of Technology & Applied Sciences',
    campus: 'Main Campus (Nairobi)',
    status: 'ACTIVE',
    roles: ['ROLE_ADMIN', 'ADMIN'],
    permissions: [
      'p_inst_manage',
      'p_usr_manage',
      'p_stu_view',
      'p_stu_edit',
      'p_crs_manage',
      'p_fin_inv',
      'p_fin_pay',
      'p_rep_view',
      'p_sys_config'
    ],
    portalAssignments: [
      {
        portalId: 'ADMIN',
        roleId: 'ROLE_ADMIN',
        roleName: 'System Administrator',
        isAdmin: true,
        isMonitor: false,
        assignedAt: '2026-01-01'
      },
      {
        portalId: 'EXAMINATIONS',
        roleId: 'ROLE_EXAM_OFFICER',
        roleName: 'Examinations Director',
        isAdmin: true,
        isMonitor: false,
        assignedAt: '2026-01-01'
      },
      {
        portalId: 'FINANCE',
        roleId: 'ROLE_FINANCE_ADMIN',
        roleName: 'Finance Administrator',
        isAdmin: true,
        isMonitor: false,
        assignedAt: '2026-01-01'
      },
      {
        portalId: 'ADMISSIONS',
        roleId: 'ROLE_ADMISSIONS_OFFICER',
        roleName: 'Admissions Officer',
        isAdmin: true,
        isMonitor: false,
        assignedAt: '2026-01-01'
      },
      {
        portalId: 'LECTURER',
        roleId: 'ROLE_LECTURER',
        roleName: 'Senior Lecturer',
        isAdmin: false,
        isMonitor: false,
        assignedAt: '2026-01-01'
      },
      {
        portalId: 'STUDENT',
        roleId: 'ROLE_STUDENT_SUPERVISOR',
        roleName: 'Student Affairs Supervisor',
        isAdmin: false,
        isMonitor: true,
        assignedAt: '2026-01-01'
      }
    ]
  },
  {
    userId: 'usr_dean',
    id: 'usr_dean',
    identifier: 'STAFF-DEAN-01',
    email: 'dean.academics@apex.edu',
    fullName: 'Prof. Geoffrey Kamau',
    name: 'Prof. Geoffrey Kamau',
    institutionId: 'inst_apex_tvet',
    institution: 'Apex National Polytechnic',
    department: 'Electrical & Electronic Engineering',
    faculty: 'Faculty of Engineering & Built Environment',
    campus: 'Main Campus (Nairobi)',
    status: 'ACTIVE',
    roles: ['ROLE_DEAN', 'DEAN'],
    permissions: [
      'p_stu_view',
      'p_crs_manage',
      'p_rep_view',
      'p_mark_enter',
      'p_mark_mod'
    ],
    portalAssignments: [
      {
        portalId: 'EXAMINATIONS',
        roleId: 'ROLE_DEAN',
        roleName: 'Academic Dean & Exams Moderator',
        isAdmin: true,
        isMonitor: false,
        assignedAt: '2026-01-01'
      },
      {
        portalId: 'LECTURER',
        roleId: 'ROLE_PROFESSOR',
        roleName: 'Professor of Engineering',
        isAdmin: false,
        isMonitor: false,
        assignedAt: '2026-01-01'
      }
    ]
  },
  {
    userId: 'usr_lecturer',
    id: 'usr_lecturer',
    identifier: 'LEC-CS-104',
    email: 'p.mwangi@apex.edu',
    fullName: 'Eng. Patrick Mwangi',
    name: 'Eng. Patrick Mwangi',
    institutionId: 'inst_apex_tvet',
    institution: 'Apex National Polytechnic',
    department: 'Computing & Informatics',
    faculty: 'School of Technology & Applied Sciences',
    campus: 'Main Campus (Nairobi)',
    status: 'ACTIVE',
    roles: ['ROLE_LECTURER', 'LECTURER'],
    permissions: ['p_stu_view', 'p_crs_manage', 'p_mark_enter'],
    portalAssignments: [
      {
        portalId: 'LECTURER',
        roleId: 'ROLE_LECTURER',
        roleName: 'Lecturer',
        isAdmin: false,
        isMonitor: false,
        assignedAt: '2026-01-01'
      },
      {
        portalId: 'ELEARNING',
        roleId: 'ROLE_LMS_INSTRUCTOR',
        roleName: 'Course Instructor',
        isAdmin: false,
        isMonitor: false,
        assignedAt: '2026-01-01'
      }
    ]
  },
  {
    userId: 'usr_finance',
    id: 'usr_finance',
    identifier: 'BURSAR-02',
    email: 'finance@apex.edu',
    fullName: 'CPA Moses Cheruiyot',
    name: 'CPA Moses Cheruiyot',
    institutionId: 'inst_apex_tvet',
    institution: 'Apex National Polytechnic',
    department: 'Business Studies',
    faculty: 'School of Business & Management Studies',
    campus: 'Main Campus (Nairobi)',
    status: 'ACTIVE',
    roles: ['ROLE_FINANCE', 'FINANCE'],
    permissions: ['p_stu_view', 'p_fin_inv', 'p_fin_pay'],
    portalAssignments: [
      {
        portalId: 'FINANCE',
        roleId: 'ROLE_FINANCE',
        roleName: 'Bursar & Finance Officer',
        isAdmin: true,
        isMonitor: false,
        assignedAt: '2026-01-01'
      }
    ]
  },
  {
    userId: 'usr_student',
    id: 'usr_student',
    identifier: 'CIT/0042/2024',
    email: 'john.kariuki@students.apex.edu',
    fullName: 'John Kariuki',
    name: 'John Kariuki',
    institutionId: 'inst_apex_tvet',
    institution: 'Apex National Polytechnic',
    department: 'Computing & Informatics',
    faculty: 'School of Technology & Applied Sciences',
    campus: 'Main Campus (Nairobi)',
    status: 'ACTIVE',
    roles: ['ROLE_STUDENT', 'STUDENT'],
    permissions: ['p_stu_view'],
    portalAssignments: [
      {
        portalId: 'STUDENT',
        roleId: 'ROLE_STUDENT',
        roleName: 'Student (Year 2)',
        isAdmin: false,
        isMonitor: false,
        assignedAt: '2026-01-01'
      },
      {
        portalId: 'ELEARNING',
        roleId: 'ROLE_LMS_LEARNER',
        roleName: 'Learner',
        isAdmin: false,
        isMonitor: false,
        assignedAt: '2026-01-01'
      },
      {
        portalId: 'ELIBRARY',
        roleId: 'ROLE_LIB_MEMBER',
        roleName: 'Library Member',
        isAdmin: false,
        isMonitor: false,
        assignedAt: '2026-01-01'
      }
    ]
  }
];

// In-memory active session store for local/preview runtime
const activeSessions = new Map<string, { user: FallbackUser; createdAt: number }>();

function getSessionIdFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)SESSION=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export function handleFallbackLogin(bodyText: string): Response {
  let identifier = '';
  let password = '';

  try {
    const json = JSON.parse(bodyText);
    identifier = (json.identifier || json.username || json.email || '').trim().toLowerCase();
    password = json.password || '';
  } catch {
    return Response.json(
      {
        success: false,
        message: 'Invalid request body. Please provide identifier and password.'
      },
      { status: 400 }
    );
  }

  if (!identifier || !password) {
    return Response.json(
      {
        success: false,
        message: 'Please enter your identifier and password.'
      },
      { status: 400 }
    );
  }

  const user = FALLBACK_USERS.find(
    u => u.identifier.toLowerCase() === identifier || u.email.toLowerCase() === identifier
  );

  // Authoritative default password seeded across the institution
  const isValidPassword = password === 'Password123!' || password === 'admin' || password === 'password';

  if (!user || !isValidPassword) {
    return Response.json(
      {
        success: false,
        message: 'Invalid credentials. Please check your identifier and password.'
      },
      { status: 401 }
    );
  }

  const sessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  activeSessions.set(sessionId, { user, createdAt: Date.now() });

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set(
    'Set-Cookie',
    `SESSION=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
  );

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Authenticated successfully',
      data: {
        userId: user.userId,
        id: user.id,
        identifier: user.identifier,
        email: user.email,
        fullName: user.fullName,
        name: user.name,
        institutionId: user.institutionId,
        institution: user.institution,
        department: user.department,
        faculty: user.faculty,
        campus: user.campus,
        status: user.status,
        roles: user.roles,
        permissions: user.permissions,
        portalAssignments: user.portalAssignments
      }
    }),
    {
      status: 200,
      headers
    }
  );
}

export function handleFallbackMe(req: Request): Response {
  const sessionId = getSessionIdFromRequest(req);
  if (!sessionId || !activeSessions.has(sessionId)) {
    return Response.json(
      {
        success: false,
        message: 'Unauthorized: Session missing or expired'
      },
      { status: 401 }
    );
  }

  const session = activeSessions.get(sessionId)!;
  const user = session.user;

  return Response.json({
    success: true,
    message: 'Current authenticated session',
    data: {
      userId: user.userId,
      id: user.id,
      identifier: user.identifier,
      email: user.email,
      fullName: user.fullName,
      name: user.name,
      institutionId: user.institutionId,
      institution: user.institution,
      department: user.department,
      faculty: user.faculty,
      campus: user.campus,
      status: user.status,
      roles: user.roles,
      permissions: user.permissions,
      portalAssignments: user.portalAssignments
    }
  });
}

export function handleFallbackLogout(req: Request): Response {
  const sessionId = getSessionIdFromRequest(req);
  if (sessionId) {
    activeSessions.delete(sessionId);
  }

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Set-Cookie', 'SESSION=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax');

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Logged out successfully'
    }),
    {
      status: 200,
      headers
    }
  );
}

export function handleFallbackUsers(): Response {
  return Response.json({
    success: true,
    message: 'User list retrieved',
    data: FALLBACK_USERS.map(u => ({
      userId: u.userId,
      id: u.id,
      identifier: u.identifier,
      email: u.email,
      fullName: u.fullName,
      name: u.name,
      institutionId: u.institutionId,
      institution: u.institution,
      department: u.department,
      campus: u.campus,
      status: u.status,
      roles: u.roles,
      portalAssignments: u.portalAssignments
    }))
  });
}
