import {
  PortalDefinition,
  RoleDefinition,
  UserIdentity,
  InstitutionalSettings,
  AcademicCourse,
  StudentProfileData,
  StudentInvoice,
  StudentRequest,
  ClearanceItem,
  LMSCourse,
  LibraryBook,
  LibraryLoan,
  DigitalResource,
  LibraryReservation,
  PaymentRecord,
  ExaminationResultWorkflow,
  EmployeeRecord,
  LeaveRequest,
  PayrollBatch,
  AdmissionApplication,
  HostelRoom,
  AuditLogEntry,
  CrossPortalEvent,
  PortalNotification,
  LecturerCourseFull,
  LecturerCourseMaterial,
  LecturerLessonSchedule,
  LecturerAttendanceSession,
  LecturerAssignmentItem,
  LecturerGradingRubric,
  QuestionBankItem,
  LecturerOnlineTest,
  LecturerStudentProfile,
  CourseGradebookEntry,
  GradeChangeRequest,
  AcademicAdvisingRecord,
  StudentReferralItem,
  SupervisionProject,
  ResearchPublicationItem,
  LecturerTaskItem,
  LecturerMeetingSchedule,
  LecturerWorkloadStats,
  LecturerResourceRequest
} from '@/types/erp';

export const PORTAL_REGISTRY: PortalDefinition[] = [
  {
    id: 'PUBLIC',
    name: 'Public Website & Prospectus',
    code: 'PUB_WEB',
    description: 'Public landing website, programme catalogue, department directory, news, downloads & fee structures.',
    urlPrefix: '/public',
    status: 'ONLINE',
    version: 'v2.0.0',
    ownerDepartment: 'Public Relations & Marketing',
    adminRole: 'Webmaster',
    themeColor: 'emerald',
    accentColor: '#059669',
    iconName: 'Globe',
    defaultRoles: ['Public Visitor', 'Webmaster', 'PR Officer']
  },
  {
    id: 'APPLICANT',
    name: 'Applicant & Admissions Portal',
    code: 'APP_ADM',
    description: 'Online application wizard, document uploads, M-Pesa application fee, and admission offer tracker.',
    urlPrefix: '/applicant',
    status: 'ONLINE',
    version: 'v2.4.0',
    ownerDepartment: 'Academic Admissions Directorate',
    adminRole: 'Admissions Officer',
    themeColor: 'teal',
    accentColor: '#0d9488',
    iconName: 'UserPlus',
    defaultRoles: ['Applicant', 'Admissions Officer', 'Admissions Administrator']
  },
  {
    id: 'STUDENT',
    name: 'Student Portal',
    code: 'STU_SVC',
    description: 'Institutional student self-service, registration, grades, clearance, and billing.',
    urlPrefix: '/student',
    status: 'ONLINE',
    version: 'v2.8.4',
    ownerDepartment: 'Student Affairs & Registry',
    adminRole: 'Student Portal Administrator',
    themeColor: 'blue',
    accentColor: '#2563eb',
    iconName: 'GraduationCap',
    defaultRoles: ['Student', 'Student Portal Administrator', 'Student Portal Monitor']
  },
  {
    id: 'LECTURER',
    name: 'Lecturer & Faculty Portal',
    code: 'LEC_ACAD',
    description: 'Faculty workspace for course delivery, grading, attendance, advising, supervision & research.',
    urlPrefix: '/lecturer',
    status: 'ONLINE',
    version: 'v3.5.0',
    ownerDepartment: 'Academic Affairs & Faculty Directorate',
    adminRole: 'Lecturer Portal Administrator',
    themeColor: 'indigo',
    accentColor: '#4f46e5',
    iconName: 'GraduationCap',
    defaultRoles: [
      'Lecturer',
      'Senior Lecturer',
      'Professor',
      'Course Coordinator',
      'Head of Department',
      'Dean',
      'Teaching Assistant',
      'Grader',
      'Academic Advisor',
      'Project Supervisor',
      'Lecturer Monitor',
      'Lecturer Portal Administrator'
    ]
  },
  {
    id: 'HOD',
    name: 'HOD & Academic Department Portal',
    code: 'HOD_ACAD',
    description: 'Curricula management, lecturer unit allocation, workload balancing, timetable conflict resolution & marks moderation.',
    urlPrefix: '/hod',
    status: 'ONLINE',
    version: 'v2.1.0',
    ownerDepartment: 'Academic Departments',
    adminRole: 'Head of Department',
    themeColor: 'indigo',
    accentColor: '#4338ca',
    iconName: 'Building',
    defaultRoles: ['Head of Department', 'Departmental Moderator', 'Curriculum Coordinator']
  },
  {
    id: 'REGISTRAR',
    name: 'Registrar & Academic Affairs',
    code: 'REG_OFF',
    description: 'Central student master registry, matriculation, admission handover, academic calendar & graduation gazettes.',
    urlPrefix: '/registrar',
    status: 'ONLINE',
    version: 'v3.0.0',
    ownerDepartment: 'Academic Affairs & Registry',
    adminRole: 'Registrar (Academic Affairs)',
    themeColor: 'blue',
    accentColor: '#1d4ed8',
    iconName: 'FileCheck',
    defaultRoles: ['Registrar (Academic Affairs)', 'Assistant Registrar', 'Admissions Registrar']
  },
  {
    id: 'EXAMINATIONS',
    name: 'Examinations & Marks Board',
    code: 'EXAM_SEC',
    description: 'Exam scheduling, invigilation, marks entry, moderation, and results publication.',
    urlPrefix: '/exams',
    status: 'ONLINE',
    version: 'v2.2.0',
    ownerDepartment: 'Academic Planning & Exam Office',
    adminRole: 'Examination Administrator',
    themeColor: 'rose',
    accentColor: '#e11d48',
    iconName: 'FileSpreadsheet',
    defaultRoles: [
      'Examination Administrator',
      'Examination Manager',
      'Examination Officer',
      'Moderator',
      'Marks Entry Officer',
      'Examination Monitor',
      'Registrar'
    ]
  },
  {
    id: 'FINANCE',
    name: 'Finance & Student Accounts',
    code: 'FIN_ACC',
    description: 'Fee collection, cashiering, verification, reconciliation, and segregation of duties.',
    urlPrefix: '/finance',
    status: 'ONLINE',
    version: 'v4.0.2',
    ownerDepartment: 'Bursary & Financial Services',
    adminRole: 'Finance Administrator',
    themeColor: 'violet',
    accentColor: '#7c3aed',
    iconName: 'Receipt',
    defaultRoles: [
      'Finance Administrator',
      'Finance Manager',
      'Accountant',
      'Cashier',
      'Finance Officer',
      'Finance Monitor',
      'Auditor'
    ]
  },
  {
    id: 'ATTACHMENT',
    name: 'Industrial Attachment & Careers',
    code: 'ATT_IND',
    description: 'Student industry placement, digital weekly logbooks, lecturer site assessment rubrics & certification.',
    urlPrefix: '/attachment',
    status: 'ONLINE',
    version: 'v2.0.0',
    ownerDepartment: 'Industrial Attachment & Liaison Directorate',
    adminRole: 'Industrial Liaison Officer',
    themeColor: 'amber',
    accentColor: '#d97706',
    iconName: 'Briefcase',
    defaultRoles: ['Industrial Liaison Officer', 'Visiting Assessor', 'Industry Supervisor', 'Student Attaché']
  },
  {
    id: 'PROCUREMENT',
    name: 'Procurement & Stores Management',
    code: 'PROC_STR',
    description: 'Department requisitions, approval chain, purchase orders, store inventory, and goods received notes (GRN).',
    urlPrefix: '/procurement',
    status: 'ONLINE',
    version: 'v2.2.0',
    ownerDepartment: 'Procurement & Supplies Directorate',
    adminRole: 'Head of Procurement',
    themeColor: 'orange',
    accentColor: '#ea580c',
    iconName: 'PackageCheck',
    defaultRoles: ['Head of Procurement', 'Procurement Officer', 'Storekeeper', 'Requisitioner']
  },
  {
    id: 'PRINCIPAL',
    name: 'Principal & Executive Dashboard',
    code: 'EXEC_DIR',
    description: 'High-level institutional intelligence, enrollment analytics, financial collection, departmental KPIs & authorizations.',
    urlPrefix: '/principal',
    status: 'ONLINE',
    version: 'v2.5.0',
    ownerDepartment: 'Office of the Principal',
    adminRole: 'Principal / CEO',
    themeColor: 'purple',
    accentColor: '#9333ea',
    iconName: 'LineChart',
    defaultRoles: ['Principal / CEO', 'Deputy Principal (Academics)', 'Deputy Principal (Admin & Finance)']
  },
  {
    id: 'ELEARNING',
    name: 'E-Learning (LMS)',
    code: 'LMS_CORE',
    description: 'Learning management system, course modules, assignments, quizzes, and grading.',
    urlPrefix: '/learning',
    status: 'ONLINE',
    version: 'v3.4.1',
    ownerDepartment: 'Centre for Academic Technologies',
    adminRole: 'LMS Platform Administrator',
    themeColor: 'emerald',
    accentColor: '#059669',
    iconName: 'BookOpenCheck',
    defaultRoles: [
      'LMS Platform Administrator',
      'LMS Manager',
      'LMS Course Manager',
      'Course Instructor',
      'Teaching Assistant',
      'LMS Grader',
      'LMS Content Creator',
      'LMS Monitor',
      'Learner'
    ]
  },
  {
    id: 'ELIBRARY',
    name: 'E-Library & Resource Hub',
    code: 'LIB_SYS',
    description: 'Physical book circulation, digital subscriptions, journals, and DRM resource hub.',
    urlPrefix: '/elibrary',
    status: 'ONLINE',
    version: 'v2.1.0',
    ownerDepartment: 'University Library System',
    adminRole: 'Library Administrator',
    themeColor: 'amber',
    accentColor: '#d97706',
    iconName: 'Library',
    defaultRoles: [
      'Library Administrator',
      'Library Manager',
      'Librarian',
      'Digital Librarian',
      'Library Monitor',
      'Library Member'
    ]
  },
  {
    id: 'ADMISSIONS',
    name: 'Admissions & Enrollment',
    code: 'ADM_CRM',
    description: 'Applicant pipeline, document verification, interview scheduling, and offer letters.',
    urlPrefix: '/admissions',
    status: 'ONLINE',
    version: 'v1.9.0',
    ownerDepartment: 'Admissions Directorate',
    adminRole: 'Admissions Administrator',
    themeColor: 'teal',
    accentColor: '#0d9488',
    iconName: 'UserCheck',
    defaultRoles: [
      'Admissions Administrator',
      'Admissions Manager',
      'Admissions Officer',
      'Document Verification Officer',
      'Admissions Monitor',
      'Applicant'
    ]
  },
  {
    id: 'HR',
    name: 'Human Resources & Payroll',
    code: 'HR_PAY',
    description: 'Staff profiles, leave management, attendance tracking, and payroll processing batches.',
    urlPrefix: '/hr',
    status: 'ONLINE',
    version: 'v2.6.0',
    ownerDepartment: 'Human Resources Management',
    adminRole: 'HR Administrator',
    themeColor: 'indigo',
    accentColor: '#4f46e5',
    iconName: 'Users',
    defaultRoles: [
      'HR Administrator',
      'HR Manager',
      'HR Officer',
      'Payroll Officer',
      'HR Monitor',
      'Employee'
    ]
  },
  {
    id: 'HOSTEL',
    name: 'Hostel & Residential Services',
    code: 'HOSTEL_RES',
    description: 'Hostel wings, bed allocation, maintenance tickets, and residential compliance.',
    urlPrefix: '/hostel',
    status: 'ONLINE',
    version: 'v1.5.0',
    ownerDepartment: 'Student Residential Board',
    adminRole: 'Hostel Administrator',
    themeColor: 'cyan',
    accentColor: '#0891b2',
    iconName: 'Building2',
    defaultRoles: ['Hostel Administrator', 'Hostel Manager', 'Warden', 'Hostel Monitor', 'Resident Student']
  },
  {
    id: 'ADMIN',
    name: 'Central Identity & Security Console',
    code: 'CORE_SEC',
    description: 'Cross-portal governance, RBAC matrix, audit log ingestion, and health telemetry.',
    urlPrefix: '/admin',
    status: 'ONLINE',
    version: 'v5.0.0',
    ownerDepartment: 'University Information & Security Directorate',
    adminRole: 'Super Administrator',
    themeColor: 'slate',
    accentColor: '#334155',
    iconName: 'ShieldAlert',
    defaultRoles: ['Super Administrator', 'Security Auditor']
  }
];

