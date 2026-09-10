'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserIdentity,
  PortalId,
  PortalDefinition,
  RoleDefinition,
  AuditLogEntry,
  CrossPortalEvent,
  PortalNotification,
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
  CrudOperation,
  LifecycleState,
  CrudScope,
  CrudEntityType,
  CrudRecordMeta,
  BulkCrudRequest,
  BulkCrudResult,
  ImportValidationResult,
  CrudTestCaseResult,
  InstitutionalSettings,
  InstitutionalDocPayload,
  InstitutionalDocType
} from '@/types/erp';

import {
  PORTAL_REGISTRY,
  INITIAL_ROLES,
  INITIAL_USERS,
  DEFAULT_INSTITUTIONAL_SETTINGS,
  MOCK_STUDENT_PROFILE,
  MOCK_STUDENT_COURSES,
  MOCK_STUDENT_INVOICES,
  MOCK_STUDENT_REQUESTS,
  MOCK_CLEARANCE_CHECKLIST,
  MOCK_LMS_COURSES,
  MOCK_LIBRARY_BOOKS,
  MOCK_LIBRARY_LOANS,
  MOCK_DIGITAL_RESOURCES,
  MOCK_LIBRARY_RESERVATIONS,
  MOCK_PAYMENTS,
  MOCK_EXAM_WORKFLOWS,
  MOCK_INITIAL_AUDIT_LOGS,
  MOCK_NOTIFICATIONS,
  MOCK_CROSS_PORTAL_EVENTS
} from '@/lib/mock-data';

import {
  evaluatePortalAccess,
  hasPermission,
  createAuditLog
} from '@/lib/rbac-engine';

import {
  INITIAL_CRUD_ENTITIES,
  evaluateCrudPermission,
  validateLifecycleTransition,
  validateImportDataset,
  generateCsvExport,
  runAutomatedCrudAcceptanceTests
} from '@/lib/crud-lifecycle-engine';

interface ERPContextType {
  // Active state
  currentUser: UserIdentity;
  setCurrentUser: (user: UserIdentity) => void;
  activePortalId: PortalId;
  setActivePortalId: (portalId: PortalId) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;

  // Domain Collections
  portals: PortalDefinition[];
  roles: RoleDefinition[];
  users: UserIdentity[];
  auditLogs: AuditLogEntry[];
  events: CrossPortalEvent[];
  notifications: PortalNotification[];

  // Student Portal Data
  studentProfile: StudentProfileData;
  studentCourses: AcademicCourse[];
  studentInvoices: StudentInvoice[];
  studentRequests: StudentRequest[];
  clearanceItems: ClearanceItem[];

  // LMS Data
  lmsCourses: LMSCourse[];
  activeLmsCourseId: string;
  setActiveLmsCourseId: (courseId: string) => void;

  // Library Data
  libraryBooks: LibraryBook[];
  libraryLoans: LibraryLoan[];
  digitalResources: DigitalResource[];
  libraryReservations: LibraryReservation[];

  // Finance Data
  payments: PaymentRecord[];

  // Exam Board Data
  examWorkflows: ExaminationResultWorkflow[];

  // Platform-wide CRUD & Lifecycle Engine
  crudEntities: CrudRecordMeta[];
  isCrudLifecycleSuiteOpen: boolean;
  setIsCrudLifecycleSuiteOpen: (open: boolean) => void;
  activeCrudEntityType: CrudEntityType;
  setActiveCrudEntityType: (type: CrudEntityType) => void;
  executeCrudOperation: (
    entityType: CrudEntityType,
    operation: CrudOperation,
    entityId?: string,
    payload?: Record<string, any>,
    reason?: string
  ) => { success: boolean; message: string; record?: CrudRecordMeta };
  executeBulkCrud: (request: BulkCrudRequest) => BulkCrudResult;
  executeImportDataset: (
    entityType: CrudEntityType,
    rawRows: Record<string, any>[]
  ) => { success: boolean; result: ImportValidationResult; createdCount: number };
  executeExportDataset: (
    entityType: CrudEntityType,
    format: 'CSV' | 'JSON'
  ) => { data: string; mimeType: string; fileName: string; allowed: boolean; message: string };
  executeRestoreEntity: (entityId: string, reason: string) => { success: boolean; message: string };
  executeCloneEntity: (
    sourceEntityId: string,
    newTitle: string,
    newCode: string
  ) => { success: boolean; message: string; newRecord?: CrudRecordMeta };

  // Modals & Tools
  isSecuritySuiteOpen: boolean;
  setIsSecuritySuiteOpen: (open: boolean) => void;
  isRoleBuilderOpen: boolean;
  setIsRoleBuilderOpen: (open: boolean) => void;
  isAuditDrawerOpen: boolean;
  setIsAuditDrawerOpen: (open: boolean) => void;
  isEventsModalOpen: boolean;
  setIsEventsModalOpen: (open: boolean) => void;
  isHealthModalOpen: boolean;
  setIsHealthModalOpen: (open: boolean) => void;

  // Responsive Layout States
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapse: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  // Unified Authentication
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginTargetPortal: PortalId | 'STAFF' | null;
  openLoginModal: (target?: PortalId | 'STAFF') => void;
  loginUser: (user: UserIdentity, targetPortal?: PortalId | 'STAFF', defaultTab?: string) => boolean;
  logout: () => void;

  // Interactive Actions
  navigateToPortal: (portalId: PortalId, defaultTab?: string, overrideUser?: UserIdentity) => boolean;
  logAction: (portalId: PortalId, action: string, resource: string, status: 'GRANTED' | 'DENIED' | 'FLAGGED', details: string) => void;
  
  // Student Portal Actions
  submitStudentRequest: (type: StudentRequest['type'], subject: string, details: string) => void;
  payInvoice: (invoiceId: string, amount: number, method: string) => void;

  // LMS Actions
  submitAssignment: (courseId: string, assignmentId: string, fileName: string) => void;
  gradeSubmission: (courseId: string, assignmentId: string, submissionId: string, grade: number, feedback: string) => boolean;
  submitQuizAttempt: (courseId: string, quizId: string, score: number) => void;

  // Library Actions
  borrowBook: (bookId: string) => { success: boolean; message: string };
  returnBook: (loanId: string) => void;
  reserveBook: (bookId: string) => void;
  accessDigitalResource: (resourceId: string, action: 'read_online' | 'download') => { allowed: boolean; message: string };

  // Finance Segregation of Duties Actions
  recordPayment: (studentId: string, studentName: string, studentIdentifier: string, amount: number, purpose: string, method: 'ONLINE_PORTAL' | 'BANK_TRANSFER' | 'POS') => void;
  verifyPayment: (paymentId: string) => boolean;
  reconcilePayment: (paymentId: string) => boolean;
  approvePayment: (paymentId: string) => boolean;

  // Exam Board Actions
  submitCourseMarks: (workflowId: string, marks: { studentId: string; caScore: number; examScore: number }[]) => boolean;
  moderateCourseMarks: (workflowId: string, notes: string) => boolean;
  approveExamOfficer: (workflowId: string) => boolean;
  publishRegistrar: (workflowId: string) => boolean;