export const INITIAL_ROLES: RoleDefinition[] = [
  // Student Portal
  {
    id: 'ROLE_STUDENT',
    portalId: 'STUDENT',
    name: 'Student',
    description: 'Standard institutional student self-service access.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      profile: ['view'],
      registration: ['view', 'create'],
      results: ['view'],
      invoices: ['view', 'download'],
      requests: ['view', 'create'],
      documents: ['view', 'download'],
      clearance: ['view']
    }
  },
  {
    id: 'ROLE_STUDENT_ADMIN',
    portalId: 'STUDENT',
    name: 'Student Portal Administrator',
    description: 'Configures student portal workflows, announcements, and self-service rules.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: true,
    permissions: {
      profile: ['view', 'edit'],
      registration: ['view', 'edit', 'approve', 'configure'],
      results: ['view'],
      invoices: ['view'],
      requests: ['view', 'edit', 'approve'],
      announcements: ['view', 'create', 'edit', 'delete'],
      portal_settings: ['view', 'configure']
    }
  },
  {
    id: 'ROLE_STUDENT_MONITOR',
    portalId: 'STUDENT',
    name: 'Student Portal Monitor',
    description: 'Read-only oversight of active student activity and request throughput without edit rights.',
    isSystemDefault: true,
    isMonitor: true,
    isAdmin: false,
    permissions: {
      profile: ['view'],
      registration: ['view', 'monitor', 'export'],
      results: ['view', 'monitor'],
      requests: ['view', 'monitor'],
      activity_logs: ['view', 'monitor']
    }
  },

  // Lecturer & Faculty Portal Roles
  {
    id: 'ROLE_LECTURER',
    portalId: 'LECTURER',
    name: 'Lecturer',
    description: 'Standard academic faculty role for course teaching, attendance tracking, grading, and student mentoring.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      courses: ['view', 'edit'],
      materials: ['view', 'create', 'edit', 'delete', 'download'],
      lessons: ['view', 'create', 'edit'],
      attendance: ['view', 'create', 'edit', 'export'],
      assignments: ['view', 'create', 'edit', 'grade'],
      grading: ['view', 'grade', 'export'],
      tests: ['view', 'create', 'edit', 'grade'],
      gradebook: ['view', 'edit', 'approve'],
      grade_changes: ['view', 'create'],
      advising: ['view', 'create', 'edit'],
      referrals: ['view', 'create'],
      supervision: ['view', 'create', 'edit'],
      research: ['view', 'create', 'edit'],
      documents: ['view', 'create', 'download'],
      tasks_meetings: ['view', 'create', 'edit'],
      workload: ['view'],
      requests: ['view', 'create'],
      reports: ['view', 'export']
    }
  },
  {
    id: 'ROLE_SENIOR_LECTURER',
    portalId: 'LECTURER',
    name: 'Senior Lecturer',
    description: 'Senior academic rank with course coordination and postgraduate research supervision privileges.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      courses: ['view', 'edit', 'approve'],
      materials: ['view', 'create', 'edit', 'delete', 'download'],
      lessons: ['view', 'create', 'edit'],
      attendance: ['view', 'create', 'edit', 'export'],
      assignments: ['view', 'create', 'edit', 'grade'],
      grading: ['view', 'grade', 'export'],
      tests: ['view', 'create', 'edit', 'grade'],
      gradebook: ['view', 'edit', 'moderate', 'approve'],
      grade_changes: ['view', 'create', 'approve'],
      advising: ['view', 'create', 'edit'],
      referrals: ['view', 'create'],
      supervision: ['view', 'create', 'edit', 'approve'],
      research: ['view', 'create', 'edit', 'publish'],
      documents: ['view', 'create', 'approve', 'download'],
      tasks_meetings: ['view', 'create', 'edit'],
      workload: ['view'],
      requests: ['view', 'create'],
      reports: ['view', 'export']
    }
  },
  {
    id: 'ROLE_COURSE_COORDINATOR',
    portalId: 'LECTURER',
    name: 'Course Coordinator',
    description: 'Leads multi-section course delivery, synchronizes teaching assistants, and unifies grading rubrics.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      courses: ['view', 'edit', 'configure'],
      materials: ['view', 'create', 'edit', 'delete', 'publish'],
      lessons: ['view', 'create', 'edit', 'configure'],
      attendance: ['view', 'create', 'edit', 'export', 'monitor'],
      assignments: ['view', 'create', 'edit', 'grade', 'publish'],
      grading: ['view', 'grade', 'moderate', 'export'],
      tests: ['view', 'create', 'edit', 'grade', 'publish'],
      gradebook: ['view', 'edit', 'moderate', 'approve'],
      grade_changes: ['view', 'create', 'approve'],
      advising: ['view', 'create', 'edit'],
      referrals: ['view', 'create'],
      supervision: ['view', 'create', 'edit'],
      research: ['view', 'create', 'edit'],
      documents: ['view', 'create', 'approve', 'download'],
      tasks_meetings: ['view', 'create', 'edit'],
      workload: ['view'],
      requests: ['view', 'create'],
      reports: ['view', 'export']
    }
  },
  {
    id: 'ROLE_HOD',
    portalId: 'LECTURER',
    name: 'Head of Department',
    description: 'Departmental leadership overseeing departmental workload, syllabus approvals, and grade moderation.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: true,
    permissions: {
      courses: ['view', 'edit', 'approve', 'configure'],
      materials: ['view', 'create', 'edit', 'delete', 'approve'],
      lessons: ['view', 'edit', 'approve'],
      attendance: ['view', 'monitor', 'export'],
      assignments: ['view', 'grade', 'moderate'],
      grading: ['view', 'grade', 'moderate', 'approve', 'export'],
      tests: ['view', 'approve'],
      gradebook: ['view', 'edit', 'moderate', 'approve', 'publish'],
      grade_changes: ['view', 'approve', 'override'],
      advising: ['view', 'create', 'edit', 'monitor'],
      referrals: ['view', 'create', 'approve'],
      supervision: ['view', 'create', 'edit', 'approve', 'monitor'],
      research: ['view', 'create', 'edit', 'approve'],
      documents: ['view', 'create', 'approve', 'download'],
      tasks_meetings: ['view', 'create', 'edit', 'approve'],
      workload: ['view', 'edit', 'configure', 'approve'],
      requests: ['view', 'approve', 'edit'],
      reports: ['view', 'export', 'monitor']
    }
  },
  {
    id: 'ROLE_DEAN',
    portalId: 'LECTURER',
    name: 'Faculty Dean',
    description: 'Faculty-level executive with strategic oversight across all departments and academic programmes.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: true,
    permissions: {
      courses: ['view', 'approve', 'monitor'],
      materials: ['view', 'download'],
      attendance: ['view', 'monitor', 'export'],
      gradebook: ['view', 'moderate', 'approve', 'publish'],
      grade_changes: ['view', 'approve'],
      advising: ['view', 'monitor'],
      referrals: ['view', 'monitor'],
      supervision: ['view', 'approve', 'monitor'],
      research: ['view', 'approve', 'export'],
      documents: ['view', 'approve', 'download'],
      tasks_meetings: ['view', 'create'],
      workload: ['view', 'monitor', 'export'],
      requests: ['view', 'approve'],
      reports: ['view', 'export', 'monitor']
    }
  },
  {
    id: 'ROLE_TA',
    portalId: 'LECTURER',
    name: 'Teaching Assistant',
    description: 'Assists with lab sessions, continuous assessment grading, and tutorial attendance recording.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      courses: ['view'],
      materials: ['view', 'download'],
      lessons: ['view'],
      attendance: ['view', 'create', 'edit'],
      assignments: ['view', 'grade'],
      grading: ['view', 'grade'],
      tests: ['view'],
      gradebook: ['view', 'edit'],
      advising: ['view'],
      tasks_meetings: ['view']
    }
  },
  {
    id: 'ROLE_LECTURER_MONITOR',
    portalId: 'LECTURER',
    name: 'Lecturer Portal Monitor',
    description: 'Observes faculty teaching delivery, attendance compliance, and gradebook submission throughput.',
    isSystemDefault: true,
    isMonitor: true,
    isAdmin: false,
    permissions: {
      courses: ['view', 'monitor'],
      materials: ['view'],
      attendance: ['view', 'monitor', 'export'],
      grading: ['view', 'monitor'],
      gradebook: ['view', 'monitor', 'export'],
      grade_changes: ['view', 'monitor'],
      workload: ['view', 'monitor'],
      reports: ['view', 'export', 'monitor']
    }
  },
  {
    id: 'ROLE_LECTURER_ADMIN',
    portalId: 'LECTURER',
    name: 'Lecturer Portal Administrator',
    description: 'Configures academic terms, course instructor assignments, and system-wide faculty workflows.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: true,
    permissions: {
      courses: ['view', 'create', 'edit', 'delete', 'configure'],
      materials: ['view', 'create', 'edit', 'delete'],
      lessons: ['view', 'create', 'edit'],
      attendance: ['view', 'create', 'edit', 'configure', 'export'],
      assignments: ['view', 'create', 'edit', 'delete'],
      grading: ['view', 'grade', 'moderate', 'approve'],
      tests: ['view', 'create', 'edit', 'delete'],
      gradebook: ['view', 'edit', 'moderate', 'approve', 'publish', 'configure'],
      grade_changes: ['view', 'approve', 'override'],
      advising: ['view', 'create', 'edit'],
      referrals: ['view', 'create', 'approve'],
      supervision: ['view', 'create', 'edit', 'approve'],
      research: ['view', 'create', 'edit'],
      documents: ['view', 'create', 'approve', 'download', 'configure'],
      tasks_meetings: ['view', 'create', 'edit'],
      workload: ['view', 'edit', 'configure'],
      requests: ['view', 'approve', 'edit'],
      reports: ['view', 'export', 'monitor'],
      portal_settings: ['view', 'configure']
    }
  },

  // E-Learning (LMS)
  {
    id: 'ROLE_LMS_ADMIN',
    portalId: 'ELEARNING',
    name: 'LMS Platform Administrator',
    description: 'Global LMS management, categories, course provisions, and telemetry.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: true,
    permissions: {
      courses: ['view', 'create', 'edit', 'delete', 'configure'],
      modules: ['view', 'create', 'edit', 'delete'],
      assignments: ['view', 'create', 'edit', 'delete', 'grade'],
      quizzes: ['view', 'create', 'edit', 'delete'],
      analytics: ['view', 'export', 'monitor'],
      lms_settings: ['view', 'configure']
    }
  },
  {
    id: 'ROLE_LMS_INSTRUCTOR',
    portalId: 'ELEARNING',
    name: 'Course Instructor',
    description: 'Manages assigned courses, creates lessons, assignments, quizzes, and grades students.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      assigned_courses: ['view', 'edit'],
      modules: ['view', 'create', 'edit'],
      assignments: ['view', 'create', 'edit', 'grade'],
      quizzes: ['view', 'create', 'edit'],
      student_submissions: ['view', 'grade', 'download']
    }
  },
  {
    id: 'ROLE_LMS_LEARNER',
    portalId: 'ELEARNING',
    name: 'Learner',
    description: 'Enrolled student taking courses, viewing materials, and submitting assignments.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      enrolled_courses: ['view'],
      modules: ['view'],
      assignments: ['view', 'create', 'download'],
      quizzes: ['view', 'create']
    }
  },
  {
    id: 'ROLE_LMS_MONITOR',
    portalId: 'ELEARNING',
    name: 'LMS Monitor',
    description: 'Monitors LMS course activity, submission rates, test attempts, and active learners.',
    isSystemDefault: true,
    isMonitor: true,
    isAdmin: false,
    permissions: {
      courses: ['view', 'monitor'],
      assignments: ['view', 'monitor', 'export'],
      quizzes: ['view', 'monitor'],
      learner_activity: ['view', 'monitor', 'export']
    }
  },

  // E-Library
  {
    id: 'ROLE_LIB_ADMIN',
    portalId: 'ELIBRARY',
    name: 'Library Administrator',
    description: 'Full administrative authority over physical collections, digital DRM, and circulation policies.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: true,
    permissions: {
      catalog: ['view', 'create', 'edit', 'delete'],
      loans: ['view', 'create', 'edit', 'return'],
      fines: ['view', 'edit', 'override'],
      digital_drm: ['view', 'create', 'edit', 'delete', 'configure'],
      policies: ['view', 'configure']
    }
  },
  {
    id: 'ROLE_LIB_MEMBER',
    portalId: 'ELIBRARY',
    name: 'Library Member',
    description: 'Borrow physical books, reserve catalogue titles, and read authorized digital materials.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      catalog: ['view'],
      my_loans: ['view', 'create'],
      reservations: ['view', 'create'],
      digital_resources: ['view', 'read_online', 'download']
    }
  },
  {
    id: 'ROLE_LIB_MONITOR',
    portalId: 'ELIBRARY',
    name: 'Library Monitor',
    description: 'Observes live checkouts, overdue loan fines, and digital resource download metrics.',
    isSystemDefault: true,
    isMonitor: true,
    isAdmin: false,
    permissions: {
      catalog: ['view'],
      loans: ['view', 'monitor', 'export'],
      fines: ['view', 'monitor'],
      digital_telemetry: ['view', 'monitor']
    }
  },

  // Finance
  {
    id: 'ROLE_FIN_CASHIER',
    portalId: 'FINANCE',
    name: 'Cashier',
    description: 'Records student payments and issues preliminary collection slips. Cannot verify or reconcile.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      payments: ['view', 'create'],
      receipts: ['view', 'create', 'download']
    }
  },
  {
    id: 'ROLE_FIN_OFFICER',
    portalId: 'FINANCE',
    name: 'Finance Officer',
    description: 'Verifies recorded cashier payments against bank statements and payment gateways.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      payments: ['view', 'verify'],
      fee_structures: ['view']
    }
  },
  {
    id: 'ROLE_FIN_ACCOUNTANT',
    portalId: 'FINANCE',
    name: 'Accountant',
    description: 'Performs general ledger reconciliation and financial statement ledger balancing.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      payments: ['view', 'reconcile'],
      ledgers: ['view', 'edit', 'export']
    }
  },
  {
    id: 'ROLE_FIN_MANAGER',
    portalId: 'FINANCE',
    name: 'Finance Manager',
    description: 'Approves exceptions, refunds, fee waivers, and oversees financial health.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: true,
    permissions: {
      payments: ['view', 'approve'],
      refunds: ['view', 'approve'],
      fee_structures: ['view', 'create', 'edit', 'configure']
    }
  },
  {
    id: 'ROLE_FIN_MONITOR',
    portalId: 'FINANCE',
    name: 'Finance Monitor',
    description: 'Observes collection volumes, outstanding balances, and reconciliation health.',
    isSystemDefault: true,
    isMonitor: true,
    isAdmin: false,
    permissions: {
      analytics: ['view', 'monitor', 'export'],
      collections: ['view', 'monitor']
    }
  },

  // Examinations
  {
    id: 'ROLE_EXAM_LECTURER',
    portalId: 'EXAMINATIONS',
    name: 'Marks Entry Officer (Lecturer)',
    description: 'Enters continuous assessment and final examination scores for assigned courses.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      marks_entry: ['view', 'create', 'edit']
    }
  },
  {
    id: 'ROLE_EXAM_MODERATOR',
    portalId: 'EXAMINATIONS',
    name: 'Moderator',
    description: 'Reviews submitted marks, checks grading curves, and endorses academic fairness.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      marks_entry: ['view'],
      moderation: ['view', 'moderate', 'approve']
    }
  },
  {
    id: 'ROLE_EXAM_OFFICER',
    portalId: 'EXAMINATIONS',
    name: 'Examination Officer',
    description: 'Validates moderated results against Senate regulations and authorizes publication queue.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: false,
    permissions: {
      results_workflow: ['view', 'approve']
    }
  },
  {
    id: 'ROLE_EXAM_REGISTRAR',
    portalId: 'EXAMINATIONS',
    name: 'Registrar',
    description: 'Official final publication of Senate-approved results to the Student Portal.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: true,
    permissions: {
      results_workflow: ['view', 'publish'],
      official_gazette: ['view', 'publish', 'export']
    }
  },
  {
    id: 'ROLE_EXAM_MONITOR',
    portalId: 'EXAMINATIONS',
    name: 'Examination Monitor',
    description: 'Tracks missing marks, exam session attendance, and moderation progress.',
    isSystemDefault: true,
    isMonitor: true,
    isAdmin: false,
    permissions: {
      exam_telemetry: ['view', 'monitor', 'export']
    }
  },

  // Central Super Admin
  {
    id: 'ROLE_SUPER_ADMIN',
    portalId: 'ADMIN',
    name: 'Super Administrator',
    description: 'Full institutional governance, cross-portal audit logs, and security controls.',
    isSystemDefault: true,
    isMonitor: false,
    isAdmin: true,
    permissions: {
      portals: ['view', 'configure', 'edit'],
      roles: ['view', 'create', 'edit', 'delete', 'configure'],
      users: ['view', 'create', 'edit', 'delete', 'configure'],
      audit_trail: ['view', 'export', 'monitor'],
      health: ['view', 'configure']
    }
  }
];

export const INITIAL_USERS: UserIdentity[] = [
  {
    id: 'usr_john_doe',
    identifier: 'STU-2026-00124',
    name: 'John Doe',
    email: 'john.doe@student.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/johndoe/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Computer Science',
    faculty: 'Faculty of Computing & Information Systems',
    campus: 'Main Campus',
    phone: '+1 (555) 234-5678',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'STUDENT',
        roleId: 'ROLE_STUDENT',
        roleName: 'Student',
        assignedAt: '2026-01-10'
      },
      {
        portalId: 'ELEARNING',
        roleId: 'ROLE_LMS_LEARNER',
        roleName: 'Learner',
        assignedAt: '2026-01-10'
      },
      {
        portalId: 'ELIBRARY',
        roleId: 'ROLE_LIB_MEMBER',
        roleName: 'Library Member',
        assignedAt: '2026-01-10'
      }
    ]
  },
  {
    id: 'usr_sarah_connor',
    identifier: 'STU-2026-00188',
    name: 'Sarah Connor',
    email: 'sarah.connor@student.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/sarahconnor/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Computer Science',
    faculty: 'Faculty of Computing & Information Systems',
    campus: 'Main Campus',
    phone: '+1 (555) 345-6789',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'STUDENT',
        roleId: 'ROLE_STUDENT',
        roleName: 'Student',
        assignedAt: '2026-01-10'
      },
      {
        portalId: 'ELEARNING',
        roleId: 'ROLE_LMS_LEARNER',
        roleName: 'Learner',
        assignedAt: '2026-01-10'
      },
      {
        portalId: 'ELIBRARY',
        roleId: 'ROLE_LIB_MEMBER',
        roleName: 'Library Member',
        assignedAt: '2026-01-10'
      }
    ]
  },
  {
    id: 'usr_sarah_tech',
    identifier: 'EMP-2024-042',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@apex.edu',
    avatarUrl: 'https://picsum.photos/seed/sarah/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Educational Technology Directorate',
    faculty: 'Academic Affairs',
    campus: 'Main Campus',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'STUDENT',
        roleId: 'ROLE_STUDENT_MONITOR',
        roleName: 'Student Portal Monitor',
        isMonitor: true,
        assignedAt: '2025-08-15'
      },
      {
        portalId: 'ELEARNING',
        roleId: 'ROLE_LMS_ADMIN',
        roleName: 'LMS Platform Administrator',
        isAdmin: true,
        assignedAt: '2024-06-01'
      },
      {
        portalId: 'ELIBRARY',
        roleId: 'ROLE_LIB_MONITOR',
        roleName: 'Library Monitor',
        isMonitor: true,
        assignedAt: '2025-09-01'
      },
      {
        portalId: 'LECTURER',
        roleId: 'ROLE_LECTURER_MONITOR',
        roleName: 'Lecturer Portal Monitor',
        isMonitor: true,
        assignedAt: '2025-09-01'
      }
    ]
  },
  {
    id: 'usr_dr_henderson',
    identifier: 'FAC-2022-108',
    name: 'Dr. Marcus Henderson',
    email: 'm.henderson@faculty.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/henderson/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Computer Science',
    faculty: 'Faculty of Computing & Information Systems',
    campus: 'Main Campus',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'LECTURER',
        roleId: 'ROLE_COURSE_COORDINATOR',
        roleName: 'Course Coordinator & Senior Lecturer',
        scope: {
          departmentId: 'dept_cs',
          courseIds: ['CSC301', 'CSC401', 'CSC205']
        },
        assignedAt: '2022-09-01'
      },
      {
        portalId: 'ELEARNING',
        roleId: 'ROLE_LMS_INSTRUCTOR',
        roleName: 'Course Instructor (CSC301 only)',
        scope: {
          courseIds: ['crs_csc301', 'crs_csc101']
        },
        assignedAt: '2023-01-15'
      },
      {
        portalId: 'EXAMINATIONS',
        roleId: 'ROLE_EXAM_LECTURER',
        roleName: 'Marks Entry Officer (Lecturer)',
        scope: {
          courseIds: ['crs_csc301']
        },
        assignedAt: '2024-02-01'
      },
      {
        portalId: 'ELIBRARY',
        roleId: 'ROLE_LIB_MEMBER',
        roleName: 'Library Member (Faculty Tier)',
        assignedAt: '2022-09-01'
      }
    ]
  },
  {
    id: 'usr_dr_vance',
    identifier: 'FAC-2023-049',
    name: 'Dr. Arthur Vance',
    email: 'a.vance@faculty.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/arthurvance/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Computer Science',
    faculty: 'Faculty of Computing & Information Systems',
    campus: 'Main Campus',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'LECTURER',
        roleId: 'ROLE_COURSE_COORDINATOR',
        roleName: 'Course Coordinator & Senior Lecturer',
        scope: {
          departmentId: 'dept_cs',
          courseIds: ['MTH202', 'CSC205']
        },
        assignedAt: '2023-09-01'
      },
      {
        portalId: 'ELEARNING',
        roleId: 'ROLE_LMS_INSTRUCTOR',
        roleName: 'Course Instructor (MTH202 only)',
        scope: {
          courseIds: ['crs_mth202']
        },
        assignedAt: '2023-09-15'
      },
      {
        portalId: 'EXAMINATIONS',
        roleId: 'ROLE_EXAM_LECTURER',
        roleName: 'Marks Entry Officer (Lecturer)',
        scope: {
          courseIds: ['crs_mth202']
        },
        assignedAt: '2024-02-01'
      },
      {
        portalId: 'ELIBRARY',
        roleId: 'ROLE_LIB_MEMBER',
        roleName: 'Library Member (Faculty Tier)',
        assignedAt: '2023-09-01'
      }
    ]
  },
  {
    id: 'usr_prof_adeyemi',
    identifier: 'FAC-2015-004',
    name: 'Prof. Tunde Adeyemi',
    email: 't.adeyemi@faculty.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/adeyemi/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Computer Science',
    faculty: 'Faculty of Computing & Information Systems',
    campus: 'Main Campus',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'LECTURER',
        roleId: 'ROLE_HOD',
        roleName: 'Head of Department (Computing)',
        isAdmin: true,
        scope: {
          departmentId: 'dept_cs'
        },
        assignedAt: '2020-08-01'
      },
      {
        portalId: 'EXAMINATIONS',
        roleId: 'ROLE_EXAM_DEAN',
        roleName: 'Dean / Departmental Moderator',
        isAdmin: true,
        assignedAt: '2020-08-01'
      },
      {
        portalId: 'ELIBRARY',
        roleId: 'ROLE_LIB_MEMBER',
        roleName: 'Library Member (Faculty Tier)',
        assignedAt: '2015-09-01'
      }
    ]
  },
  {
    id: 'usr_karen_lib_monitor',
    identifier: 'LIB-2023-019',
    name: 'Karen Vance',
    email: 'k.vance@library.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/karen/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Library Circulation & Operations',
    faculty: 'University Libraries',
    campus: 'Main Campus',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'ELIBRARY',
        roleId: 'ROLE_LIB_MONITOR',
        roleName: 'Library Monitor',
        isMonitor: true,
        assignedAt: '2023-03-12'
      }
    ]
  },
  {
    id: 'usr_elena_librarian',
    identifier: 'LIB-2021-003',
    name: 'Elena Rostova',
    email: 'e.rostova@library.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/elena/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Digital Cataloguing & Acquisitions',
    faculty: 'University Libraries',
    campus: 'Main Campus',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'ELIBRARY',
        roleId: 'ROLE_LIB_ADMIN',
        roleName: 'Library Administrator',
        isAdmin: true,
        assignedAt: '2021-05-20'
      }
    ]
  },
  {
    id: 'usr_michael_cashier',
    identifier: 'FIN-2025-055',
    name: 'Michael Chen',
    email: 'm.chen@bursary.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/chen/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Bursary - Cash Office',
    faculty: 'Financial Services',
    campus: 'Main Campus',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'FINANCE',
        roleId: 'ROLE_FIN_CASHIER',
        roleName: 'Cashier',
        assignedAt: '2025-01-05'
      }
    ]
  },
  {
    id: 'usr_linda_fin_officer',
    identifier: 'FIN-2023-018',
    name: 'Linda Obasi',
    email: 'l.obasi@bursary.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/linda/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Bursary - Audit & Verification',
    faculty: 'Financial Services',
    campus: 'Main Campus',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'FINANCE',
        roleId: 'ROLE_FIN_OFFICER',
        roleName: 'Finance Officer',
        assignedAt: '2023-08-11'
      }
    ]
  },
  {
    id: 'usr_david_accountant',
    identifier: 'FIN-2022-009',
    name: 'David Miller',
    email: 'd.miller@bursary.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/david/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Bursary - General Ledger',
    faculty: 'Financial Services',
    campus: 'Main Campus',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'FINANCE',
        roleId: 'ROLE_FIN_ACCOUNTANT',
        roleName: 'Accountant',
        assignedAt: '2022-04-15'
      }
    ]
  },
  {
    id: 'usr_robert_fin_mgr',
    identifier: 'FIN-2020-001',
    name: 'Robert Thorne',
    email: 'r.thorne@bursary.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/robert/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Directorate of Finance',
    faculty: 'Financial Services',
    campus: 'Main Campus',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'FINANCE',
        roleId: 'ROLE_FIN_MANAGER',
        roleName: 'Finance Manager',
        isAdmin: true,
        assignedAt: '2020-01-10'
      }
    ]
  },
  {
    id: 'usr_registrar_sterling',
    identifier: 'REG-2019-002',
    name: 'Prof. Walter Sterling',
    email: 'registrar@apex.edu',
    avatarUrl: 'https://picsum.photos/seed/sterling/120/120',
    institution: 'Apex Institute of Technology',
    department: 'University Registry & Senate Secretariat',
    faculty: 'Executive Management',
    campus: 'Main Campus',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'EXAMINATIONS',
        roleId: 'ROLE_EXAM_REGISTRAR',
        roleName: 'Registrar',
        isAdmin: true,
        assignedAt: '2019-03-01'
      },
      {
        portalId: 'STUDENT',
        roleId: 'ROLE_STUDENT_ADMIN',
        roleName: 'Student Portal Administrator',
        isAdmin: true,
        assignedAt: '2019-03-01'
      }
    ]
  },
  {
    id: 'usr_super_admin',
    identifier: 'SYS-ROOT-001',
    name: 'Dr. Arthur Vance (Super Admin)',
    email: 'chief.security@apex.edu',
    avatarUrl: 'https://picsum.photos/seed/arthur/120/120',
    institution: 'Apex Institute of Technology',
    department: 'University Security & Information Systems',
    faculty: 'Executive Office',
    campus: 'All Campuses',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'ADMIN',
        roleId: 'ROLE_SUPER_ADMIN',
        roleName: 'Super Administrator',
        isAdmin: true,
        assignedAt: '2018-01-01'
      },
      {
        portalId: 'STUDENT',
        roleId: 'ROLE_STUDENT_ADMIN',
        roleName: 'Student Portal Administrator',
        isAdmin: true,
        assignedAt: '2018-01-01'
      },
      {
        portalId: 'ELEARNING',
        roleId: 'ROLE_LMS_ADMIN',
        roleName: 'LMS Platform Administrator',
        isAdmin: true,
        assignedAt: '2018-01-01'
      },
      {
        portalId: 'ELIBRARY',
        roleId: 'ROLE_LIB_ADMIN',
        roleName: 'Library Administrator',
        isAdmin: true,
        assignedAt: '2018-01-01'
      },
      {
        portalId: 'FINANCE',
        roleId: 'ROLE_FIN_MANAGER',
        roleName: 'Finance Manager',
        isAdmin: true,
        assignedAt: '2018-01-01'
      },
      {
        portalId: 'EXAMINATIONS',
        roleId: 'ROLE_EXAM_REGISTRAR',
        roleName: 'Registrar',
        isAdmin: true,
        assignedAt: '2018-01-01'
      },
      {
        portalId: 'LECTURER',
        roleId: 'ROLE_LECTURER_ADMIN',
        roleName: 'Lecturer Portal Administrator',
        isAdmin: true,
        assignedAt: '2018-01-01'
      }
    ]
  },
  {
    id: 'usr_patricia_admissions',
    identifier: 'ADM-2023-014',
    name: 'Patricia Gomez',
    email: 'p.gomez@admissions.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/patricia/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Undergraduate Admissions',
    faculty: 'Academic Affairs & Registry',
    campus: 'Main Campus',
    phone: '+1 (555) 349-8812',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'ADMISSIONS',
        roleId: 'ROLE_ADM_OFFICER',
        roleName: 'Admissions Officer',
        isAdmin: true,
        assignedAt: '2023-02-15'
      }
    ]
  },
  {
    id: 'usr_hassan_hostel',
    identifier: 'HST-2022-008',
    name: 'Alhaji Hassan Bello',
    email: 'h.bello@hostel.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/hassan/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Student Residential Services',
    faculty: 'Student Affairs Directorate',
    campus: 'West Campus & Hall of Residence',
    phone: '+1 (555) 782-9011',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'HOSTEL',
        roleId: 'ROLE_HOSTEL_WARDEN',
        roleName: 'Chief Hall Warden & Manager',
        isAdmin: true,
        assignedAt: '2022-08-01'
      }
    ]
  },
  {
    id: 'usr_charlotte_hr',
    identifier: 'HR-2021-005',
    name: 'Charlotte Dubois',
    email: 'c.dubois@hr.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/charlotte/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Human Resources & Talent Management',
    faculty: 'Corporate Administration',
    campus: 'Main Campus',
    phone: '+1 (555) 441-2098',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'HR',
        roleId: 'ROLE_HR_MANAGER',
        roleName: 'HR Manager & Payroll Officer',
        isAdmin: true,
        assignedAt: '2021-07-10'
      }
    ]
  },
  {
    id: 'usr_prof_amara',
    identifier: 'FAC-2017-023',
    name: 'Prof. Amara Diallo',
    email: 'a.diallo@faculty.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/amara/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Electrical & Computer Engineering',
    faculty: 'Faculty of Engineering & Physical Sciences',
    campus: 'Tech Complex North',
    phone: '+1 (555) 670-3419',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'LECTURER',
        roleId: 'ROLE_PROFESSOR',
        roleName: 'Professor & Dean of Engineering',
        isAdmin: true,
        scope: {
          departmentId: 'dept_ece'
        },
        assignedAt: '2017-09-01'
      },
      {
        portalId: 'EXAMINATIONS',
        roleId: 'ROLE_EXAM_DEAN',
        roleName: 'Dean / Departmental Moderator',
        isAdmin: true,
        assignedAt: '2019-01-15'
      }
    ]
  },
  {
    id: 'usr_james_security',
    identifier: 'AUD-2024-002',
    name: 'James O’Connor',
    email: 'j.oconnor@audit.apex.edu',
    avatarUrl: 'https://picsum.photos/seed/james/120/120',
    institution: 'Apex Institute of Technology',
    department: 'Internal Audit & Compliance Directorate',
    faculty: 'Governance & Legal Affairs',
    campus: 'Main Campus',
    phone: '+1 (555) 890-1234',
    status: 'ACTIVE',
    portalAssignments: [
      {
        portalId: 'ADMIN',
        roleId: 'ROLE_SECURITY_AUDITOR',
        roleName: 'Security Auditor & Monitor',
        isMonitor: true,
        assignedAt: '2024-03-01'
      },
      {
        portalId: 'FINANCE',
        roleId: 'ROLE_FIN_MONITOR',
        roleName: 'Finance Monitor (Audit)',
        isMonitor: true,
        assignedAt: '2024-03-01'
      }
    ]
  }
];

export const DEFAULT_INSTITUTIONAL_SETTINGS: InstitutionalSettings = {
  name: 'Kenya Technical & Vocational Training College',
  shortName: 'KTVTC',
  code: 'KTVTC-KENYA',
  motto: 'Skills for Industry, Technology & Innovation',
  logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&h=160&fit=crop&q=80',
  crestType: 'classic',
  primaryColor: '#047857', // Emerald green
  secondaryColor: '#0f172a', // Slate 900
  accentColor: '#d97706', // Amber gold
  addressLine1: 'Nairobi Main Campus, Off Ngong Road',
  addressLine2: 'Administration & Registry Complex',
  city: 'Nairobi',
  stateCountry: 'Nairobi County, Kenya',
  postalCode: 'P.O. Box 45321 - 00100',
  phone: '+254 (0) 20 271 8900',
  altPhone: '+254 712 345 678',
  email: 'info@ktvtc.ac.ke',
  admissionEmail: 'admissions@ktvtc.ac.ke',
  website: 'https://www.ktvtc.ac.ke',
  accreditationBody: 'Technical and Vocational Education and Training Authority (TVETA) • KNEC Exam Centre #20401102',
  charterNumber: 'TVETA/REG/2020/0248',
  establishedYear: '1982',
  viceChancellorName: 'Dr. Josephat K. Cheruiyot, Ph.D, Eng.',
  viceChancellorTitle: 'Principal & Chief Executive Officer',
  registrarName: 'Mrs. Grace W. Mwangi, M.Ed',
  registrarTitle: 'Registrar (Academic Affairs)',
  registrarSignatureUrl: 'https://picsum.photos/seed/sigreg/240/80',
  bursarName: 'Mr. David O. Omondi, CPA-K',
  bursarTitle: 'University Bursar & Head of Finance',
  bursarSignatureUrl: 'https://picsum.photos/seed/sigbur/240/80',
  officialSealUrl: 'https://picsum.photos/seed/sealuniv/150/150',
  letterheadHeaderStyle: 'CLASSIC_CREST',
  watermarkOpacity: 0.05,
  footerLegalText: 'This is an official computer-generated institutional document issued under the seal of the Kenya Technical & Vocational Training College Registry. Any alteration or unauthorized reproduction renders this document invalid. Verify online with the security reference code at ktvtc.ac.ke/verify.',
  securityVerificationUrl: 'https://ktvtc.ac.ke/verify/sec-doc',
  enableQrValidation: true,
  enableDigitalSignatures: true,
  enableEmbossedSeal: true
};