  // Institutional Settings & Branded Document Engine
  institutionalSettings: InstitutionalSettings;
  updateInstitutionalSettings: (settings: Partial<InstitutionalSettings>) => void;
  resetInstitutionalSettings: () => void;
  isDocModalOpen: boolean;
  setIsDocModalOpen: (open: boolean) => void;
  activeDocPayload: InstitutionalDocPayload | null;
  openInstitutionalDocument: (payload: InstitutionalDocPayload) => void;
  closeInstitutionalDocument: () => void;

  // User Management
  updateUserStatus: (userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'ON_LEAVE') => void;

  // RBAC & Governance Actions
  checkPortalAccess: (portalId: PortalId) => { allowed: boolean; reason?: string };
  publishCrossPortalEvent: (eventType: string, source: PortalId, targets: PortalId[], payload: any, desc: string) => void;
  reconcileTransaction: (invoiceId: string) => void;
  createCustomRole: (role: RoleDefinition) => void;
  assignRoleToUser: (userId: string, assignment: { portalId: PortalId; roleId: string; roleName: string; isMonitor?: boolean; isAdmin?: boolean; scope?: any }) => void;
  assignPortalRole: (userId: string, portalId: PortalId, roleId: string, roleName: string, isMonitor?: boolean, isAdmin?: boolean, scope?: any) => void;
  revokeUserRole: (userId: string, portalId: PortalId) => void;
  revokePortalRole: (userId: string, portalId: PortalId) => void;
  togglePortalStatus: (portalId: PortalId, newStatus: PortalDefinition['status']) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export function ERPProvider({ children }: { children: ReactNode }) {
  // Institutional Settings State with LocalStorage synchronization
  const [institutionalSettings, setInstitutionalSettings] = useState<InstitutionalSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ktvtc_institutional_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...DEFAULT_INSTITUTIONAL_SETTINGS,
            ...parsed,
            campuses: parsed.campuses?.length ? parsed.campuses : DEFAULT_INSTITUTIONAL_SETTINGS.campuses,
            departments: parsed.departments?.length ? parsed.departments : DEFAULT_INSTITUTIONAL_SETTINGS.departments,
            academicTerms: parsed.academicTerms?.length ? parsed.academicTerms : DEFAULT_INSTITUTIONAL_SETTINGS.academicTerms,
            paymentAccounts: parsed.paymentAccounts?.length ? parsed.paymentAccounts : DEFAULT_INSTITUTIONAL_SETTINGS.paymentAccounts,
            gradeScales: parsed.gradeScales?.length ? parsed.gradeScales : DEFAULT_INSTITUTIONAL_SETTINGS.gradeScales,
          };
        }
      } catch (e) {
        console.error('Failed to load institutional settings from localStorage', e);
      }
    }
    return DEFAULT_INSTITUTIONAL_SETTINGS;
  });
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [activeDocPayload, setActiveDocPayload] = useState<InstitutionalDocPayload | null>(null);

  // State
  const [portals, setPortals] = useState<PortalDefinition[]>(PORTAL_REGISTRY);
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [users, setUsers] = useState<UserIdentity[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserIdentity>(INITIAL_USERS[0]); // John Doe by default
  const [activePortalId, setActivePortalId] = useState<PortalId>('PUBLIC');
  const [activeNavTab, setActiveNavTab] = useState<string>('dashboard');

  // Responsive Layout States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebarCollapse = () => setIsSidebarCollapsed(prev => !prev);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);

  // Unified Authentication Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginTargetPortal, setLoginTargetPortal] = useState<PortalId | 'STAFF' | null>(null);
  const openLoginModal = (target?: PortalId | 'STAFF') => {
    setLoginTargetPortal(target || null);
    setIsLoginModalOpen(true);
  };
  const logout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // ignore network errors on logout
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('erp_session_id');
    }
    setActivePortalId('PUBLIC');
    setIsMobileSidebarOpen(false);
  };

  // Domain data
  const [studentProfile] = useState<StudentProfileData>(MOCK_STUDENT_PROFILE);
  const [studentCourses] = useState<AcademicCourse[]>(MOCK_STUDENT_COURSES);
  const [studentInvoices, setStudentInvoices] = useState<StudentInvoice[]>(MOCK_STUDENT_INVOICES);
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>(MOCK_STUDENT_REQUESTS);
  const [clearanceItems, setClearanceItems] = useState<ClearanceItem[]>(MOCK_CLEARANCE_CHECKLIST);

  // LMS
  const [lmsCourses, setLmsCourses] = useState<LMSCourse[]>(MOCK_LMS_COURSES);
  const [activeLmsCourseId, setActiveLmsCourseId] = useState<string>('crs_csc301');

  // Library
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(MOCK_LIBRARY_BOOKS);
  const [libraryLoans, setLibraryLoans] = useState<LibraryLoan[]>(MOCK_LIBRARY_LOANS);
  const [digitalResources] = useState<DigitalResource[]>(MOCK_DIGITAL_RESOURCES);
  const [libraryReservations, setLibraryReservations] = useState<LibraryReservation[]>(MOCK_LIBRARY_RESERVATIONS);

  // Finance
  const [payments, setPayments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);

  // Exam
  const [examWorkflows, setExamWorkflows] = useState<ExaminationResultWorkflow[]>(MOCK_EXAM_WORKFLOWS);

  // Logs & Events
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_INITIAL_AUDIT_LOGS);
  const [events, setEvents] = useState<CrossPortalEvent[]>(MOCK_CROSS_PORTAL_EVENTS);
  const [notifications, setNotifications] = useState<PortalNotification[]>(MOCK_NOTIFICATIONS);

  // Modals
  const [isSecuritySuiteOpen, setIsSecuritySuiteOpen] = useState(false);
  const [isRoleBuilderOpen, setIsRoleBuilderOpen] = useState(false);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isCrudLifecycleSuiteOpen, setIsCrudLifecycleSuiteOpen] = useState(false);

  // Platform-wide CRUD & Data Lifecycle Engine
  const [crudEntities, setCrudEntities] = useState<CrudRecordMeta[]>(INITIAL_CRUD_ENTITIES);
  const [activeCrudEntityType, setActiveCrudEntityType] = useState<CrudEntityType>('COURSE');

  // Helpers
  const logAction = (
    portalId: PortalId,
    action: string,
    resource: string,
    status: 'GRANTED' | 'DENIED' | 'FLAGGED',
    details: string
  ) => {
    const assignment = currentUser.portalAssignments.find(a => a.portalId === portalId);
    const roleName = assignment ? assignment.roleName : 'Unassigned';
    const entry = createAuditLog(currentUser, portalId, roleName, action, resource, status, details);
    setAuditLogs(prev => [entry, ...prev]);
  };

  const navigateToPortal = (
    portalId: PortalId,
    defaultTab: string = 'dashboard',
    overrideUser?: UserIdentity
  ): boolean => {
    setIsMobileSidebarOpen(false);
    const userToEvaluate = overrideUser || currentUser;
    const access = evaluatePortalAccess(userToEvaluate, portalId, roles);
    if (access.allowed) {
      setActivePortalId(portalId);
      setActiveNavTab(defaultTab);
      logAction(portalId, 'NAVIGATE_PORTAL', `Entered portal ${portalId}`, 'GRANTED', access.reason);
      return true;
    } else {
      logAction(portalId, 'ACCESS_BLOCKED', `Attempted portal ${portalId}`, 'DENIED', access.reason);
      return false;
    }
  };

  const loginUser = (
    user: UserIdentity,
    targetPortal?: PortalId | 'STAFF',
    defaultTab: string = 'dashboard'
  ): boolean => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    setIsMobileSidebarOpen(false);

    let resolvedPortal: PortalId =
      (targetPortal && targetPortal !== 'STAFF' ? targetPortal : null) ||
      user.portalAssignments[0]?.portalId ||
      'STUDENT';

    // Verify user has access to target, fallback to first allowed
    const checkTarget = evaluatePortalAccess(user, resolvedPortal, roles);
    if (!checkTarget.allowed) {
      const firstAllowed = user.portalAssignments.find(
        (a) => evaluatePortalAccess(user, a.portalId, roles).allowed
      );
      resolvedPortal = firstAllowed ? firstAllowed.portalId : (user.portalAssignments[0]?.portalId || 'STUDENT');
    }

    setActivePortalId(resolvedPortal);
    setActiveNavTab(defaultTab);

    const assignment = user.portalAssignments.find((a) => a.portalId === resolvedPortal);
    const roleName = assignment ? assignment.roleName : 'Unassigned';
    const entry = createAuditLog(
      user,
      resolvedPortal,
      roleName,
      'LOGIN_AUTH',
      `Session established`,
      'GRANTED',
      `User authenticated as ${user.identifier} and redirected to ${resolvedPortal} portal.`
    );
    setAuditLogs((prev) => [entry, ...prev]);
    return true;
  };

  // Student Portal Actions
  const submitStudentRequest = (type: StudentRequest['type'], subject: string, details: string) => {
    const newReq: StudentRequest = {
      id: `req_${Date.now()}`,
      type,
      subject,
      details,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };
    setStudentRequests(prev => [newReq, ...prev]);
    logAction('STUDENT', 'SUBMIT_REQUEST', subject, 'GRANTED', `Student submitted ${type} request.`);
  };

  const payInvoice = (invoiceId: string, amount: number, method: string) => {
    setStudentInvoices(prev =>
      prev.map(inv => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = inv.paidAmount + amount;
        const newBalance = Math.max(0, inv.amount - newPaid);
        const receipt = {
          receiptNo: `REC-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().split('T')[0],
          amount,
          paymentMethod: method,
          verifiedBy: 'System Online Gateway'
        };
        return {
          ...inv,
          paidAmount: newPaid,
          balance: newBalance,
          status: newBalance === 0 ? 'PAID' : 'PARTIAL',
          receipts: [receipt, ...inv.receipts]
        };
      })
    );

    // Controlled Cross-Portal Event Emission
    const newEvent: CrossPortalEvent = {
      id: `evt_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      sourcePortal: 'STUDENT',
      targetPortals: ['FINANCE', 'EXAMINATIONS'],
      eventType: 'STUDENT_PAYMENT_INITIATED',
      description: `Payment of $${amount.toFixed(2)} received from student ${currentUser.name}.`,
      payload: { invoiceId, amount, studentId: currentUser.id },
      status: 'PROCESSED'
    };
    setEvents(prev => [newEvent, ...prev]);
    logAction('STUDENT', 'PAY_INVOICE', `Invoice ${invoiceId}`, 'GRANTED', `Paid $${amount} via ${method}.`);
  };

  // LMS Actions
  const submitAssignment = (courseId: string, assignmentId: string, fileName: string) => {
    setLmsCourses(prev =>
      prev.map(crs => {
        if (crs.id !== courseId) return crs;
        return {
          ...crs,
          assignments: crs.assignments.map(asg => {
            if (asg.id !== assignmentId) return asg;
            const existingSub = asg.submissions.find(s => s.studentId === currentUser.id);
            const newVersion = existingSub ? existingSub.version + 1 : 1;
            const newSub = {
              id: `sub_${Date.now()}`,
              studentId: currentUser.id,
              studentName: currentUser.name,
              studentIdentifier: currentUser.identifier,
              submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              fileName,
              fileSize: '3.1 MB',
              version: newVersion,
              status: 'SUBMITTED' as const,
              isLocked: true, // locked upon submission
              maxScore: asg.maxPoints
            };
            return {
              ...asg,
              submissionsCount: existingSub ? asg.submissionsCount : asg.submissionsCount + 1,
              submissions: [newSub, ...asg.submissions.filter(s => s.studentId !== currentUser.id)]
            };
          })
        };
      })
    );
    logAction('ELEARNING', 'SUBMIT_ASSIGNMENT', `Course ${courseId} / Assignment ${assignmentId}`, 'GRANTED', `Uploaded version with file locking.`);
  };

  const gradeSubmission = (
    courseId: string,
    assignmentId: string,
    submissionId: string,
    grade: number,
    feedback: string
  ): boolean => {
    // Check RBAC & Course-level scope
    const evalResult = hasPermission(currentUser, 'ELEARNING', 'student_submissions', 'grade', roles, { courseId });
    if (!evalResult.granted) {
      logAction('ELEARNING', 'GRADE_SUBMISSION', `Course ${courseId} Submission ${submissionId}`, 'DENIED', evalResult.reason);
      return false;
    }

    setLmsCourses(prev =>
      prev.map(crs => {
        if (crs.id !== courseId) return crs;
        return {
          ...crs,
          assignments: crs.assignments.map(asg => {
            if (asg.id !== assignmentId) return asg;
            return {
              ...asg,
              gradedCount: asg.gradedCount + 1,
              submissions: asg.submissions.map(sub => {
                if (sub.id !== submissionId) return sub;
                return {
                  ...sub,
                  grade,
                  feedback,
                  status: 'GRADED',
                  gradedBy: currentUser.name,
                  gradedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
                };
              })
            };
          })
        };
      })
    );
    logAction('ELEARNING', 'GRADE_SUBMISSION', `Course ${courseId} Submission ${submissionId}`, 'GRANTED', `Assigned score: ${grade}/${100}.`);
    return true;
  };

  const submitQuizAttempt = (courseId: string, quizId: string, score: number) => {
    setLmsCourses(prev =>
      prev.map(crs => {
        if (crs.id !== courseId) return crs;
        return {
          ...crs,
          quizzes: crs.quizzes.map(qz => {
            if (qz.id !== quizId) return qz;
            return {
              ...qz,
              userAttempts: [
                {
                  attemptId: `att_${Date.now()}`,
                  studentId: currentUser.id,
                  studentName: currentUser.name,
                  score,
                  completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
                },
                ...qz.userAttempts
              ]
            };
          })
        };
      })
    );
    logAction('ELEARNING', 'SUBMIT_QUIZ', `Quiz ${quizId}`, 'GRANTED', `Score achieved: ${score}.`);
  };

  // Library Actions
  const borrowBook = (bookId: string): { success: boolean; message: string } => {
    const book = libraryBooks.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) {
      return { success: false, message: 'No physical copies currently available on shelves.' };
    }

    setLibraryBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b))
    );

    const due = new Date();
    due.setDate(due.getDate() + 14);
    const newLoan: LibraryLoan = {
      id: `loan_${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userIdentifier: currentUser.identifier,
      borrowedAt: new Date().toISOString().split('T')[0],
      dueDate: due.toISOString().split('T')[0],
      status: 'ACTIVE',
      fineAccrued: 0,
      fineStatus: 'NONE'
    };

    setLibraryLoans(prev => [newLoan, ...prev]);
    logAction('ELIBRARY', 'BORROW_BOOK', book.title, 'GRANTED', `Issued 14-day circulation loan.`);
    return { success: true, message: `Successfully checked out "${book.title}". Due date: ${due.toISOString().split('T')[0]}.` };
  };

  const returnBook = (loanId: string) => {
    const loan = libraryLoans.find(l => l.id === loanId);
    if (!loan) return;

    setLibraryLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, status: 'RETURNED', returnedAt: new Date().toISOString().split('T')[0] } : l))
    );
    setLibraryBooks(prev =>
      prev.map(b => (b.id === loan.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );
    logAction('ELIBRARY', 'RETURN_BOOK', loan.bookTitle, 'GRANTED', `Physical copy checked in.`);
  };

  const reserveBook = (bookId: string) => {
    const book = libraryBooks.find(b => b.id === bookId);
    if (!book) return;

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    const newRes: LibraryReservation = {
      id: `res_${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      userId: currentUser.id,
      userName: currentUser.name,
      reservedAt: new Date().toISOString().split('T')[0],
      status: 'QUEUED',
      expiresAt: expires.toISOString().split('T')[0]
    };
    setLibraryReservations(prev => [newRes, ...prev]);
    logAction('ELIBRARY', 'RESERVE_BOOK', book.title, 'GRANTED', `Reservation placed in queue.`);
  };

  const accessDigitalResource = (resourceId: string, action: 'read_online' | 'download'): { allowed: boolean; message: string } => {
    const res = digitalResources.find(r => r.id === resourceId);
    if (!res) return { allowed: false, message: 'Resource not found.' };

    if (action === 'download' && !res.permissions.canDownload) {
      logAction('ELIBRARY', 'DIGITAL_DOWNLOAD_ATTEMPT', res.title, 'DENIED', `License type '${res.licenseType}' prohibits offline downloads.`);
      return {
        allowed: false,
        message: `Download Restricted by DRM Policy: This resource is licensed for online reading only (${res.licenseType}).`
      };
    }

    logAction('ELIBRARY', action === 'download' ? 'DIGITAL_DOWNLOAD' : 'READ_ONLINE', res.title, 'GRANTED', `Authorized access under ${res.licenseType}.`);
    return {
      allowed: true,
      message: action === 'download' ? `Download authorized: Starting download of ${res.fileSize} PDF.` : `Opening interactive digital reader.`
    };
  };

  // Finance Actions (Segregation of Duties)
  const recordPayment = (
    studentId: string,
    studentName: string,
    studentIdentifier: string,
    amount: number,
    purpose: string,
    method: 'ONLINE_PORTAL' | 'BANK_TRANSFER' | 'POS'
  ) => {
    const evalResult = hasPermission(currentUser, 'FINANCE', 'payments', 'create', roles);
    if (!evalResult.granted) {
      logAction('FINANCE', 'RECORD_PAYMENT', `Student ${studentIdentifier}`, 'DENIED', evalResult.reason);
      return;
    }

    const newPayment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      referenceNo: `TXN-${Date.now().toString().slice(-6)}`,
      studentId,
      studentName,
      studentIdentifier,
      amount,
      paymentMethod: method,
      purpose,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      recordedBy: { name: currentUser.name, role: 'Cashier', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) },
      status: 'RECORDED'
    };
    setPayments(prev => [newPayment, ...prev]);
    logAction('FINANCE', 'RECORD_PAYMENT', newPayment.referenceNo, 'GRANTED', `Cashier recorded $${amount}.`);
  };

  const verifyPayment = (paymentId: string): boolean => {
    const evalResult = hasPermission(currentUser, 'FINANCE', 'payments', 'verify', roles);
    if (!evalResult.granted) {
      logAction('FINANCE', 'VERIFY_PAYMENT', `Payment ${paymentId}`, 'DENIED', evalResult.reason);
      return false;
    }

    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? {
              ...p,
              status: 'VERIFIED',
              verifiedBy: { name: currentUser.name, role: 'Finance Officer', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }
            }
          : p
      )
    );
    logAction('FINANCE', 'VERIFY_PAYMENT', `Payment ${paymentId}`, 'GRANTED', `Finance Officer verified transaction.`);
    return true;
  };

  const reconcilePayment = (paymentId: string): boolean => {
    const evalResult = hasPermission(currentUser, 'FINANCE', 'payments', 'reconcile', roles);
    if (!evalResult.granted) {
      logAction('FINANCE', 'RECONCILE_PAYMENT', `Payment ${paymentId}`, 'DENIED', evalResult.reason);
      return false;
    }

    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? {
              ...p,
              status: 'RECONCILED',
              reconciledBy: { name: currentUser.name, role: 'Accountant', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }
            }
          : p
      )
    );
    logAction('FINANCE', 'RECONCILE_PAYMENT', `Payment ${paymentId}`, 'GRANTED', `Accountant reconciled in general ledger.`);
    return true;
  };

  const approvePayment = (paymentId: string): boolean => {
    const evalResult = hasPermission(currentUser, 'FINANCE', 'payments', 'approve', roles);
    if (!evalResult.granted) {
      logAction('FINANCE', 'APPROVE_PAYMENT', `Payment ${paymentId}`, 'DENIED', evalResult.reason);
      return false;
    }

    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId
          ? {
              ...p,
              status: 'APPROVED',
              approvedBy: { name: currentUser.name, role: 'Finance Manager', timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }
            }
          : p
      )
    );
    logAction('FINANCE', 'APPROVE_PAYMENT', `Payment ${paymentId}`, 'GRANTED', `Finance Manager approved transaction finality.`);
    return true;
  };

  // Exam Board Workflow Actions
  const submitCourseMarks = (workflowId: string, marks: { studentId: string; caScore: number; examScore: number }[]): boolean => {
    const evalResult = hasPermission(currentUser, 'EXAMINATIONS', 'marks_entry', 'create', roles);
    if (!evalResult.granted) {
      logAction('EXAMINATIONS', 'SUBMIT_MARKS', `Workflow ${workflowId}`, 'DENIED', evalResult.reason);
      return false;
    }

    setExamWorkflows(prev =>
      prev.map(wf => {
        if (wf.id !== workflowId) return wf;
        const updatedMarks = wf.marks.map(m => {
          const entry = marks.find(x => x.studentId === m.studentId);
          if (!entry) return m;
          const total = entry.caScore + entry.examScore;
          let grade = 'F';
          if (total >= 70) grade = 'A';
          else if (total >= 60) grade = 'B';
          else if (total >= 50) grade = 'C';
          else if (total >= 45) grade = 'D';
          return {
            ...m,
            caScore: entry.caScore,
            examScore: entry.examScore,
            totalScore: total,
            letterGrade: grade
          };
        });
        return {
          ...wf,
          marks: updatedMarks,
          status: 'MARKS_SUBMITTED',
          stages: {
            ...wf.stages,
            marksEntry: { completed: true, completedBy: currentUser.name, date: new Date().toISOString().split('T')[0] }
          }
        };
      })
    );
    logAction('EXAMINATIONS', 'SUBMIT_MARKS', `Workflow ${workflowId}`, 'GRANTED', `Lecturer submitted score sheet.`);
    return true;
  };

  const moderateCourseMarks = (workflowId: string, notes: string): boolean => {
    const evalResult = hasPermission(currentUser, 'EXAMINATIONS', 'moderation', 'moderate', roles);
    if (!evalResult.granted) {
      logAction('EXAMINATIONS', 'MODERATE_MARKS', `Workflow ${workflowId}`, 'DENIED', evalResult.reason);
      return false;
    }

    setExamWorkflows(prev =>
      prev.map(wf =>
        wf.id === workflowId
          ? {
              ...wf,
              status: 'MODERATED',
              stages: {
                ...wf.stages,
                moderation: { completed: true, completedBy: currentUser.name, date: new Date().toISOString().split('T')[0], notes }
              }
            }
          : wf
      )
    );
    logAction('EXAMINATIONS', 'MODERATE_MARKS', `Workflow ${workflowId}`, 'GRANTED', `Moderator endorsed grade distribution.`);
    return true;
  };

  const approveExamOfficer = (workflowId: string): boolean => {
    const evalResult = hasPermission(currentUser, 'EXAMINATIONS', 'results_workflow', 'approve', roles);
    if (!evalResult.granted) {
      logAction('EXAMINATIONS', 'OFFICER_APPROVE_MARKS', `Workflow ${workflowId}`, 'DENIED', evalResult.reason);
      return false;
    }

    setExamWorkflows(prev =>
      prev.map(wf =>
        wf.id === workflowId
          ? {
              ...wf,
              status: 'OFFICER_APPROVED',
              stages: {
                ...wf.stages,
                examOfficerApproval: { completed: true, completedBy: currentUser.name, date: new Date().toISOString().split('T')[0] }
              }
            }
          : wf
      )
    );
    logAction('EXAMINATIONS', 'OFFICER_APPROVE_MARKS', `Workflow ${workflowId}`, 'GRANTED', `Examination Officer validated for Senate gazette.`);
    return true;
  };

  const publishRegistrar = (workflowId: string): boolean => {
    const evalResult = hasPermission(currentUser, 'EXAMINATIONS', 'results_workflow', 'publish', roles);
    if (!evalResult.granted) {
      logAction('EXAMINATIONS', 'PUBLISH_REGISTRAR', `Workflow ${workflowId}`, 'DENIED', evalResult.reason);
      return false;
    }

    setExamWorkflows(prev =>
      prev.map(wf =>
        wf.id === workflowId
          ? {
              ...wf,
              status: 'PUBLISHED',
              stages: {
                ...wf.stages,
                registrarPublication: { completed: true, publishedBy: currentUser.name, date: new Date().toISOString().split('T')[0] }
              }
            }
          : wf
      )
    );

    // Cross-Portal Event to Student Portal
    const newEvent: CrossPortalEvent = {
      id: `evt_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      sourcePortal: 'EXAMINATIONS',
      targetPortals: ['STUDENT'],
      eventType: 'SENATE_RESULTS_PUBLISHED',
      description: `Official semester results for ${workflowId} published to student grade transcript.`,
      payload: { workflowId },
      status: 'PROCESSED'
    };
    setEvents(prev => [newEvent, ...prev]);
    logAction('EXAMINATIONS', 'PUBLISH_REGISTRAR', `Workflow ${workflowId}`, 'GRANTED', `Registrar officially gazetted results.`);
    return true;
  };

  // RBAC & Custom Role Actions
  const createCustomRole = (newRole: RoleDefinition) => {
    setRoles(prev => [...prev, newRole]);
    logAction('ADMIN', 'CREATE_CUSTOM_ROLE', newRole.name, 'GRANTED', `Created role for portal ${newRole.portalId}.`);
  };

  const assignRoleToUser = (
    userId: string,
    assignment: { portalId: PortalId; roleId: string; roleName: string; isMonitor?: boolean; isAdmin?: boolean; scope?: any }
  ) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== userId) return u;
        const filtered = u.portalAssignments.filter(a => a.portalId !== assignment.portalId);
        const updated = [
          ...filtered,
          {
            ...assignment,
            assignedAt: new Date().toISOString().split('T')[0]
          }
        ];
        return { ...u, portalAssignments: updated };
      })
    );

    if (currentUser.id === userId) {
      setCurrentUser(prev => {
        const filtered = prev.portalAssignments.filter(a => a.portalId !== assignment.portalId);
        return {
          ...prev,
          portalAssignments: [
            ...filtered,
            {
              ...assignment,
              assignedAt: new Date().toISOString().split('T')[0]
            }
          ]
        };
      });
    }
    logAction('ADMIN', 'ASSIGN_PORTAL_ROLE', `${userId} -> ${assignment.portalId}`, 'GRANTED', `Assigned role ${assignment.roleName}.`);
  };

  const revokeUserRole = (userId: string, portalId: PortalId) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== userId) return u;
        return {
          ...u,
          portalAssignments: u.portalAssignments.filter(a => a.portalId !== portalId)
        };
      })
    );

    if (currentUser.id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        portalAssignments: prev.portalAssignments.filter(a => a.portalId !== portalId)
      }));
    }
    logAction('ADMIN', 'REVOKE_PORTAL_ROLE', `${userId} from ${portalId}`, 'GRANTED', `Role assignment stripped.`);
  };

  const updateUserStatus = (userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'ON_LEAVE') => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, status }));
    }
    logAction('ADMIN', 'UPDATE_USER_STATUS', userId, 'GRANTED', `Updated status to ${status}.`);
  };

  // Institutional Brand & Document Engine Actions
  const updateInstitutionalSettings = (settingsUpdate: Partial<InstitutionalSettings>) => {
    setInstitutionalSettings(prev => {
      const next = { ...prev, ...settingsUpdate };
      try {
        localStorage.setItem('ktvtc_institutional_settings', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to persist institutional settings to localStorage', e);
      }
      return next;
    });

    if (settingsUpdate.name) {
      // Synchronize institution name across active current user and users directory
      setCurrentUser(prev => ({ ...prev, institution: settingsUpdate.name! }));
      setUsers(prev => prev.map(u => ({ ...u, institution: settingsUpdate.name! })));
    }

    logAction('ADMIN', 'UPDATE_INSTITUTIONAL_SETTINGS', 'Institutional Branding & Letterhead', 'GRANTED', 'Updated institutional identity and letterhead profile.');
  };

  const resetInstitutionalSettings = () => {
    try {
      localStorage.removeItem('ktvtc_institutional_settings');
    } catch (e) {
      console.error('Failed to remove institutional settings from localStorage', e);
    }
    setInstitutionalSettings(DEFAULT_INSTITUTIONAL_SETTINGS);
    setCurrentUser(prev => ({ ...prev, institution: DEFAULT_INSTITUTIONAL_SETTINGS.name }));
    setUsers(prev => prev.map(u => ({ ...u, institution: DEFAULT_INSTITUTIONAL_SETTINGS.name })));
    logAction('ADMIN', 'RESET_INSTITUTIONAL_SETTINGS', 'Institutional Branding', 'GRANTED', 'Restored default institutional settings and heraldic brand.');
  };

  const openInstitutionalDocument = (payload: InstitutionalDocPayload) => {
    setActiveDocPayload(payload);
    setIsDocModalOpen(true);
    logAction(activePortalId, 'GENERATE_DOCUMENT', `${payload.docType} (${payload.docNumber})`, 'GRANTED', `Opened official letterhead document for ${payload.recipientName}.`);
  };

  const closeInstitutionalDocument = () => {
    setIsDocModalOpen(false);
  };


  const checkPortalAccess = (portalId: PortalId) => {
    return evaluatePortalAccess(currentUser, portalId, roles);
  };

  const publishCrossPortalEvent = (
    eventType: string,
    source: PortalId,
    targets: PortalId[],
    payload: any,
    desc: string
  ) => {
    const newEvt: CrossPortalEvent = {
      id: `EVT_${Date.now()}`,
      eventType,
      sourcePortal: source,
      targetPortals: targets,
      payload,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PROCESSED',
      description: desc
    };
    setEvents(prev => [newEvt, ...prev]);
    logAction(source, 'PUBLISH_EVENT', eventType, 'GRANTED', desc);
  };

  const reconcileTransaction = (invoiceId: string) => {
    setStudentInvoices(prev =>
      prev.map(inv => {
        if (inv.id !== invoiceId) return inv;
        return {
          ...inv,
          status: 'PAID',
          receipts: [
            ...inv.receipts,
            {
              receiptNo: `REC-BUR-${Date.now().toString().slice(-6)}`,
              date: new Date().toISOString().split('T')[0],
              amount: inv.amount,
              paymentMethod: 'ONLINE_PORTAL',
              verifiedBy: currentUser.name
            }
          ]
        };
      })
    );

    // Update clearance board
    setClearanceItems(prev =>
      prev.map(item => (item.department === 'FINANCE' ? { ...item, status: 'CLEARED', notes: 'Tuition fees reconciled in full.' } : item))
    );

    publishCrossPortalEvent(
      'TUITION_FEES_CLEARED',
      'FINANCE',
      ['STUDENT', 'EXAMINATIONS'],
      { invoiceId, status: 'CLEARED' },
      'Tuition fee settlement verified. Examination permit unlocked.'
    );
  };

  const assignPortalRole = (
    userId: string,
    portalId: PortalId,
    roleId: string,
    roleName: string,
    isMonitor?: boolean,
    isAdmin?: boolean,
    scope?: any
  ) => {
    assignRoleToUser(userId, { portalId, roleId, roleName, isMonitor, isAdmin, scope });
  };

  const revokePortalRole = (userId: string, portalId: PortalId) => {
    revokeUserRole(userId, portalId);
  };

  const togglePortalStatus = (portalId: PortalId, newStatus: PortalDefinition['status']) => {
    setPortals(prev =>
      prev.map(p => (p.id === portalId ? { ...p, status: newStatus } : p))
    );
    logAction('ADMIN', 'TOGGLE_PORTAL_STATUS', portalId, 'GRANTED', `Status transitioned to ${newStatus}.`);
  };

  // -------------------------------------------------------------
  // PLATFORM-WIDE CRUD & DATA LIFECYCLE ENGINE IMPLEMENTATION
  // -------------------------------------------------------------

  const executeCrudOperation = (
    entityType: CrudEntityType,
    operation: CrudOperation,
    entityId?: string,
    payload?: Record<string, any>,
    reason?: string
  ): { success: boolean; message: string; record?: CrudRecordMeta } => {
    const existing = entityId ? crudEntities.find(e => e.id === entityId) : undefined;

    // 1. Permission & Scope Check
    const permEval = evaluateCrudPermission(currentUser, activePortalId, entityType, operation, existing);
    if (!permEval.allowed) {
      logAction(
        activePortalId,
        `CRUD_${operation.toUpperCase()}_BLOCKED`,
        `${entityType}:${entityId || 'NEW'}`,
        'DENIED',
        permEval.reason
      );
      return { success: false, message: permEval.reason };
    }

    // 2. Optimistic Concurrency Lock Check (Section 73)
    if (existing && payload?.optimisticLockToken && payload.optimisticLockToken !== existing.optimisticLockToken) {
      const conflictMsg = `Concurrency Conflict: Entity '${existing.title}' was modified in another session. Please refresh and retry.`;
      logAction(
        activePortalId,
        'CONCURRENCY_CONFLICT',
        `${entityType}:${existing.id}`,
        'FLAGGED',
        conflictMsg
      );
      return { success: false, message: conflictMsg };
    }

    const nowIso = new Date().toISOString();

    // 3. Handle CREATE Operation
    if (operation === 'create') {
      const newId = payload?.id || `${entityType.slice(0, 3)}-${Date.now().toString().slice(-6)}`;
      const codeOrIdentifier = payload?.codeOrIdentifier || payload?.code || payload?.matricNo || newId;

      // Duplicate check
      if (crudEntities.some(e => e.codeOrIdentifier.toLowerCase() === String(codeOrIdentifier).toLowerCase())) {
        const dupMsg = `Duplicate Identifier: Record with code '${codeOrIdentifier}' already exists in system records.`;
        return { success: false, message: dupMsg };
      }

      const newRecord: CrudRecordMeta = {
        id: newId,
        entityType,
        title: payload?.title || `Untitled ${entityType}`,
        codeOrIdentifier,
        portalId: activePortalId,
        lifecycleState: 'DRAFT',
        version: 1,
        optimisticLockToken: `tok_v1_${Date.now()}`,
        scope: payload?.scope || 'DEPARTMENT',
        departmentId: payload?.departmentId || currentUser.department || 'DPT_CS',
        facultyId: payload?.facultyId || currentUser.faculty || 'FAC_SCI',
        campusId: payload?.campusId || currentUser.campus || 'CAMPUS_MAIN',
        ownerId: currentUser.id,
        ownerName: currentUser.name,
        createdAt: nowIso,
        createdBy: currentUser.name,
        updatedAt: nowIso,
        updatedBy: currentUser.name,
        tags: payload?.tags || ['Draft'],
        attributes: payload?.attributes || payload || {},
        versionHistory: [
          {
            version: 1,
            changedAt: nowIso,
            changedBy: currentUser.name,
            changeReason: reason || 'Initial record creation',
            snapshot: payload || {}
          }
        ]
      };

      setCrudEntities(prev => [newRecord, ...prev]);
      logAction(
        activePortalId,
        `CRUD_CREATE`,
        `${entityType}:${newRecord.id}`,
        'GRANTED',
        `Created '${newRecord.title}' (${newRecord.codeOrIdentifier}) in DRAFT state.`
      );

      return { success: true, message: `Successfully created ${entityType} '${newRecord.title}'.`, record: newRecord };
    }

    // Must have existing entity for subsequent operations
    if (!existing) {
      return { success: false, message: `Entity '${entityId}' not found in database.` };
    }

    // 4. Handle EDIT / UPDATE Operation
    if (operation === 'edit') {
      const nextVersion = existing.version + 1;
      const updatedRecord: CrudRecordMeta = {
        ...existing,
        title: payload?.title !== undefined ? payload.title : existing.title,
        tags: payload?.tags || existing.tags,
        version: nextVersion,
        optimisticLockToken: `tok_v${nextVersion}_${Date.now()}`,
        updatedAt: nowIso,
        updatedBy: currentUser.name,
        attributes: { ...existing.attributes, ...(payload?.attributes || payload || {}) },
        versionHistory: [
          ...(existing.versionHistory || []),
          {
            version: nextVersion,
            changedAt: nowIso,
            changedBy: currentUser.name,
            changeReason: reason || 'Record attributes updated',
            snapshot: payload || {}
          }
        ]
      };

      setCrudEntities(prev => prev.map(e => (e.id === existing.id ? updatedRecord : e)));
      logAction(
        activePortalId,
        `CRUD_UPDATE`,
        `${entityType}:${existing.id}`,
        'GRANTED',
        `Updated '${existing.title}' to version v${nextVersion}. Reason: ${reason || 'Attribute update'}`
      );

      return { success: true, message: `Updated '${existing.title}' to version ${nextVersion}.`, record: updatedRecord };
    }

    // 5. Handle SOFT DELETE (Section 5)
    if (operation === 'soft_delete') {
      const updatedRecord: CrudRecordMeta = {
        ...existing,
        lifecycleState: 'SOFT_DELETED',
        previousState: existing.lifecycleState,
        deletedAt: nowIso,
        deletedBy: currentUser.name,
        deletedReason: reason || 'Soft deleted by user'
      };

      setCrudEntities(prev => prev.map(e => (e.id === existing.id ? updatedRecord : e)));
      logAction(
        activePortalId,
        `CRUD_SOFT_DELETE`,
        `${entityType}:${existing.id}`,
        'GRANTED',
        `Soft-deleted '${existing.title}'. Recovery snapshot preserved. Reason: ${reason || 'Unspecified'}`
      );

      return { success: true, message: `Soft-deleted '${existing.title}'. Record moved to trash/archive.`, record: updatedRecord };
    }

    // 6. Handle PERMANENT DELETE (Admin only)
    if (operation === 'permanent_delete') {
      setCrudEntities(prev => prev.filter(e => e.id !== existing.id));
      logAction(
        activePortalId,
        `CRUD_PERMANENT_DELETE`,
        `${entityType}:${existing.id}`,
        'GRANTED',
        `Permanently purged '${existing.title}' from active database. Reason: ${reason || 'Institutional cleanup'}`
      );

      return { success: true, message: `Permanently deleted '${existing.title}'.` };
    }

    // 7. Handle Lifecycle Transitions (submit, approve, reject, publish, archive, restore, lock, unlock, etc.)
    const transition = validateLifecycleTransition(entityType, existing.lifecycleState, operation);
    if (!transition.valid) {
      return { success: false, message: transition.reason };
    }

    const nextVersion = existing.version + 1;
    const updatedRecord: CrudRecordMeta = {
      ...existing,
      lifecycleState: transition.toState,
      previousState: existing.lifecycleState,
      version: nextVersion,
      optimisticLockToken: `tok_v${nextVersion}_${Date.now()}`,
      updatedAt: nowIso,
      updatedBy: currentUser.name,
      deletedAt: operation === 'archive' ? nowIso : undefined,
      deletedBy: operation === 'archive' ? currentUser.name : undefined,
      deletedReason: operation === 'archive' ? (reason || 'Archived') : undefined,
      versionHistory: [
        ...(existing.versionHistory || []),
        {
          version: nextVersion,
          changedAt: nowIso,
          changedBy: currentUser.name,
          changeReason: reason || `Lifecycle transition: ${existing.lifecycleState} -> ${transition.toState}`,
          snapshot: { state: transition.toState }
        }
      ]
    };

    setCrudEntities(prev => prev.map(e => (e.id === existing.id ? updatedRecord : e)));
    logAction(
      activePortalId,
      `CRUD_TRANSITION_${operation.toUpperCase()}`,
      `${entityType}:${existing.id}`,
      'GRANTED',
      `State transitioned from ${existing.lifecycleState} to ${transition.toState}. ${transition.reason}`
    );

    return { success: true, message: transition.reason, record: updatedRecord };
  };

  // Bulk Operations (Section 7)
  const executeBulkCrud = (request: BulkCrudRequest): BulkCrudResult => {
    const timestamp = new Date().toISOString();
    const batchId = `BATCH-${Date.now().toString().slice(-6)}`;
    const affectedIds: string[] = [];
    const errors: { id: string; error: string }[] = [];

    request.targetIds.forEach(id => {
      const res = executeCrudOperation(request.entityType, request.operation, id, request.payload, request.reason);
      if (res.success) {
        affectedIds.push(id);
      } else {
        errors.push({ id, error: res.message });
      }
    });

    logAction(
      activePortalId,
      `BULK_CRUD_${request.operation.toUpperCase()}`,
      `${request.entityType} [Batch: ${batchId}]`,
      errors.length === 0 ? 'GRANTED' : 'FLAGGED',
      `Bulk ${request.operation} executed on ${affectedIds.length}/${request.targetIds.length} records. Reason: ${request.reason}`
    );

    return {
      operation: request.operation,
      entityType: request.entityType,
      totalRequested: request.targetIds.length,
      successCount: affectedIds.length,
      failureCount: errors.length,
      affectedIds,
      errors,
      auditBatchId: batchId,
      timestamp
    };
  };

  // Import Workflow (Section 61)
  const executeImportDataset = (
    entityType: CrudEntityType,
    rawRows: Record<string, any>[]
  ): { success: boolean; result: ImportValidationResult; createdCount: number } => {
    const validation = validateImportDataset(entityType, rawRows, crudEntities);
    let createdCount = 0;

    if (validation.validRowsCount > 0) {
      const nowIso = new Date().toISOString();
      const newRecords: CrudRecordMeta[] = validation.parsedData.map((row, idx) => {
        const id = `${entityType.slice(0, 3)}-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`;
        const code = row.code || row.matricNo || row.id || id;
        return {
          id,
          entityType,
          title: row.title || row.name || `${entityType} ${code}`,
          codeOrIdentifier: String(code),
          portalId: activePortalId,
          lifecycleState: 'DRAFT',
          version: 1,
          optimisticLockToken: `tok_v1_${Date.now()}_${idx}`,
          scope: 'DEPARTMENT',
          departmentId: row.departmentId || currentUser.department || 'DPT_CS',
          facultyId: currentUser.faculty || 'FAC_SCI',
          campusId: currentUser.campus || 'CAMPUS_MAIN',
          ownerId: currentUser.id,
          ownerName: currentUser.name,
          createdAt: nowIso,
          createdBy: currentUser.name,
          updatedAt: nowIso,
          updatedBy: currentUser.name,
          tags: ['Batch Imported', 'Draft'],
          attributes: row
        };
      });

      setCrudEntities(prev => [...newRecords, ...prev]);
      createdCount = newRecords.length;

      logAction(
        activePortalId,
        'IMPORT_DATASET',
        `${entityType} [${createdCount} records]`,
        'GRANTED',
        `Successfully imported ${createdCount} records into DRAFT state.`
      );
    }

    return {
      success: validation.isValid || createdCount > 0,
      result: validation,
      createdCount
    };
  };

  // Export Workflow (Section 62)
  const executeExportDataset = (
    entityType: CrudEntityType,
    format: 'CSV' | 'JSON'
  ): { data: string; mimeType: string; fileName: string; allowed: boolean; message: string } => {
    // Check export permission
    const permEval = evaluateCrudPermission(currentUser, activePortalId, entityType, 'export');
    if (!permEval.allowed) {
      logAction(activePortalId, 'EXPORT_BLOCKED', entityType, 'DENIED', permEval.reason);
      return {
        data: '',
        mimeType: 'text/plain',
        fileName: '',
        allowed: false,
        message: permEval.reason
      };
    }

    const filtered = crudEntities.filter(e => e.entityType === entityType);
    let data = '';
    let mimeType = 'text/csv';
    const fileName = `${entityType.toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;

    if (format === 'CSV') {
      data = generateCsvExport(filtered);
      mimeType = 'text/csv';
    } else {
      data = JSON.stringify(filtered, null, 2);
      mimeType = 'application/json';
    }

    logAction(
      activePortalId,
      'EXPORT_DATASET',
      `${entityType} [${filtered.length} records]`,
      'GRANTED',
      `Exported ${filtered.length} records in ${format} format.`
    );

    return {
      data,
      mimeType,
      fileName,
      allowed: true,
      message: `Exported ${filtered.length} records successfully.`
    };
  };

  // Restore Entity (Section 6)
  const executeRestoreEntity = (entityId: string, reason: string): { success: boolean; message: string } => {
    return executeCrudOperation('COURSE', 'restore', entityId, undefined, reason);
  };

  // Clone / Duplicate Entity (Section 64)
  const executeCloneEntity = (
    sourceEntityId: string,
    newTitle: string,
    newCode: string
  ): { success: boolean; message: string; newRecord?: CrudRecordMeta } => {
    const source = crudEntities.find(e => e.id === sourceEntityId);
    if (!source) {
      return { success: false, message: 'Source entity not found for cloning.' };
    }

    const perm = evaluateCrudPermission(currentUser, activePortalId, source.entityType, 'clone', source);
    if (!perm.allowed) {
      return { success: false, message: perm.reason };
    }

    const nowIso = new Date().toISOString();
    const cloneId = `${source.entityType.slice(0, 3)}-CLONE-${Date.now().toString().slice(-4)}`;

    const clonedRecord: CrudRecordMeta = {
      ...source,
      id: cloneId,
      title: newTitle || `Copy of ${source.title}`,
      codeOrIdentifier: newCode || `${source.codeOrIdentifier}_COPY`,
      lifecycleState: 'DRAFT',
      version: 1,
      optimisticLockToken: `tok_v1_${Date.now()}`,
      createdAt: nowIso,
      createdBy: currentUser.name,
      updatedAt: nowIso,
      updatedBy: currentUser.name,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      deletedAt: undefined,
      deletedBy: undefined,
      deletedReason: undefined,
      isProtected: false,
      tags: [...(source.tags || []), 'Cloned'],
      versionHistory: [
        {
          version: 1,
          changedAt: nowIso,
          changedBy: currentUser.name,
          changeReason: `Cloned from ${source.id} (${source.codeOrIdentifier})`,
          snapshot: { sourceId: source.id }
        }
      ]
    };

    setCrudEntities(prev => [clonedRecord, ...prev]);
    logAction(
      activePortalId,
      'CLONE_ENTITY',
      `${source.entityType}:${clonedRecord.id}`,
      'GRANTED',
      `Cloned from ${source.id} into '${clonedRecord.title}' (${clonedRecord.codeOrIdentifier}).`
    );

    return {
      success: true,
      message: `Successfully cloned '${source.title}' as '${clonedRecord.title}'.`,
      newRecord: clonedRecord
    };
  };

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      activePortalId,
      setActivePortalId,
      activeNavTab,
      setActiveNavTab,
      portals,
      roles,
      users,
      auditLogs,
      events,
      notifications,
      studentProfile,
      studentCourses,
      studentInvoices,
      studentRequests,
      clearanceItems,
      lmsCourses,
      activeLmsCourseId,
      setActiveLmsCourseId,
      libraryBooks,
      libraryLoans,
      digitalResources,
      libraryReservations,
      payments,
      examWorkflows,
      isSecuritySuiteOpen,
      setIsSecuritySuiteOpen,
      isRoleBuilderOpen,
      setIsRoleBuilderOpen,
      isAuditDrawerOpen,
      setIsAuditDrawerOpen,
      isEventsModalOpen,
      setIsEventsModalOpen,
      isHealthModalOpen,
      setIsHealthModalOpen,
      isCrudLifecycleSuiteOpen,
      setIsCrudLifecycleSuiteOpen,
      crudEntities,
      activeCrudEntityType,
      setActiveCrudEntityType,
      institutionalSettings,
      updateInstitutionalSettings,
      resetInstitutionalSettings,
      isDocModalOpen,
      setIsDocModalOpen,
      activeDocPayload,
      openInstitutionalDocument,
      closeInstitutionalDocument,
      updateUserStatus,
      executeCrudOperation,
      executeBulkCrud,
      executeImportDataset,
      executeExportDataset,
      executeRestoreEntity,
      executeCloneEntity,
      navigateToPortal,
      checkPortalAccess,
      publishCrossPortalEvent,
      reconcileTransaction,
      logAction,
      submitStudentRequest,
      payInvoice,
      submitAssignment,
      gradeSubmission,
      submitQuizAttempt,
      borrowBook,
      returnBook,
      reserveBook,
      accessDigitalResource,
      recordPayment,
      verifyPayment,
      reconcilePayment,
      approvePayment,
      submitCourseMarks,
      moderateCourseMarks,
      approveExamOfficer,
      publishRegistrar,
      createCustomRole,
      assignRoleToUser,
      assignPortalRole,
      revokeUserRole,
      revokePortalRole,
      togglePortalStatus,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      toggleSidebarCollapse,
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      toggleMobileSidebar,
      isLoginModalOpen,
      setIsLoginModalOpen,
      loginTargetPortal,
      openLoginModal,
      loginUser,
      logout
    }),
    [
      currentUser,
      activePortalId,
      activeNavTab,
      loginUser,
      portals,
      roles,
      users,
      institutionalSettings,
      isDocModalOpen,
      activeDocPayload,
      auditLogs,
      events,
      notifications,
      studentProfile,
      studentCourses,
      studentInvoices,
      studentRequests,
      clearanceItems,
      lmsCourses,
      activeLmsCourseId,
      libraryBooks,
      libraryLoans,
      digitalResources,
      libraryReservations,
      payments,
      examWorkflows,
      isSecuritySuiteOpen,
      isRoleBuilderOpen,
      isAuditDrawerOpen,
      isEventsModalOpen,
      isHealthModalOpen,
      isCrudLifecycleSuiteOpen,
      crudEntities,
      activeCrudEntityType,
      isSidebarCollapsed,
      isMobileSidebarOpen,
      isLoginModalOpen,
      loginTargetPortal
    ]
  );

  return <ERPContext.Provider value={value}>{children}</ERPContext.Provider>;
}

export function useERP() {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
}