// Student Portal Specific Data
export const MOCK_STUDENT_PROFILE: StudentProfileData = {
  studentId: 'usr_john_doe',
  matricNumber: 'STU-2026-00124',
  programme: 'B.Sc. Software Engineering',
  faculty: 'Faculty of Computing & Information Systems',
  department: 'Computer Science',
  currentLevel: '300 Level (Year 3)',
  currentSemester: 'First Semester 2026/2027',
  academicYear: '2026/2027',
  cgpa: 3.84,
  totalCreditsEarned: 88,
  totalCreditsRequired: 120,
  academicStanding: 'DEAN_LIST',
  graduationEligibility: false,
  advisorName: 'Dr. Marcus Henderson',
  advisorEmail: 'm.henderson@faculty.apex.edu'
};

export const MOCK_STUDENT_COURSES: AcademicCourse[] = [
  {
    id: 'crs_csc301',
    code: 'CSC301',
    title: 'Advanced Data Structures & Algorithms',
    creditUnits: 4,
    instructorName: 'Dr. Marcus Henderson',
    semester: 'First Semester',
    level: '300L',
    status: 'REGISTERED',
    grade: 'A',
    gradePoint: 4.0,
    schedule: 'Mon & Wed, 10:00 AM - 11:30 AM',
    room: 'Lab 4B, Computing Block'
  },
  {
    id: 'crs_csc305',
    code: 'CSC305',
    title: 'Database Management Systems & Distributed Storage',
    creditUnits: 3,
    instructorName: 'Prof. Amara Diallo',
    semester: 'First Semester',
    level: '300L',
    status: 'REGISTERED',
    grade: 'A-',
    gradePoint: 3.7,
    schedule: 'Tue & Thu, 02:00 PM - 03:30 PM',
    room: 'Lecture Theatre 2'
  },
  {
    id: 'crs_mat201',
    code: 'MAT201',
    title: 'Linear Algebra & Numerical Methods',
    creditUnits: 3,
    instructorName: 'Prof. George Vance',
    semester: 'First Semester',
    level: '300L',
    status: 'REGISTERED',
    grade: 'B+',
    gradePoint: 3.3,
    schedule: 'Friday, 09:00 AM - 12:00 PM',
    room: 'Science Complex C1'
  },
  {
    id: 'crs_sen310',
    code: 'SEN310',
    title: 'Software Architecture & Cloud Native Design',
    creditUnits: 3,
    instructorName: 'Dr. Priya Sharma',
    semester: 'First Semester',
    level: '300L',
    status: 'REGISTERED',
    grade: 'A',
    gradePoint: 4.0,
    schedule: 'Thursday, 10:00 AM - 01:00 PM',
    room: 'Computing Studio 1'
  }
];

export const MOCK_STUDENT_INVOICES: StudentInvoice[] = [
  {
    id: 'inv_2026_01',
    invoiceNumber: 'INV-2026-88910',
    title: 'Tuition & Laboratory Fee - Semester 1 (2026/2027)',
    session: '2026/2027',
    amount: 1450.00,
    paidAmount: 1450.00,
    balance: 0.00,
    dueDate: '2026-09-15',
    status: 'PAID',
    items: [
      { description: 'Academic Tuition (13 Credit Units)', amount: 1100.00 },
      { description: 'Computing Lab Access & Cloud Sandbox', amount: 250.00 },
      { description: 'University Health Insurance Scheme', amount: 100.00 }
    ],
    receipts: [
      {
        receiptNo: 'REC-2026-4421',
        date: '2026-08-10',
        amount: 1450.00,
        paymentMethod: 'Online Payment Portal (Stripe/Card)',
        verifiedBy: 'Finance Officer Linda Obasi'
      }
    ]
  },
  {
    id: 'inv_2026_02',
    invoiceNumber: 'INV-2026-88911',
    title: 'Hostel Accommodation Fee - Alpha Hall Room 204',
    session: '2026/2027',
    amount: 400.00,
    paidAmount: 400.00,
    balance: 0.00,
    dueDate: '2026-09-01',
    status: 'PAID',
    items: [
      { description: 'Standard Double Room (1 Academic Session)', amount: 350.00 },
      { description: 'Hostel Maintenance & Utility Levy', amount: 50.00 }
    ],
    receipts: [
      {
        receiptNo: 'REC-2026-4599',
        date: '2026-08-14',
        amount: 400.00,
        paymentMethod: 'Direct Bank Transfer',
        verifiedBy: 'Finance Officer Linda Obasi'
      }
    ]
  }
];

export const MOCK_STUDENT_REQUESTS: StudentRequest[] = [
  {
    id: 'req_001',
    type: 'OFFICIAL_TRANSCRIPT',
    subject: 'Request for Official Electronic Transcript for Internship Application',
    details: 'Applying for Summer 2027 Tech Fellowship at DeepMind. Requesting certified e-transcript sent to admissions@fellowship.org.',
    submittedAt: '2026-08-18',
    status: 'APPROVED',
    reviewedBy: 'Registrar Prof. Walter Sterling',
    reviewRemarks: 'Transcript generated and dispatched electronically under official digital seal.'
  },
  {
    id: 'req_002',
    type: 'COURSE_ADD_DROP',
    subject: 'Late Enrollment Waiver for SEN310 Elective Section B',
    details: 'Conflicted previously with MAT201 Friday session. Requesting transfer to Section B.',
    submittedAt: '2026-08-22',
    status: 'UNDER_REVIEW',
    reviewedBy: 'Academic Advisor Dr. Marcus Henderson'
  }
];

export const MOCK_CLEARANCE_CHECKLIST: ClearanceItem[] = [
  {
    id: 'clr_lib',
    department: 'LIBRARY',
    officerName: 'Elena Rostova',
    status: 'CLEARED',
    notes: 'No overdue books, fine balance: $0.00.',
    updatedAt: '2026-08-20'
  },
  {
    id: 'clr_fin',
    department: 'FINANCE',
    officerName: 'Linda Obasi',
    status: 'CLEARED',
    notes: 'All tuition and lab fees reconciled in full.',
    updatedAt: '2026-08-20'
  },
  {
    id: 'clr_hst',
    department: 'HOSTEL',
    officerName: 'Warden Samuel Briggs',
    status: 'CLEARED',
    notes: 'Key returned, room inventory verified without damages.',
    updatedAt: '2026-08-21'
  },
  {
    id: 'clr_fac',
    department: 'FACULTY',
    officerName: 'Dr. Marcus Henderson',
    status: 'PENDING',
    notes: 'Awaiting end-of-semester project defense log signoff.',
    updatedAt: '2026-08-22'
  }
];

// LMS Mock Data
export const MOCK_LMS_COURSES: LMSCourse[] = [
  {
    id: 'crs_csc301',
    code: 'CSC301',
    title: 'Advanced Data Structures & Algorithms',
    faculty: 'Faculty of Computing & Information Systems',
    department: 'Computer Science',
    leadInstructorId: 'usr_dr_henderson',
    leadInstructorName: 'Dr. Marcus Henderson',
    instructorIds: ['usr_dr_henderson'],
    taIds: ['usr_sarah_tech'],
    enrolledStudentsCount: 64,
    thumbnail: 'https://picsum.photos/seed/algorithms/400/250',
    progressPercentage: 68,
    announcements: [
      {
        id: 'anc_1',
        title: 'Assignment 2: Red-Black Tree Implementation Deadline Extended',
        content: 'Due to network maintenance over the weekend, the submission deadline is extended by 48 hours.',
        date: '2026-08-21',
        author: 'Dr. Marcus Henderson'
      }
    ],
    modules: [
      {
        id: 'mod_1',
        title: 'Module 1: Balanced Binary Search Trees & AVL Rotations',
        order: 1,
        lessons: [
          {
            id: 'les_1',
            title: '1.1 AVL Tree Properties, Balance Factor & Left/Right Rotations',
            durationMinutes: 45,
            type: 'VIDEO',
            notesText: 'Review lecture notes on height-balanced search trees and worst-case search complexity O(log N).',
            completed: true
          },
          {
            id: 'les_2',
            title: '1.2 Red-Black Tree Insertion Invariants & Color Recoloring',
            durationMinutes: 30,
            type: 'READING',
            notesText: 'Understand the four structural rules of Red-Black Trees vs AVL Trees.',
            completed: true
          }
        ]
      },
      {
        id: 'mod_2',
        title: 'Module 2: Graph Algorithms & Dynamic Programming on Graphs',
        order: 2,
        lessons: [
          {
            id: 'les_3',
            title: '2.1 Dijkstra Shortest Path with Fibonacci Heaps',
            durationMinutes: 50,
            type: 'SLIDES',
            notesText: 'Analyzing priority queue runtime tradeoffs.',
            completed: false
          }
        ]
      }
    ],
    assignments: [
      {
        id: 'asg_csc301_01',
        courseId: 'crs_csc301',
        title: 'Assignment 1: Self-Balancing AVL Tree in C++/TypeScript',
        description: 'Implement insertion, deletion, and level-order traversal with automatic rotation validation.',
        dueDate: '2026-08-28 23:59',
        maxPoints: 100,
        weightPercentage: 20,
        submissionsCount: 58,
        gradedCount: 52,
        submissions: [
          {
            id: 'sub_001',
            studentId: 'usr_john_doe',
            studentName: 'John Doe',
            studentIdentifier: 'STU-2026-00124',
            submittedAt: '2026-08-25 14:32',
            fileName: 'JohnDoe_STU00124_AVL_Implementation.zip',
            fileSize: '2.4 MB',
            version: 2,
            status: 'GRADED',
            isLocked: true,
            grade: 96,
            maxScore: 100,
            feedback: 'Exceptional test suite coverage. Rotation edge cases handled flawlessly.',
            gradedBy: 'Dr. Marcus Henderson',
            gradedAt: '2026-08-26 10:15'
          }
        ]
      }
    ],
    quizzes: [
      {
        id: 'qz_csc301_01',
        courseId: 'crs_csc301',
        title: 'Quiz 1: Asymptotic Complexity & BST Traversal',
        timeLimitMinutes: 20,
        totalPoints: 20,
        attemptsAllowed: 2,
        questions: [
          {
            id: 'q1',
            question: 'What is the tight worst-case time complexity of searching in an AVL tree with N nodes?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
            correctOptionIndex: 1,
            points: 10,
            explanation: 'AVL trees strictly maintain a height of at most 1.44 * log2(N), guaranteeing O(log N) worst-case search.'
          },
          {
            id: 'q2',
            question: 'In an in-order traversal of a valid Binary Search Tree, elements are visited in which sequence?',
            options: ['Reverse sorted order', 'Ascending sorted order', 'Random order', 'Breadth-first order'],
            correctOptionIndex: 1,
            points: 10,
            explanation: 'Left subtree < Root < Right subtree ensures strictly ascending order.'
          }
        ],
        userAttempts: [
          {
            attemptId: 'att_01',
            studentId: 'usr_john_doe',
            studentName: 'John Doe',
            score: 20,
            completedAt: '2026-08-20 11:24'
          }
        ]
      }
    ]
  },
  {
    id: 'crs_mat201',
    code: 'MAT201',
    title: 'Linear Algebra & Numerical Methods',
    faculty: 'Faculty of Natural Sciences',
    department: 'Mathematics',
    leadInstructorId: 'usr_prof_vance',
    leadInstructorName: 'Prof. George Vance',
    instructorIds: ['usr_prof_vance'], // Dr. Henderson is NOT in this course!
    taIds: [],
    enrolledStudentsCount: 110,
    thumbnail: 'https://picsum.photos/seed/matrix/400/250',
    progressPercentage: 45,
    announcements: [
      {
        id: 'anc_mat_1',
        title: 'Midterm Quiz Date Confirmed',
        content: 'The linear algebra midterm will be conducted online via LMS next Tuesday.',
        date: '2026-08-22',
        author: 'Prof. George Vance'
      }
    ],
    modules: [
      {
        id: 'mod_mat_1',
        title: 'Module 1: Matrix Inverses, Determinants & Eigenvalues',
        order: 1,
        lessons: [
          {
            id: 'les_mat_1',
            title: '1.1 Gaussian Elimination and LU Factorization',
            durationMinutes: 40,
            type: 'VIDEO',
            notesText: 'Pivoting strategies for ill-conditioned matrices.',
            completed: true
          }
        ]
      }
    ],
    assignments: [
      {
        id: 'asg_mat_01',
        courseId: 'crs_mat201',
        title: 'Problem Set 1: Singular Value Decomposition (SVD)',
        description: 'Derive principal components and compute low-rank matrix approximations.',
        dueDate: '2026-09-05 23:59',
        maxPoints: 50,
        weightPercentage: 15,
        submissionsCount: 42,
        gradedCount: 30,
        submissions: []
      }
    ],
    quizzes: []
  }
];

// E-Library Mock Data
export const MOCK_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 'bk_001',
    isbn: '978-0262033848',
    title: 'Introduction to Algorithms (CLRS)',
    authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
    edition: '4th Edition',
    publisher: 'MIT Press',
    year: 2022,
    category: 'Computer Science',
    callNumber: 'QA76.6 .C662 2022',
    totalCopies: 8,
    availableCopies: 3,
    shelfLocation: 'Level 2, Stack CS-14',
    coverImage: 'https://picsum.photos/seed/clrs/300/400'
  },
  {
    id: 'bk_002',
    isbn: '978-0134494166',
    title: 'Clean Architecture: A Craftsman\'s Guide to Software Structure',
    authors: ['Robert C. Martin'],
    edition: '1st Edition',
    publisher: 'Prentice Hall',
    year: 2018,
    category: 'Software Engineering',
    callNumber: 'QA76.76.D47 M37 2018',
    totalCopies: 5,
    availableCopies: 1,
    shelfLocation: 'Level 2, Stack CS-09',
    coverImage: 'https://picsum.photos/seed/cleanarch/300/400'
  },
  {
    id: 'bk_003',
    isbn: '978-0134685991',
    title: 'Effective Java',
    authors: ['Joshua Bloch'],
    edition: '3rd Edition',
    publisher: 'Addison-Wesley',
    year: 2018,
    category: 'Programming Languages',
    callNumber: 'QA76.73.J38 B57 2018',
    totalCopies: 6,
    availableCopies: 4,
    shelfLocation: 'Level 2, Stack CS-11',
    coverImage: 'https://picsum.photos/seed/effectivejava/300/400'
  }
];

export const MOCK_LIBRARY_LOANS: LibraryLoan[] = [
  {
    id: 'loan_101',
    bookId: 'bk_001',
    bookTitle: 'Introduction to Algorithms (CLRS)',
    userId: 'usr_john_doe',
    userName: 'John Doe',
    userIdentifier: 'STU-2026-00124',
    borrowedAt: '2026-08-12',
    dueDate: '2026-08-26',
    status: 'ACTIVE',
    fineAccrued: 0.00,
    fineStatus: 'NONE'
  },
  {
    id: 'loan_102',
    bookId: 'bk_002',
    bookTitle: 'Clean Architecture: A Craftsman\'s Guide to Software Structure',
    userId: 'usr_dr_henderson',
    userName: 'Dr. Marcus Henderson',
    userIdentifier: 'FAC-2022-108',
    borrowedAt: '2026-08-01',
    dueDate: '2026-08-22',
    status: 'OVERDUE',
    fineAccrued: 2.00,
    fineStatus: 'UNPAID'
  }
];

export const MOCK_DIGITAL_RESOURCES: DigitalResource[] = [
  {
    id: 'dig_001',
    title: 'High-Performance Graph Partitioning & Distributed Transaction Processing',
    authors: ['A. Diallo', 'M. Henderson', 'P. Sharma'],
    type: 'RESEARCH_PAPER',
    doi: '10.1145/3452144.3453890',
    publisher: 'ACM Transactions on Database Systems',
    year: 2025,
    category: 'Databases & Distributed Systems',
    fileFormat: 'PDF',
    fileSize: '4.8 MB',
    licenseType: 'INSTITUTIONAL_OPEN',
    permissions: {
      canView: true,
      canReadOnline: true,
      canDownload: true, // Download allowed
      canPrint: true,
      canShare: true
    },
    totalDownloads: 342,
    totalReads: 1105
  },
  {
    id: 'dig_002',
    title: 'Proprietary Microarchitecture Reference Manual & ISA Spec 2026',
    authors: ['Apex Quantum Computing Research Lab'],
    type: 'EBOOK',
    publisher: 'Apex University Press',
    year: 2026,
    category: 'Computer Systems',
    fileFormat: 'PDF',
    fileSize: '18.2 MB',
    licenseType: 'READ_ONLY_DRM',
    permissions: {
      canView: true,
      canReadOnline: true,
      canDownload: false, // DRM Download strictly disabled!
      canPrint: false,
      canShare: false
    },
    totalDownloads: 0,
    totalReads: 588
  }
];

export const MOCK_LIBRARY_RESERVATIONS: LibraryReservation[] = [
  {
    id: 'res_001',
    bookId: 'bk_002',
    bookTitle: 'Clean Architecture: A Craftsman\'s Guide to Software Structure',
    userId: 'usr_john_doe',
    userName: 'John Doe',
    reservedAt: '2026-08-23',
    status: 'QUEUED',
    expiresAt: '2026-08-30'
  }
];

// Finance Segregation of Duties Mock Records
export const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_001',
    referenceNo: 'TXN-2026-99014',
    studentId: 'usr_john_doe',
    studentName: 'John Doe',
    studentIdentifier: 'STU-2026-00124',
    amount: 1450.00,
    paymentMethod: 'ONLINE_PORTAL',
    purpose: 'Tuition Fee - Semester 1 (2026/2027)',
    createdAt: '2026-08-10 09:15',
    recordedBy: { name: 'Michael Chen', role: 'Cashier', timestamp: '2026-08-10 09:16' },
    verifiedBy: { name: 'Linda Obasi', role: 'Finance Officer', timestamp: '2026-08-10 11:30' },
    reconciledBy: { name: 'David Miller', role: 'Accountant', timestamp: '2026-08-10 16:00' },
    approvedBy: { name: 'Robert Thorne', role: 'Finance Manager', timestamp: '2026-08-11 08:30' },
    status: 'APPROVED',
    remarks: 'Bank settlement batch #899 matched and cleared.'
  },
  {
    id: 'pay_002',
    referenceNo: 'TXN-2026-99045',
    studentId: 'usr_emily_rose',
    studentName: 'Emily Rose',
    studentIdentifier: 'STU-2026-00331',
    amount: 850.00,
    paymentMethod: 'BANK_TRANSFER',
    purpose: 'Faculty Laboratory Levy & Medical Insurance',
    createdAt: '2026-08-23 14:20',
    recordedBy: { name: 'Michael Chen', role: 'Cashier', timestamp: '2026-08-23 14:22' },
    verifiedBy: { name: 'Linda Obasi', role: 'Finance Officer', timestamp: '2026-08-23 16:45' },
    status: 'VERIFIED',
    remarks: 'Awaiting weekly accountant reconciliation run.'
  },
  {
    id: 'pay_003',
    referenceNo: 'TXN-2026-99078',
    studentId: 'usr_david_kalu',
    studentName: 'David Kalu',
    studentIdentifier: 'STU-2026-00088',
    amount: 400.00,
    paymentMethod: 'POS',
    purpose: 'Hostel Accommodation - Beta Wing',
    createdAt: '2026-08-24 10:05',
    recordedBy: { name: 'Michael Chen', role: 'Cashier', timestamp: '2026-08-24 10:06' },
    status: 'RECORDED',
    remarks: 'POS receipt generated at Cash Counter #3. Awaiting verification.'
  }
];

// Examination Board Workflows
export const MOCK_EXAM_WORKFLOWS: ExaminationResultWorkflow[] = [
  {
    id: 'exm_csc301_2026',
    courseCode: 'CSC301',
    courseTitle: 'Advanced Data Structures & Algorithms',
    session: '2026/2027',
    semester: 'First Semester',
    totalCandidates: 64,
    stages: {
      marksEntry: { completed: true, completedBy: 'Dr. Marcus Henderson', date: '2026-08-19' },
      moderation: { completed: true, completedBy: 'Prof. Amara Diallo (Moderator)', date: '2026-08-21', notes: 'Grading standard verified within normal distribution.' },
      examOfficerApproval: { completed: true, completedBy: 'Examination Officer Dr. Helen Cross', date: '2026-08-22' },
      registrarPublication: { completed: true, publishedBy: 'Prof. Walter Sterling (Registrar)', date: '2026-08-23' }
    },
    status: 'PUBLISHED',
    marks: [
      {
        studentId: 'usr_john_doe',
        studentName: 'John Doe',
        studentIdentifier: 'STU-2026-00124',
        caScore: 29,
        examScore: 66,
        totalScore: 95,
        letterGrade: 'A',
        remarks: 'Distinction'
      },
      {
        studentId: 'usr_emily_rose',
        studentName: 'Emily Rose',
        studentIdentifier: 'STU-2026-00331',
        caScore: 25,
        examScore: 58,
        totalScore: 83,
        letterGrade: 'A-',
        remarks: 'Very Good'
      },
      {
        studentId: 'usr_david_kalu',
        studentName: 'David Kalu',
        studentIdentifier: 'STU-2026-00088',
        caScore: 21,
        examScore: 49,
        totalScore: 70,
        letterGrade: 'B',
        remarks: 'Good'
      }
    ]
  },
  {
    id: 'exm_mat201_2026',
    courseCode: 'MAT201',
    courseTitle: 'Linear Algebra & Numerical Methods',
    session: '2026/2027',
    semester: 'First Semester',
    totalCandidates: 110,
    stages: {
      marksEntry: { completed: true, completedBy: 'Prof. George Vance', date: '2026-08-22' },
      moderation: { completed: true, completedBy: 'Dr. Helen Cross (Moderator)', date: '2026-08-23', notes: 'Marks curved slightly for Question 4 ambiguity.' },
      examOfficerApproval: { completed: false },
      registrarPublication: { completed: false }
    },
    status: 'MODERATED',
    marks: [
      {
        studentId: 'usr_john_doe',
        studentName: 'John Doe',
        studentIdentifier: 'STU-2026-00124',
        caScore: 24,
        examScore: 54,
        totalScore: 78,
        letterGrade: 'B+',
        remarks: 'Endorsed'
      }
    ]
  }
];

// Central Audit Trail
export const MOCK_INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_001',
    timestamp: '2026-08-24 06:15:10',
    userId: 'usr_john_doe',
    userName: 'John Doe',
    userIdentifier: 'STU-2026-00124',
    portalId: 'STUDENT',
    roleName: 'Student',
    action: 'VIEW_RESULTS',
    resource: 'Published Senate Results (CSC301)',
    status: 'GRANTED',
    ipAddress: '192.168.10.45',
    details: 'Viewed officially published semester grade statement.'
  },
  {
    id: 'aud_002',
    timestamp: '2026-08-24 06:18:22',
    userId: 'usr_john_doe',
    userName: 'John Doe',
    userIdentifier: 'STU-2026-00124',
    portalId: 'ELEARNING',
    roleName: 'Learner',
    action: 'SUBMIT_ASSIGNMENT',
    resource: 'Assignment 1 (CSC301 AVL Trees)',
    status: 'GRANTED',
    ipAddress: '192.168.10.45',
    details: 'Uploaded solution file version 2.'
  },
  {
    id: 'aud_003',
    timestamp: '2026-08-24 06:20:04',
    userId: 'usr_john_doe',
    userName: 'John Doe',
    userIdentifier: 'STU-2026-00124',
    portalId: 'ADMIN',
    roleName: 'Student (Attempting SuperAdmin Endpoint)',
    action: 'ACCESS_ADMIN_CONSOLE',
    resource: '/admin/security-matrix',
    status: 'DENIED',
    ipAddress: '192.168.10.45',
    details: 'RBAC Enforcer blocked unauthorized cross-portal boundary traversal.'
  },
  {
    id: 'aud_004',
    timestamp: '2026-08-24 06:22:15',
    userId: 'usr_dr_henderson',
    userName: 'Dr. Marcus Henderson',
    userIdentifier: 'FAC-2022-108',
    portalId: 'ELEARNING',
    roleName: 'Course Instructor',
    action: 'GRADE_SUBMISSION',
    resource: 'CSC301 Assignment 1 (John Doe)',
    status: 'GRANTED',
    ipAddress: '10.0.4.12',
    details: 'Awarded score 96/100 and committed feedback.'
  },
  {
    id: 'aud_005',
    timestamp: '2026-08-24 06:25:30',
    userId: 'usr_dr_henderson',
    userName: 'Dr. Marcus Henderson',
    userIdentifier: 'FAC-2022-108',
    portalId: 'ELEARNING',
    roleName: 'Course Instructor',
    action: 'EDIT_COURSE_CONTENT',
    resource: 'MAT201 (Linear Algebra)',
    status: 'DENIED',
    ipAddress: '10.0.4.12',
    details: 'Course-level RBAC check failed. User is not assigned as instructor for MAT201.'
  },
  {
    id: 'aud_006',
    timestamp: '2026-08-24 06:28:44',
    userId: 'usr_karen_lib_monitor',
    userName: 'Karen Vance',
    userIdentifier: 'LIB-2023-019',
    portalId: 'EXAMINATIONS',
    roleName: 'Library Monitor',
    action: 'MODIFY_EXAM_MARKS',
    resource: 'CSC301 Marks Sheet',
    status: 'DENIED',
    ipAddress: '10.0.8.99',
    details: 'Denied access. Library Monitor role possesses no operational authority in Examination Portal.'
  }
];

export const MOCK_NOTIFICATIONS: PortalNotification[] = [
  {
    id: 'notif_1',
    sourcePortal: 'ELEARNING',
    targetUserId: 'usr_john_doe',
    title: 'Assignment Graded',
    message: 'Dr. Marcus Henderson has graded your CSC301 AVL Tree submission (Score: 96/100).',
    category: 'ACADEMIC',
    priority: 'MEDIUM',
    timestamp: '2026-08-24 06:22',
    read: false,
    actionLink: '/learning'
  },
  {
    id: 'notif_2',
    sourcePortal: 'ELIBRARY',
    targetUserId: 'usr_john_doe',
    title: 'Book Due Reminder',
    message: 'Your borrowed physical book "Introduction to Algorithms (CLRS)" is due in 2 days.',
    category: 'DEADLINE',
    priority: 'HIGH',
    timestamp: '2026-08-24 06:00',
    read: false,
    actionLink: '/elibrary'
  },
  {
    id: 'notif_3',
    sourcePortal: 'FINANCE',
    targetUserId: 'usr_john_doe',
    title: 'Payment Receipt Verified',
    message: 'Official receipt #REC-2026-4421 has been verified and stamped by the Bursary.',
    category: 'FINANCIAL',
    priority: 'LOW',
    timestamp: '2026-08-23 12:00',
    read: true,
    actionLink: '/student'
  },
  {
    id: 'notif_4',
    sourcePortal: 'STUDENT',
    targetUserId: 'usr_john_doe',
    title: 'Semester Registration Approved',
    message: 'Your course registration for First Semester 2026/2027 has been finalized by the Faculty Dean.',
    category: 'ACADEMIC',
    priority: 'HIGH',
    timestamp: '2026-08-22 09:30',
    read: true,
    actionLink: '/student'
  }
];

export const MOCK_CROSS_PORTAL_EVENTS: CrossPortalEvent[] = [
  {
    id: 'evt_001',
    timestamp: '2026-08-24 05:30:00',
    sourcePortal: 'ADMISSIONS',
    targetPortals: ['STUDENT', 'ELEARNING', 'ELIBRARY'],
    eventType: 'STUDENT_ADMISSION_FINALIZED',
    description: 'Applicant STU-2026-00124 matriculated. Automatically provisioned Student Portal account, LMS Learner identity, and Library Member pass.',
    payload: { studentId: 'usr_john_doe', matricNo: 'STU-2026-00124', programme: 'Software Engineering' },
    status: 'PROCESSED'
  },
  {
    id: 'evt_002',
    timestamp: '2026-08-24 05:35:10',
    sourcePortal: 'STUDENT',
    targetPortals: ['ELEARNING'],
    eventType: 'ACADEMIC_COURSE_REGISTRATION_COMMITTED',
    description: 'Student completed registration for CSC301, MAT201, CSC305. LMS Enrolment Service synchronized roster.',
    payload: { studentId: 'usr_john_doe', courseCodes: ['CSC301', 'MAT201', 'CSC305'] },
    status: 'PROCESSED'
  },
  {
    id: 'evt_003',
    timestamp: '2026-08-24 05:40:00',
    sourcePortal: 'FINANCE',
    targetPortals: ['STUDENT', 'EXAMINATIONS'],
    eventType: 'TUITION_FEES_CLEARED',
    description: 'Tuition invoice marked 100% paid. Clearance board flag updated to CLEARED for examination hall pass.',
    payload: { studentId: 'usr_john_doe', invoiceId: 'inv_2026_01', balance: 0.00 },
    status: 'PROCESSED'
  }
];

// -------------------------------------------------------------
// LECTURER PORTAL MOCK DATASETS
// -------------------------------------------------------------

export const MOCK_LECTURER_COURSES: LecturerCourseFull[] = [
  {
    id: 'crs_csc301',
    code: 'CSC301',
    title: 'Data Structures & Algorithms in C++',
    faculty: 'Faculty of Computing & Information Systems',
    department: 'Computer Science',
    level: '300 Level',
    semester: 'First Semester 2026/2027',
    academicYear: '2026/2027',
    creditUnits: 4,
    contactHoursWeekly: 5,
    isCoordinator: true,
    coordinatorName: 'Dr. Marcus Henderson',
    instructors: ['Dr. Marcus Henderson', 'Dr. Amara Okafor'],
    teachingAssistants: ['Kofi Mensah (Lead TA)', 'Sarah Chen (Lab Grader)'],
    enrolledStudentsCount: 68,
    averageAttendancePct: 91.4,
    gradebookLockStatus: 'DRAFT',
    syllabus: {
      description: 'Advanced analysis of asymptotic time/space complexities, dynamic programming, self-balancing AVL trees, disjoint-set data structures, and graph algorithm design.',
      prerequisites: ['CSC201 (Intro to OOP)', 'MAT102 (Discrete Mathematics)'],
      learningOutcomes: [
        'Demonstrate formal asymptotic analysis of recursive algorithms using Master Theorem',
        'Implement self-balancing BST structures with guaranteed O(log N) lookup and rotation',
        'Formulate shortest-path routing graphs using Dijkstra and Bellman-Ford algorithms',
        'Synthesize dynamic programming solutions for optimal substructure recurrence relations'
      ],
      gradingBreakdown: [
        { component: 'Continuous Assessment (Quizzes & Labs)', weight: 20 },
        { component: 'Midterm Test (Theory & Coding)', weight: 20 },
        { component: 'Final Term Project (Algorithm Implementation)', weight: 10 },
        { component: 'Final Examination (Comprehensive)', weight: 50 }
      ]
    },
    materials: [
      {
        id: 'mat_001',
        courseCode: 'CSC301',
        title: 'Module 01: Asymptotic Complexity & Recurrence Relations',
        category: 'LECTURE_SLIDES',
        fileName: 'CSC301_Module01_Asymptotic_Analysis_v2.pdf',
        fileSize: '4.8 MB',
        fileFormat: 'PDF',
        uploadDate: '2026-08-10',
        uploadedBy: 'Dr. Marcus Henderson',
        version: 2,
        visibility: 'PUBLISHED',
        downloadCount: 64,
        tags: ['Big-O', 'Recurrence', 'Master Theorem'],
        versionHistory: [
          { version: 2, updatedAt: '2026-08-10', updatedBy: 'Dr. Marcus Henderson', changeLog: 'Added Master Theorem case 3 examples and recursion tree diagrams.', fileSize: '4.8 MB' },
          { version: 1, updatedAt: '2026-08-01', updatedBy: 'Dr. Marcus Henderson', changeLog: 'Initial draft slides created.', fileSize: '4.2 MB' }
        ]
      },
      {
        id: 'mat_002',
        courseCode: 'CSC301',
        title: 'Module 02: Self-Balancing AVL & Red-Black Trees',
        category: 'LECTURE_SLIDES',
        fileName: 'CSC301_Module02_AVL_RedBlack_Trees.pdf',
        fileSize: '6.2 MB',
        fileFormat: 'PDF',
        uploadDate: '2026-08-15',
        uploadedBy: 'Dr. Marcus Henderson',
        version: 1,
        visibility: 'PUBLISHED',
        downloadCount: 61,
        tags: ['AVL Trees', 'Rotations', 'Binary Search'],
        versionHistory: [
          { version: 1, updatedAt: '2026-08-15', updatedBy: 'Dr. Marcus Henderson', changeLog: 'Initial release with rotation trace walkthroughs.', fileSize: '6.2 MB' }
        ]
      },
      {
        id: 'mat_003',
        courseCode: 'CSC301',
        title: 'Lab Guide 03: Graph Traversal & Dijkstra Benchmark Harness',
        category: 'LAB_GUIDE',
        fileName: 'CSC301_Lab03_Graph_Algorithms_Starter.zip',
        fileSize: '1.8 MB',
        fileFormat: 'ZIP',
        uploadDate: '2026-08-20',
        uploadedBy: 'Dr. Marcus Henderson',
        version: 1,
        visibility: 'PUBLISHED',
        downloadCount: 58,
        tags: ['Lab', 'C++', 'Dijkstra', 'Graph'],
        versionHistory: [
          { version: 1, updatedAt: '2026-08-20', updatedBy: 'Dr. Marcus Henderson', changeLog: 'C++ starter code with Google Test test-cases.', fileSize: '1.8 MB' }
        ]
      }
    ],
    lessons: [
      {
        id: 'les_001',
        courseCode: 'CSC301',
        moduleName: 'Asymptotic Analysis',
        topic: 'Master Theorem & Substitution Method for Divide-and-Conquer',
        weekNumber: 1,
        scheduledDate: '2026-08-18',
        startTime: '09:00',
        endTime: '11:00',
        venue: 'Lecture Theatre 3 (LT-3)',
        deliveryMode: 'IN_PERSON',
        status: 'COMPLETED',
        learningObjectives: ['Identify recurrence cases', 'Prove tight asymptotic bounds'],
        materialsCount: 2,
        attendanceRecorded: true
      },
      {
        id: 'les_002',
        courseCode: 'CSC301',
        moduleName: 'Self-Balancing Trees',
        topic: 'AVL Tree Rotations (LL, RR, LR, RL) & Rebalancing Invariants',
        weekNumber: 2,
        scheduledDate: '2026-08-25',
        startTime: '09:00',
        endTime: '11:00',
        venue: 'Lecture Theatre 3 (LT-3)',
        deliveryMode: 'IN_PERSON',
        status: 'SCHEDULED',
        learningObjectives: ['Trace double rotations step-by-step', 'Calculate balance factor in O(1)'],
        materialsCount: 1,
        attendanceRecorded: false
      },
      {
        id: 'les_003',
        courseCode: 'CSC301',
        moduleName: 'Graph Algorithms',
        topic: 'Dijkstra Single-Source Shortest Path using Priority Queues',
        weekNumber: 3,
        scheduledDate: '2026-09-01',
        startTime: '14:00',
        endTime: '17:00',
        venue: 'Software Lab 2 (Lab-204)',
        deliveryMode: 'HYBRID',
        status: 'SCHEDULED',
        learningObjectives: ['Implement binary min-heap priority queue', 'Analyze Dijkstra runtime'],
        materialsCount: 1,
        attendanceRecorded: false
      }
    ],
    assignments: [
      {
        id: 'asg_csc301_01',
        courseCode: 'CSC301',
        courseTitle: 'Data Structures & Algorithms in C++',
        title: 'Assignment 1: AVL Tree Implementation & Stress Benchmark',
        description: 'Design and implement a complete AVL Tree container class in C++20 with template type parameters, node rebalancing, and in-order traversal iterators.',
        instructions: 'Submit a single .zip archive containing avl_tree.hpp, tests.cpp, and a 2-page benchmark report comparing insertion throughput against std::set.',
        assignedDate: '2026-08-12',
        dueDate: '2026-08-28 23:59',
        maxPoints: 100,
        weightPercentage: 15,
        rubricId: 'rub_avl_01',
        rubricTitle: 'AVL Implementation Rubric',
        status: 'PUBLISHED',
        plagiarismCheckEnabled: true,
        totalSubmissions: 54,
        gradedSubmissions: 48,
        averageScore: 84.5,
        submissions: [
          {
            id: 'sub_001',
            assignmentId: 'asg_csc301_01',
            studentId: 'usr_john_doe',
            studentName: 'John Doe',
            matricNumber: 'STU-2026-00124',
            submittedAt: '2026-08-24 04:12',
            fileName: 'STU202600124_AVL_Tree_Solution.zip',
            fileSize: '1.2 MB',
            status: 'GRADED',
            score: 96,
            maxPoints: 100,
            percentageScore: 96,
            letterGrade: 'A+',
            similarityScore: 4,
            rubricScores: {
              'Correctness & Rebalancing Invariant': 40,
              'Memory Management & Valgrind Cleanliness': 25,
              'Benchmark Methodology & Report Quality': 20,
              'Code Style & Documentation': 11
            },
            feedbackNotes: 'Exemplary solution! The template specialization and move semantics are implemented cleanly. Benchmark charts show clear logarithmic scaling.',
            gradedBy: 'Dr. Marcus Henderson',
            gradedAt: '2026-08-24 06:15',
            annotationsCount: 4
          },
          {
            id: 'sub_002',
            assignmentId: 'asg_csc301_01',
            studentId: 'usr_sarah_connor',
            studentName: 'Sarah Connor',
            matricNumber: 'STU-2026-00188',
            submittedAt: '2026-08-23 21:30',
            fileName: 'SarahConnor_CSC301_AVL.zip',
            fileSize: '890 KB',
            status: 'GRADED',
            score: 88,
            maxPoints: 100,
            percentageScore: 88,
            letterGrade: 'A',
            similarityScore: 7,
            rubricScores: {
              'Correctness & Rebalancing Invariant': 36,
              'Memory Management & Valgrind Cleanliness': 22,
              'Benchmark Methodology & Report Quality': 18,
              'Code Style & Documentation': 12
            },
            feedbackNotes: 'Good implementation. Double rotation logic in left-right case has slight overhead in parent pointer updates.',
            gradedBy: 'Dr. Marcus Henderson',
            gradedAt: '2026-08-24 06:40',
            annotationsCount: 2
          },
          {
            id: 'sub_003',
            assignmentId: 'asg_csc301_01',
            studentId: 'usr_kelvin_baker',
            studentName: 'Kelvin Baker',
            matricNumber: 'STU-2026-00215',
            submittedAt: '2026-08-24 05:50',
            fileName: 'Kelvin_Baker_AVL.zip',
            fileSize: '950 KB',
            status: 'UNGRADED',
            maxPoints: 100,
            similarityScore: 12
          }
        ]
      },
      {
        id: 'asg_csc301_02',
        courseCode: 'CSC301',
        courseTitle: 'Data Structures & Algorithms in C++',
        title: 'Assignment 2: Network Routing with Dijkstra & Fibonacci Heaps',
        description: 'Implement a high-throughput network shortest-path router simulating packet delivery across a 10,000-node graph topology.',
        instructions: 'Implement priority queue amortized operations and generate routing tables.',
        assignedDate: '2026-08-22',
        dueDate: '2026-09-12 23:59',
        maxPoints: 100,
        weightPercentage: 15,
        status: 'PUBLISHED',
        plagiarismCheckEnabled: true,
        totalSubmissions: 12,
        gradedSubmissions: 0,
        submissions: []
      }
    ],
    tests: [
      {
        id: 'test_csc301_cat1',
        courseCode: 'CSC301',
        courseTitle: 'Data Structures & Algorithms in C++',
        title: 'Continuous Assessment Test 1: Asymptotic Analysis & Binary Trees',
        testType: 'CONTINUOUS_ASSESSMENT',
        durationMinutes: 45,
        totalMarks: 30,
        weightPercentage: 15,
        status: 'PUBLISHED',
        scheduledStart: '2026-08-28 10:00',
        scheduledEnd: '2026-08-28 11:30',
        autoGradingEnabled: true,
        passingScore: 15,
        attemptsAllowed: 1,
        questionsCount: 15,
        totalAttempts: 64,
        pendingManualGradingCount: 0,
        questions: [],
        attempts: [
          {
            id: 'att_001',
            studentId: 'usr_john_doe',
            studentName: 'John Doe',
            matricNumber: 'STU-2026-00124',
            submittedAt: '2026-08-24 05:00',
            score: 28.5,
            autoGradedScore: 28.5,
            manualGradedScore: 0,
            totalPoints: 30,
            status: 'COMPLETED',
            gradedBy: 'System Auto-Grader'
          }
        ]
      }
    ],
    studentsRoster: [
      {
        studentId: 'usr_john_doe',
        matricNumber: 'STU-2026-00124',
        name: 'John Doe',
        programme: 'B.Sc. Software Engineering',
        yearLevel: '300 Level',
        email: 'j.doe@student.apex.edu',
        phone: '+1 (555) 234-5678',
        group: 'Group A',
        attendancePct: 95.0,
        caScore: 28.5,
        examScore: 0,
        totalScore: 94.5,
        currentGrade: 'A+',
        riskStatus: 'GOOD_STANDING',
        riskReasons: [],
        notes: [
          { date: '2026-08-20', author: 'Dr. Marcus Henderson', note: 'Top contributor in dynamic programming tutorial session.' }
        ]
      },
      {
        studentId: 'usr_sarah_connor',
        matricNumber: 'STU-2026-00188',
        name: 'Sarah Connor',
        programme: 'B.Sc. Computer Science',
        yearLevel: '300 Level',
        email: 's.connor@student.apex.edu',
        phone: '+1 (555) 345-6789',
        group: 'Group A',
        attendancePct: 92.0,
        caScore: 26.0,
        examScore: 0,
        totalScore: 88.0,
        currentGrade: 'A',
        riskStatus: 'GOOD_STANDING',
        riskReasons: [],
        notes: []
      },
      {
        studentId: 'usr_david_okafor',
        matricNumber: 'STU-2026-00302',
        name: 'David Okafor',
        programme: 'B.Sc. Software Engineering',
        yearLevel: '300 Level',
        email: 'd.okafor@student.apex.edu',
        phone: '+1 (555) 456-7890',
        group: 'Group B',
        attendancePct: 62.5,
        caScore: 14.0,
        examScore: 0,
        totalScore: 48.0,
        currentGrade: 'F',
        riskStatus: 'AT_RISK',
        riskReasons: ['Attendance below 75% threshold (62.5%)', 'Failed Continuous Assessment Test 1 (Score 14/30)'],
        notes: [
          { date: '2026-08-22', author: 'Dr. Marcus Henderson', note: 'Missed 3 consecutive lab sessions. Sent formal attendance warning email.' }
        ]
      },
      {
        studentId: 'usr_fatima_al_hassan',
        matricNumber: 'STU-2026-00411',
        name: 'Fatima Al-Hassan',
        programme: 'B.Sc. Cyber Security',
        yearLevel: '300 Level',
        email: 'f.alhassan@student.apex.edu',
        phone: '+1 (555) 567-8901',
        group: 'Group B',
        attendancePct: 88.0,
        caScore: 24.5,
        examScore: 0,
        totalScore: 82.5,
        currentGrade: 'B+',
        riskStatus: 'GOOD_STANDING',
        riskReasons: [],
        notes: []
      },
      {
        studentId: 'usr_emmanuel_eze',
        matricNumber: 'STU-2026-00509',
        name: 'Emmanuel Eze',
        programme: 'B.Sc. Computer Science',
        yearLevel: '300 Level',
        email: 'e.eze@student.apex.edu',
        phone: '+1 (555) 678-9012',
        group: 'Group A',
        attendancePct: 58.0,
        caScore: 11.5,
        examScore: 0,
        totalScore: 42.0,
        currentGrade: 'F',
        riskStatus: 'CRITICAL',
        riskReasons: ['Attendance 58.0% - Examination Barring warning', 'Continuous Assessment critically deficient (11.5/30)'],
        notes: [
          { date: '2026-08-21', author: 'Dr. Marcus Henderson', note: 'Referred to Academic Support & Counselling for urgent intervention.' }
        ]
      }
    ],
    gradebook: [
      {
        studentId: 'usr_john_doe',
        matricNumber: 'STU-2026-00124',
        studentName: 'John Doe',
        programme: 'B.Sc. Software Engineering',
        attendanceScore: 10,
        assignment1: 15,
        assignment2: 14,
        catScore: 19,
        projectScore: 10,
        continuousAssessmentTotal: 68,
        examScore: 28,
        totalWeightedScore: 96,
        letterGrade: 'A+',
        gradePoint: 4.0,
        status: 'DRAFT'
      },
      {
        studentId: 'usr_sarah_connor',
        matricNumber: 'STU-2026-00188',
        studentName: 'Sarah Connor',
        programme: 'B.Sc. Computer Science',
        attendanceScore: 9,
        assignment1: 13,
        assignment2: 13,
        catScore: 17,
        projectScore: 9,
        continuousAssessmentTotal: 61,
        examScore: 27,
        totalWeightedScore: 88,
        letterGrade: 'A',
        gradePoint: 4.0,
        status: 'DRAFT'
      },
      {
        studentId: 'usr_david_okafor',
        matricNumber: 'STU-2026-00302',
        studentName: 'David Okafor',
        programme: 'B.Sc. Software Engineering',
        attendanceScore: 6,
        assignment1: 8,
        assignment2: 9,
        catScore: 10,
        projectScore: 6,
        continuousAssessmentTotal: 39,
        examScore: 15,
        totalWeightedScore: 54,
        letterGrade: 'D',
        gradePoint: 1.0,
        status: 'DRAFT',
        flaggedOutlier: true
      },
      {
        studentId: 'usr_fatima_al_hassan',
        matricNumber: 'STU-2026-00411',
        studentName: 'Fatima Al-Hassan',
        programme: 'B.Sc. Cyber Security',
        attendanceScore: 9,
        assignment1: 12,
        assignment2: 13,
        catScore: 16,
        projectScore: 8,
        continuousAssessmentTotal: 58,
        examScore: 25,
        totalWeightedScore: 83,
        letterGrade: 'B+',
        gradePoint: 3.5,
        status: 'DRAFT'
      },
      {
        studentId: 'usr_emmanuel_eze',
        matricNumber: 'STU-2026-00509',
        studentName: 'Emmanuel Eze',
        programme: 'B.Sc. Computer Science',
        attendanceScore: 5,
        assignment1: 6,
        assignment2: 7,
        catScore: 8,
        projectScore: 5,
        continuousAssessmentTotal: 31,
        examScore: 12,
        totalWeightedScore: 43,
        letterGrade: 'F',
        gradePoint: 0.0,
        status: 'DRAFT',
        flaggedOutlier: true
      }
    ]
  },
  {
    id: 'crs_csc401',
    code: 'CSC401',
    title: 'Distributed Systems & Cloud Architecture',
    faculty: 'Faculty of Computing & Information Systems',
    department: 'Computer Science',
    level: '400 Level',
    semester: 'First Semester 2026/2027',
    academicYear: '2026/2027',
    creditUnits: 3,
    contactHoursWeekly: 4,
    isCoordinator: true,
    coordinatorName: 'Dr. Marcus Henderson',
    instructors: ['Dr. Marcus Henderson', 'Prof. Tunde Adeyemi'],
    teachingAssistants: ['David Kalu (Cloud TA)'],
    enrolledStudentsCount: 42,
    averageAttendancePct: 94.2,
    gradebookLockStatus: 'SUBMITTED',
    syllabus: {
      description: 'Distributed consensus algorithms (Paxos, Raft), vector clocks, CAP theorem, eventual consistency, microservices, gRPC, and cloud container orchestration.',
      prerequisites: ['CSC301 (Data Structures)', 'CSC305 (Operating Systems)'],
      learningOutcomes: [
        'Analyze safety and liveness guarantees in distributed consensus protocols',
        'Design fault-tolerant microservice architectures with gRPC and circuit breakers',
        'Deploy resilient multi-region Kubernetes clusters with auto-scaling policies'
      ],
      gradingBreakdown: [
        { component: 'Continuous Assessment (Lab Deployments)', weight: 30 },
        { component: 'Term Project (Distributed KV Store with Raft)', weight: 20 },
        { component: 'Final Examination', weight: 50 }
      ]
    },
    materials: [
      {
        id: 'mat_401_01',
        courseCode: 'CSC401',
        title: 'Module 01: CAP Theorem & Consistency Models',
        category: 'LECTURE_SLIDES',
        fileName: 'CSC401_CAP_Consistency_Models.pdf',
        fileSize: '5.1 MB',
        fileFormat: 'PDF',
        uploadDate: '2026-08-14',
        uploadedBy: 'Dr. Marcus Henderson',
        version: 1,
        visibility: 'PUBLISHED',
        downloadCount: 40,
        tags: ['CAP', 'Consensus', 'Raft'],
        versionHistory: [
          { version: 1, updatedAt: '2026-08-14', updatedBy: 'Dr. Marcus Henderson', changeLog: 'Initial release.', fileSize: '5.1 MB' }
        ]
      }
    ],
    lessons: [
      {
        id: 'les_401_01',
        courseCode: 'CSC401',
        moduleName: 'Consensus Protocols',
        topic: 'Raft Protocol: Leader Election & Log Replication',
        weekNumber: 1,
        scheduledDate: '2026-08-21',
        startTime: '11:00',
        endTime: '13:00',
        venue: 'Computing Lab 4 (Lab-401)',
        deliveryMode: 'IN_PERSON',
        status: 'COMPLETED',
        learningObjectives: ['Trace Raft election term timeouts', 'Verify log matching invariant'],
        materialsCount: 1,
        attendanceRecorded: true
      }
    ],
    assignments: [],
    tests: [],
    studentsRoster: [],
    gradebook: []
  },
  {
    id: 'crs_csc205',
    code: 'CSC205',
    title: 'Object-Oriented Programming with Java & Design Patterns',
    faculty: 'Faculty of Computing & Information Systems',
    department: 'Computer Science',
    level: '200 Level',
    semester: 'First Semester 2026/2027',
    academicYear: '2026/2027',
    creditUnits: 3,
    contactHoursWeekly: 4,
    isCoordinator: false,
    coordinatorName: 'Dr. Amara Okafor',
    instructors: ['Dr. Amara Okafor', 'Dr. Marcus Henderson'],
    teachingAssistants: ['Kofi Mensah'],
    enrolledStudentsCount: 110,
    averageAttendancePct: 88.6,
    gradebookLockStatus: 'DRAFT',
    syllabus: {
      description: 'OOP paradigm, SOLID design principles, GoF design patterns (Factory, Observer, Strategy, Decorator), Java concurrency, and clean code practices.',
      prerequisites: ['CSC101 (Intro to Computing)'],
      learningOutcomes: [
        'Apply SOLID design principles to refactor legacy object architectures',
        'Implement behavioral and creational design patterns in Java 21',
        'Write thread-safe concurrent producer-consumer pipelines'
      ],
      gradingBreakdown: [
        { component: 'Continuous Assessment Labs', weight: 30 },
        { component: 'Midterm Test', weight: 20 },
        { component: 'Final Exam', weight: 50 }
      ]
    },
    materials: [],
    lessons: [],
    assignments: [],
    tests: [],
    studentsRoster: [],
    gradebook: []
  }
];

export const MOCK_ATTENDANCE_SESSIONS: LecturerAttendanceSession[] = [
  {
    id: 'att_ses_001',
    courseCode: 'CSC301',
    courseTitle: 'Data Structures & Algorithms in C++',
    date: '2026-08-18',
    timeSlot: '09:00 - 11:00 AM',
    venue: 'Lecture Theatre 3 (LT-3)',
    groupName: 'Section A & B Combined',
    topic: 'Master Theorem & Substitution Method for Recurrences',
    mode: 'QR_CLOSED',
    qrSessionCode: 'CSC301-SES-88219',
    totalEnrolled: 68,
    presentCount: 62,
    absentCount: 4,
    lateCount: 2,
    excusedCount: 0,
    attendanceRate: 91.2,
    records: [
      { studentId: 'usr_john_doe', matricNumber: 'STU-2026-00124', studentName: 'John Doe', status: 'PRESENT', checkInTime: '09:04 AM', checkInMethod: 'QR_SCAN' },
      { studentId: 'usr_sarah_connor', matricNumber: 'STU-2026-00188', studentName: 'Sarah Connor', status: 'PRESENT', checkInTime: '09:02 AM', checkInMethod: 'QR_SCAN' },
      { studentId: 'usr_david_okafor', matricNumber: 'STU-2026-00302', studentName: 'David Okafor', status: 'ABSENT', remarks: 'Unexcused absence' },
      { studentId: 'usr_fatima_al_hassan', matricNumber: 'STU-2026-00411', studentName: 'Fatima Al-Hassan', status: 'PRESENT', checkInTime: '09:08 AM', checkInMethod: 'QR_SCAN' },
      { studentId: 'usr_emmanuel_eze', matricNumber: 'STU-2026-00509', studentName: 'Emmanuel Eze', status: 'LATE', checkInTime: '09:35 AM', checkInMethod: 'MANUAL_LECTURER', remarks: 'Late admission by lecturer' }
    ]
  },
  {
    id: 'att_ses_002',
    courseCode: 'CSC401',
    courseTitle: 'Distributed Systems & Cloud Architecture',
    date: '2026-08-21',
    timeSlot: '11:00 AM - 01:00 PM',
    venue: 'Computing Lab 4 (Lab-401)',
    groupName: 'Final Year Cohort',
    topic: 'Raft Protocol: Leader Election & Log Replication',
    mode: 'QR_ACTIVE',
    qrSessionCode: 'CSC401-LIVE-94302',
    qrExpiresAt: '2026-08-24 18:00',
    totalEnrolled: 42,
    presentCount: 39,
    absentCount: 2,
    lateCount: 1,
    excusedCount: 0,
    attendanceRate: 92.8,
    records: [
      { studentId: 'usr_john_doe', matricNumber: 'STU-2026-00124', studentName: 'John Doe', status: 'PRESENT', checkInTime: '11:03 AM', checkInMethod: 'QR_SCAN' },
      { studentId: 'usr_sarah_connor', matricNumber: 'STU-2026-00188', studentName: 'Sarah Connor', status: 'PRESENT', checkInTime: '11:05 AM', checkInMethod: 'QR_SCAN' }
    ]
  }
];

export const MOCK_GRADING_RUBRICS: LecturerGradingRubric[] = [
  {
    id: 'rub_avl_01',
    courseCode: 'CSC301',
    title: 'AVL Tree Implementation & Benchmark Rubric',
    totalPoints: 100,
    criteria: [
      {
        id: 'crit_1',
        name: 'Correctness & Rebalancing Invariant',
        maxPoints: 40,
        description: 'Accurate implementation of BST insertion, deletion, height updates, and 4 rotation cases.',
        levels: [
          { id: 'l1', title: 'Exemplary', points: 40, description: 'All rotations correct, height recomputed O(1), passes all edge tests.' },
          { id: 'l2', title: 'Proficient', points: 32, description: 'Minor edge defect on root deletion rebalance; all insertions clean.' },
          { id: 'l3', title: 'Developing', points: 20, description: 'Double rotation logic flawed in certain subtree topologies.' },
          { id: 'l4', title: 'Unsatisfactory', points: 8, description: 'Tree fails to balance; falls back to unbalanced BST.' }
        ]
      },
      {
        id: 'crit_2',
        name: 'Memory Management & Valgrind Cleanliness',
        maxPoints: 25,
        description: 'Zero memory leaks, proper RAII destructor cleanup, clean copy/move semantics.',
        levels: [
          { id: 'l5', title: 'Zero Leaks', points: 25, description: 'Valgrind reports 0 errors and 0 bytes leaked across 100k operations.' },
          { id: 'l6', title: 'Minor Leaks', points: 15, description: 'Destructor misses sentinel nodes or empty subtree handles.' },
          { id: 'l7', title: 'Critical Leaks', points: 5, description: 'Node destructuring causes segmentation faults or high leakage.' }
        ]
      },
      {
        id: 'crit_3',
        name: 'Benchmark Methodology & Report Quality',
        maxPoints: 20,
        description: 'Rigorous empirical measurement comparing performance against std::set with graphs.',
        levels: [
          { id: 'l8', title: 'Exemplary', points: 20, description: 'Wall-clock and CPU cycle measurements with confidence intervals and analysis.' },
          { id: 'l9', title: 'Adequate', points: 14, description: 'Basic timing tables without statistical variance analysis.' }
        ]
      },
      {
        id: 'crit_4',
        name: 'Code Style & Documentation',
        maxPoints: 15,
        description: 'Consistent C++ naming conventions, Doxygen comments, and clean header guards.',
        levels: [
          { id: 'l10', title: 'Professional', points: 15, description: 'Flawless clang-format adherence and thorough inline documentation.' },
          { id: 'l11', title: 'Adequate', points: 10, description: 'Readable code with sparse comment coverage.' }
        ]
      }
    ]
  }
];

export const MOCK_QUESTION_BANKS: QuestionBankItem[] = [
  {
    id: 'qb_001',
    courseCode: 'CSC301',
    topic: 'Asymptotic Analysis',
    questionType: 'MCQ',
    difficulty: 'MEDIUM',
    bloomTaxonomyLevel: 'ANALYZE',
    questionText: 'Given the recurrence relation T(n) = 3T(n/2) + O(n^2), what is the tight asymptotic bound according to the Master Theorem?',
    options: ['O(n^2)', 'O(n log n)', 'O(n^(log_2 3))', 'O(n^3)'],
    correctAnswers: 'O(n^2)',
    points: 2,
    explanation: 'Since log_2(3) ≈ 1.585 and f(n) = n^2 = Ω(n^(log_2(3) + ε)) with ε ≈ 0.415, and the regularity condition 3(n/2)^2 = 3/4 n^2 ≤ c n^2 holds for c = 3/4, Case 3 of the Master Theorem yields T(n) = Θ(n^2).',
    tags: ['Master Theorem', 'Divide-and-Conquer']
  },
  {
    id: 'qb_002',
    courseCode: 'CSC301',
    topic: 'AVL Trees',
    questionType: 'MULTIPLE_SELECT',
    difficulty: 'HARD',
    bloomTaxonomyLevel: 'EVALUATE',
    questionText: 'Which of the following statements regarding AVL tree balancing are TRUE? (Select all that apply)',
    options: [
      'The height of an AVL tree with N nodes is strictly less than 1.44 log_2(N + 2)',
      'A Left-Right (LR) imbalance at node X requires a left rotation at X followed by a right rotation at X.left',
      'A Left-Right (LR) imbalance at node X requires a left rotation at X.left followed by a right rotation at X',
      'The balance factor of any node in a valid AVL tree is strictly in the set {-1, 0, +1}'
    ],
    correctAnswers: [
      'The height of an AVL tree with N nodes is strictly less than 1.44 log_2(N + 2)',
      'A Left-Right (LR) imbalance at node X requires a left rotation at X.left followed by a right rotation at X',
      'The balance factor of any node in a valid AVL tree is strictly in the set {-1, 0, +1}'
    ],
    points: 3,
    explanation: 'LR imbalance is resolved by a left rotation on the child followed by a right rotation on the parent.',
    tags: ['AVL', 'Rotations']
  },
  {
    id: 'qb_003',
    courseCode: 'CSC301',
    topic: 'Graph Algorithms',
    questionType: 'ESSAY',
    difficulty: 'HARD',
    bloomTaxonomyLevel: 'CREATE',
    questionText: 'Explain why Dijkstra algorithm fails on graphs containing negative edge weights, and provide a concrete 3-node counterexample with vertex labels and edge weights.',
    correctAnswers: 'Dijkstra operates greedily assuming that once a vertex is removed from the priority queue, its shortest distance is finalized. With negative edges, an unexplored path can later yield a shorter distance.',
    points: 5,
    explanation: 'Counterexample: A->B (weight 3), A->C (weight 2), C->B (weight -4). Dijkstra finalizes dist[B]=3 first, missing the optimal path A->C->B with total cost -2.',
    tags: ['Dijkstra', 'Graph', 'Negative Weights']
  }
];

export const MOCK_GRADE_CHANGE_REQUESTS: GradeChangeRequest[] = [
  {
    id: 'gcr_001',
    studentId: 'usr_sarah_connor',
    studentName: 'Sarah Connor',
    matricNumber: 'STU-2026-00188',
    courseCode: 'CSC301',
    courseTitle: 'Data Structures & Algorithms in C++',
    componentName: 'Assignment 1 (AVL Tree Benchmark)',
    oldScore: 82,
    newScore: 88,
    oldGrade: 'B+',
    newGrade: 'A',
    reason: 'Student identified a typographical miscalculation in the rubric evaluation sheet for Criterion 3 (Benchmark report). Score verified and corrected.',
    supportingDocName: 'SarahConnor_Recheck_Verification_Scan.pdf',
    submittedAt: '2026-08-24 07:00',
    submittedBy: 'Dr. Marcus Henderson',
    status: 'PENDING_HOD',
    reviewedBy: 'Prof. Tunde Adeyemi (HoD Computing)'
  }
];

export const MOCK_ADVISING_RECORDS: AcademicAdvisingRecord[] = [
  {
    id: 'adv_001',
    studentId: 'usr_john_doe',
    studentName: 'John Doe',
    matricNumber: 'STU-2026-00124',
    programme: 'B.Sc. Software Engineering',
    cgpa: 3.84,
    academicStanding: 'DEAN_LIST',
    riskAlerts: [],
    consultationLogs: [
      {
        id: 'con_001',
        date: '2026-08-15',
        mode: 'IN_PERSON',
        discussionSummary: 'Discussed final year capstone thesis topics in distributed consensus and recommended Scopus journal papers.',
        actionPlan: 'Draft 2-page project proposal on Raft consensus optimization by September 10.',
        followUpDate: '2026-09-12',
        advisorName: 'Dr. Marcus Henderson'
      }
    ],
    referrals: []
  },
  {
    id: 'adv_002',
    studentId: 'usr_emmanuel_eze',
    studentName: 'Emmanuel Eze',
    matricNumber: 'STU-2026-00509',
    programme: 'B.Sc. Computer Science',
    cgpa: 1.94,
    academicStanding: 'ACADEMIC_PROBATION',
    riskAlerts: ['Attendance below 60% in 2 major courses', 'CGPA within probationary zone (< 2.00)'],
    consultationLogs: [
      {
        id: 'con_002',
        date: '2026-08-21',
        mode: 'IN_PERSON',
        discussionSummary: 'Addressed severe attendance lapses and missed lab assessments. Student reported transport and financial distress.',
        actionPlan: 'Referred to Bursary for hardship installment waiver; enrolled in peer-tutoring study circle for C++.',
        followUpDate: '2026-08-30',
        advisorName: 'Dr. Marcus Henderson'
      }
    ],
    referrals: ['ref_001']
  }
];

export const MOCK_STUDENT_REFERRALS: StudentReferralItem[] = [
  {
    id: 'ref_001',
    studentId: 'usr_emmanuel_eze',
    studentName: 'Emmanuel Eze',
    matricNumber: 'STU-2026-00509',
    targetDepartment: 'ACADEMIC_SUPPORT',
    reasonCategory: 'ACADEMIC_DIFFICULTY',
    severity: 'HIGH',
    description: 'Student is struggling with data structures programming concepts and requires structured 1-on-1 tutoring.',
    submittedAt: '2026-08-21 14:30',
    referredBy: 'Dr. Marcus Henderson',
    status: 'APPOINTMENT_SCHEDULED',
    feedbackNotes: 'Session assigned with Lead Tutor Kofi Mensah on August 26, 2:00 PM.'
  },
  {
    id: 'ref_002',
    studentId: 'usr_emmanuel_eze',
    studentName: 'Emmanuel Eze',
    matricNumber: 'STU-2026-00509',
    targetDepartment: 'FINANCE_BURSARY',
    reasonCategory: 'FINANCIAL_HARDSHIP',
    severity: 'MEDIUM',
    description: 'Student requests assistance with textbook grants and hardship installment schedule.',
    submittedAt: '2026-08-21 14:35',
    referredBy: 'Dr. Marcus Henderson',
    status: 'DISPATCHED'
  }
];

export const MOCK_SUPERVISION_PROJECTS: SupervisionProject[] = [
  {
    id: 'sup_001',
    studentId: 'usr_john_doe',
    studentName: 'John Doe',
    matricNumber: 'STU-2026-00124',
    programme: 'B.Sc. Software Engineering',
    projectTitle: 'Low-Latency Byzantine Fault Tolerant Consensus Protocol for Distributed Micro-Ledgers',
    projectType: 'UNDERGRADUATE_CAPSTONE',
    currentMilestone: 'IMPLEMENTATION',
    progressPercentage: 68,
    status: 'ON_TRACK',
    nextMeetingDate: '2026-09-02 10:00 AM',
    nextDeliverable: 'Benchmark telemetry results comparing throughput under 33% network partition faults.',
    milestones: [
      { name: 'Topic & Proposal Defense', dueDate: '2026-05-15', completedDate: '2026-05-14', status: 'COMPLETED', comments: 'Approved with minor scope refinements.' },
      { name: 'Literature Review & Theoretical Model', dueDate: '2026-06-30', completedDate: '2026-06-28', status: 'COMPLETED', comments: 'Thorough review of PBFT and Raft state machines.' },
      { name: 'Core Engine Prototype Implementation', dueDate: '2026-08-30', status: 'IN_PROGRESS', comments: 'C++ gRPC network transport layer currently 80% complete.' },
      { name: 'Empirical Evaluation & Stress Testing', dueDate: '2026-09-30', status: 'PENDING' },
      { name: 'Final Dissertation Submission & Oral Defense', dueDate: '2026-10-25', status: 'PENDING' }
    ],
    submissions: [
      {
        id: 'sdoc_001',
        fileName: 'JohnDoe_BFT_Proposal_Final_Approved.pdf',
        version: 2,
        uploadedAt: '2026-05-14',
        supervisorFeedback: 'Scope confirmed. Proceed with implementation.'
      },
      {
        id: 'sdoc_002',
        fileName: 'JohnDoe_Literature_Review_Chapter2_Draft.pdf',
        version: 1,
        uploadedAt: '2026-06-28',
        supervisorFeedback: 'Excellent synthesis of safety proofs.'
      }
    ]
  },
  {
    id: 'sup_002',
    studentId: 'usr_aisha_bello',
    studentName: 'Aisha Bello',
    matricNumber: 'STU-2025-00084',
    programme: 'M.Sc. Computer Science',
    projectTitle: 'Automated Vulnerability Detection in Smart Contracts Using Static Symbolic Execution',
    projectType: 'MASTERS_THESIS',
    currentMilestone: 'DRAFT_REPORT',
    progressPercentage: 84,
    status: 'ON_TRACK',
    nextMeetingDate: '2026-09-05 02:00 PM',
    nextDeliverable: 'Chapter 4 (Evaluation on 5,000 Mainnet Contracts).',
    milestones: [
      { name: 'Proposal Defense', dueDate: '2025-11-20', completedDate: '2025-11-18', status: 'COMPLETED' },
      { name: 'Symbolic Execution Framework', dueDate: '2026-04-15', completedDate: '2026-04-10', status: 'COMPLETED' },
      { name: 'Thesis Draft Report', dueDate: '2026-09-10', status: 'IN_PROGRESS' },
      { name: 'Senate External Examination Defense', dueDate: '2026-10-15', status: 'PENDING' }
    ],
    submissions: [
      {
        id: 'sdoc_003',
        fileName: 'AishaBello_MSc_Thesis_Chapters_1_to_3.pdf',
        version: 3,
        uploadedAt: '2026-08-10',
        supervisorFeedback: 'Ready for departmental pre-defense circulation.'
      }
    ]
  }
];

export const MOCK_RESEARCH_PUBLICATIONS: ResearchPublicationItem[] = [
  {
    id: 'pub_001',
    title: 'Adaptive Quorum Slicing for High-Throughput BFT State Machine Replication in Edge Networks',
    authors: ['Dr. Marcus Henderson', 'Prof. Tunde Adeyemi', 'Dr. Elena Rostova'],
    publicationType: 'PEER_REVIEWED_JOURNAL',
    journalOrConference: 'IEEE Transactions on Parallel and Distributed Systems (TPDS)',
    doi: '10.1109/TPDS.2025.3489102',
    publicationDate: '2025-11-15',
    citationsCount: 18,
    indexing: 'IEEE_XPLORE',
    abstractText: 'We present an adaptive quorum reconfiguration scheme that dynamically tunes quorum sizes based on empirical network latency and node churn, achieving 4.2x speedup in transaction finality.',
    fundingGrant: 'Apex Faculty Excellence Grant #GRT-2024-88'
  },
  {
    id: 'pub_002',
    title: 'Scalable Distributed Graph Analytics using Lock-Free Fibers on Modern Multi-Core Architectures',
    authors: ['Dr. Marcus Henderson', 'Sarah Jenkins'],
    publicationType: 'INTERNATIONAL_CONFERENCE',
    journalOrConference: 'ACM SIGMOD International Conference on Management of Data 2026',
    doi: '10.1145/3610419.3620104',
    publicationDate: '2026-06-20',
    citationsCount: 7,
    indexing: 'ACM_DL',
    abstractText: 'Explores user-space cooperative multi-threading fibers to minimize cache-line thrashing during billion-edge graph traversals.'
  }
];

export const MOCK_LECTURER_TASKS: LecturerTaskItem[] = [
  { id: 'tsk_001', title: 'Grade CSC301 Assignment 1 Remaining Submissions (6 pending)', category: 'GRADING', priority: 'HIGH', dueDate: '2026-08-25', completed: false, courseCode: 'CSC301' },
  { id: 'tsk_002', title: 'Submit Moderated Marks Sheet for CSC401 to HoD Prof. Adeyemi', category: 'EXAM_MODERATION', priority: 'CRITICAL', dueDate: '2026-08-26', completed: false, courseCode: 'CSC401' },
  { id: 'tsk_003', title: 'Upload CSC301 Module 3 Dijkstra Lab Code Repository', category: 'TEACHING_PREP', priority: 'MEDIUM', dueDate: '2026-08-27', completed: true, courseCode: 'CSC301' },
  { id: 'tsk_004', title: 'Review John Doe Capstone Progress Chapter 3', category: 'ADVISING', priority: 'MEDIUM', dueDate: '2026-08-29', completed: false },
  { id: 'tsk_005', title: 'Departmental Board of Examiners Meeting Preparation', category: 'ADMIN_COMMITTEE', priority: 'HIGH', dueDate: '2026-08-30', completed: false }
];

export const MOCK_LECTURER_MEETINGS: LecturerMeetingSchedule[] = [
  {
    id: 'mtg_001',
    title: 'Departmental Academic Board & Curriculum Review',
    meetingType: 'DEPARTMENT_BOARD',
    date: '2026-08-28',
    time: '14:00 - 16:00',
    venue: 'Computing Boardroom (CIS-302) & Virtual Link',
    agendaItems: [
      'Approval of 2026/2027 Course Outlines & Continuous Assessment Schedules',
      'Review of At-Risk Students & Early Warning Advisory Deployments',
      'Accreditation Equipment Audit for Cyber Security Lab'
    ],
    organizer: 'Prof. Tunde Adeyemi (HoD Computing)',
    status: 'UPCOMING',
    minutesAvailable: false
  },
  {
    id: 'mtg_002',
    title: 'Faculty of Computing Postgraduate Supervision Committee',
    meetingType: 'EXAM_BOARD',
    date: '2026-09-04',
    time: '10:00 - 12:30',
    venue: 'Senate Chamber B',
    agendaItems: [
      'Final Year Capstone Project Defense Dates',
      'M.Sc. Thesis External Reviewer Appointments'
    ],
    organizer: 'Faculty Dean Office',
    status: 'UPCOMING',
    minutesAvailable: false
  }
];

export const MOCK_LECTURER_WORKLOAD: LecturerWorkloadStats = {
  assignedCoursesCount: 3,
  totalCreditHours: 10,
  weeklyContactHours: 13,
  totalStudentsTaught: 220,
  supervisionCandidates: 6,
  committeeAssignmentsCount: 2,
  officeHoursWeekly: 6,
  teachingLoadStatus: 'NORMAL'
};

export const MOCK_LECTURER_REQUESTS: LecturerResourceRequest[] = [
  {
    id: 'req_lec_001',
    category: 'LAB_EQUIPMENT',
    title: 'High-RAM Computing Server Cluster Allocation for CSC401 Lab',
    courseCode: 'CSC401',
    justification: 'Required to deploy multi-node Raft consensus clusters across 40 enrolled students concurrently.',
    requestedDate: '2026-08-15',
    status: 'HOD_APPROVED',
    approverRemarks: 'Approved by Prof. Adeyemi. Forwarded to IT Systems Directorate.'
  },
  {
    id: 'req_lec_002',
    category: 'EXAM_PRINTING',
    title: 'Midterm Examination Papers Printing Requisition (70 Copies)',
    courseCode: 'CSC301',
    justification: 'Continuous Assessment Test 1 on August 28 requires sealed question booklets with diagram answer grids.',
    requestedDate: '2026-08-22',
    status: 'PENDING'
  }
];

export const MOCK_REGISTRATION_COURSES_POOL: AcademicCourse[] = [
  {
    id: 'crs_reg_01',
    code: 'CSC301',
    title: 'Data Structures & Algorithms in C++',
    creditUnits: 4,
    level: '300 Level',
    semester: 'First Semester',
    lecturer: 'Dr. Marcus Henderson',
    venue: 'Lecture Theatre 3 (LT-3)',
    schedule: 'Mon & Wed 09:00 - 11:00 AM',
    status: 'REGISTERED',
    category: 'COMPULSORY',
    prerequisites: 'CSC201, MAT102'
  },
  {
    id: 'crs_reg_02',
    code: 'CSC305',
    title: 'Operating Systems & System Programming',
    creditUnits: 3,
    level: '300 Level',
    semester: 'First Semester',
    lecturer: 'Prof. Tunde Adeyemi',
    venue: 'Software Lab 2',
    schedule: 'Tue & Thu 11:00 AM - 01:00 PM',
    status: 'REGISTERED',
    category: 'COMPULSORY',
    prerequisites: 'CSC201'
  },
  {
    id: 'crs_reg_03',
    code: 'MAT201',
    title: 'Linear Algebra & Numerical Methods',
    creditUnits: 3,
    level: '300 Level',
    semester: 'First Semester',
    lecturer: 'Dr. Amara Okafor',
    venue: 'Science Hall B',
    schedule: 'Fri 08:00 - 11:00 AM',
    status: 'REGISTERED',
    category: 'REQUIRED',
    prerequisites: 'MAT101'
  },
  {
    id: 'crs_reg_04',
    code: 'CSC309',
    title: 'Database Management Systems & SQL Internals',
    creditUnits: 3,
    level: '300 Level',
    semester: 'First Semester',
    lecturer: 'Dr. Sarah Jenkins',
    venue: 'Lab-102',
    schedule: 'Mon & Thu 02:00 - 03:30 PM',
    status: 'REGISTERED',
    category: 'COMPULSORY',
    prerequisites: 'CSC201'
  },
  {
    id: 'crs_reg_05',
    code: 'CSC311',
    title: 'Web Application Architectures & Cloud Microservices',
    creditUnits: 3,
    level: '300 Level',
    semester: 'First Semester',
    lecturer: 'Dr. Marcus Henderson',
    venue: 'Lab-204',
    schedule: 'Tue 02:00 - 05:00 PM',
    status: 'REGISTERED',
    category: 'ELECTIVE',
    prerequisites: 'CSC201'
  },
  {
    id: 'crs_reg_06',
    code: 'CYB303',
    title: 'Network Security & Applied Cryptography',
    creditUnits: 3,
    level: '300 Level',
    semester: 'First Semester',
    lecturer: 'Dr. Arthur Vance',
    venue: 'Security Lab 1',
    schedule: 'Wed 02:00 - 05:00 PM',
    status: 'AVAILABLE',
    category: 'ELECTIVE',
    prerequisites: 'CSC205'
  },
  {
    id: 'crs_reg_07',
    code: 'CSC315',
    title: 'Artificial Intelligence & Search Algorithms',
    creditUnits: 3,
    level: '300 Level',
    semester: 'First Semester',
    lecturer: 'Prof. Walter Sterling',
    venue: 'Auditorium A',
    schedule: 'Thu 09:00 - 11:00 AM',
    status: 'AVAILABLE',
    category: 'ELECTIVE',
    prerequisites: 'CSC201, MAT102'
  }
];

