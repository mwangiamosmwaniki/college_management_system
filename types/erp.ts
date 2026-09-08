// Core Domain Types for College ERP Multi-Portal Architecture

export type PortalId = 
  | 'PUBLIC'
  | 'APPLICANT'
  | 'STUDENT'
  | 'LECTURER'
  | 'HOD'
  | 'REGISTRAR'
  | 'EXAMINATIONS'
  | 'FINANCE'
  | 'ELIBRARY'
  | 'ATTACHMENT'
  | 'HR'
  | 'PROCUREMENT'
  | 'PRINCIPAL'
  | 'ADMIN'
  | 'ADMISSIONS'
  | 'ELEARNING'
  | 'HOSTEL'
  | 'TRANSPORT'
  | 'CLINIC'
  | 'ALUMNI'
  | 'PARENT'
  | 'SUPPORT'
  | 'RESEARCH';

export type PortalStatus = 'ONLINE' | 'DEGRADED' | 'MAINTENANCE' | 'OFFLINE';

export interface PortalDefinition {
  id: PortalId;
  name: string;
  code: string;
  description: string;
  urlPrefix: string;
  status: PortalStatus;
  version: string;
  ownerDepartment: string;
  adminRole: string;
  themeColor: string; // Tailwind color token
  accentColor: string;
  iconName: string;
  defaultRoles: string[];
}

export interface UserScope {
  campusId?: string;
  facultyId?: string;
  departmentId?: string;
  programmeId?: string;
  courseIds?: string[]; // Specific courses for Course-Level RBAC
  classId?: string;
  libraryId?: string;
  hostelId?: string;
}

export interface PortalAssignment {
  portalId: PortalId;
  roleId: string;
  roleName: string;
  isMonitor?: boolean;
  isAdmin?: boolean;
  scope?: UserScope;
  customPermissions?: string[];
  assignedAt: string;
}

export interface UserIdentity {
  id: string;
  identifier: string; // e.g. STU-2026-00124, EMP-2024-089
  name: string;
  email: string;
  avatarUrl: string;
  institution: string;
  department: string;
  faculty: string;
  campus: string;
  phone?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'ON_LEAVE';
  portalAssignments: PortalAssignment[];
  passwordHash?: string;
  pin?: string;
  impersonatedBy?: string;
  impersonationReason?: string;
  impersonatedAt?: string;
  failedLoginAttempts?: number;
  lockedUntil?: string;
}

export type PermissionAction = 
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'export'
  | 'configure'
  | 'grade'
  | 'moderate'
  | 'publish'
  | 'reconcile'
  | 'verify'
  | 'issue'
  | 'return'
  | 'download'
  | 'read_online'
  | 'monitor'
  | 'override';

export interface RoleDefinition {
  id: string;
  portalId: PortalId;
  name: string;
  description: string;
  isSystemDefault: boolean;
  isMonitor: boolean;
  isAdmin: boolean;
  permissions: {
    [resource: string]: PermissionAction[];
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userIdentifier: string;
  portalId: PortalId;
  roleName: string;
  action: string;
  resource: string;
  resourceId?: string;
  status: 'GRANTED' | 'DENIED' | 'FLAGGED';
  ipAddress: string;
  details: string;
  actorId?: string;
  sessionId?: string;
  reason?: string;
  previousState?: any;
  newState?: any;
}

export interface CrossPortalEvent {
  id: string;
  timestamp: string;
  sourcePortal: PortalId;
  targetPortals: PortalId[];
  eventType: string;
  description: string;
  payload: Record<string, any>;
  status: 'DISPATCHED' | 'PROCESSED' | 'PENDING';
}

export interface PortalNotification {
  id: string;
  sourcePortal: PortalId;
  targetUserId: string;
  title: string;
  message: string;
  category: 'ACADEMIC' | 'FINANCIAL' | 'DEADLINE' | 'SYSTEM' | 'SECURITY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

// -------------------------------------------------------------
// STUDENT PORTAL DOMAIN
// -------------------------------------------------------------
export interface AcademicCourse {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  instructorName?: string;
  semester: string;
  level: string;
  status: 'REGISTERED' | 'COMPLETED' | 'IN_PROGRESS' | 'DROPPED' | 'AVAILABLE';
  grade?: string;
  gradePoint?: number;
  schedule: string;
  room?: string;
  category?: string;
  lecturer?: string;
  venue?: string;
  prerequisites?: string;
}

export interface StudentProfileData {
  studentId: string;
  matricNumber: string;
  programme: string;
  faculty: string;
  department: string;
  currentLevel: string;
  currentSemester: string;
  academicYear: string;
  cgpa: number;
  totalCreditsEarned: number;
  totalCreditsRequired: number;
  academicStanding: 'GOOD_STANDING' | 'PROBATION' | 'DEAN_LIST';
  graduationEligibility: boolean;
  advisorName: string;
  advisorEmail: string;
}

export interface StudentRequest {
  id: string;
  type: 'LEAVE_OF_ABSENCE' | 'COURSE_ADD_DROP' | 'OFFICIAL_TRANSCRIPT' | 'HOSTEL_CHANGE' | 'CLEARANCE_PETITION' | 'GRADE_RECHECK';
  subject: string;
  details: string;
  submittedAt: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewRemarks?: string;
}

export interface StudentInvoice {
  id: string;
  invoiceNumber: string;
  title: string;
  session: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE';
  items: { description: string; amount: number }[];
  receipts: { receiptNo: string; date: string; amount: number; paymentMethod: string; verifiedBy: string }[];
}

export interface ClearanceItem {
  id: string;
  department: 'LIBRARY' | 'HOSTEL' | 'FINANCE' | 'FACULTY' | 'SPORTS' | 'STUDENT_AFFAIRS';
  officerName: string;
  status: 'CLEARED' | 'PENDING' | 'OUTSTANDING_DEBT' | 'BLOCKED';
  notes: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// E-LEARNING (LMS) DOMAIN
// -------------------------------------------------------------
export interface LMSLesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'VIDEO' | 'READING' | 'SLIDES' | 'INTERACTIVE';
  contentUrl?: string;
  notesText?: string;
  completed?: boolean;
}

export interface LMSModule {
  id: string;
  title: string;
  order: number;
  lessons: LMSLesson[];
}

export interface LMSAssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentIdentifier: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  version: number;
  status: 'SUBMITTED' | 'LATE' | 'GRADED' | 'RETURNED_FOR_REVISION';
  isLocked: boolean;
  grade?: number;
  maxScore: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface LMSAssignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  weightPercentage: number;
  submissionsCount: number;
  gradedCount: number;
  submissions: LMSAssignmentSubmission[];
}

export interface LMSQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
  explanation: string;
}

export interface LMSQuiz {
  id: string;
  courseId: string;
  title: string;
  timeLimitMinutes: number;
  totalPoints: number;
  questions: LMSQuizQuestion[];
  attemptsAllowed: number;
  userAttempts: {
    attemptId: string;
    studentId: string;
    studentName: string;
    score: number;
    completedAt: string;
  }[];
}

export interface LMSCourse {
  id: string;
  code: string;
  title: string;
  faculty: string;
  department: string;
  leadInstructorId: string;
  leadInstructorName: string;
  instructorIds: string[]; // For Course-Level RBAC checks
  taIds: string[];
  enrolledStudentsCount: number;
  thumbnail: string;
  progressPercentage?: number; // for current learner
  modules: LMSModule[];
  assignments: LMSAssignment[];
  quizzes: LMSQuiz[];
  announcements: { id: string; title: string; content: string; date: string; author: string }[];
}

// -------------------------------------------------------------
// E-LIBRARY DOMAIN
// -------------------------------------------------------------
export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  authors: string[];
  edition: string;
  publisher: string;
  year: number;
  category: string;
  callNumber: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  coverImage: string;
}

export interface LibraryLoan {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  userIdentifier: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: 'ACTIVE' | 'OVERDUE' | 'RETURNED' | 'RENEWED';
  fineAccrued: number;
  fineStatus: 'NONE' | 'UNPAID' | 'PAID';
}

export interface DigitalResource {
  id: string;
  title: string;
  authors: string[];
  type: 'EBOOK' | 'JOURNAL_ARTICLE' | 'RESEARCH_PAPER' | 'THESIS' | 'AUDIOBOOK';
  doi?: string;
  publisher: string;
  year: number;
  category: string;
  fileFormat: 'PDF' | 'EPUB' | 'MP3';
  fileSize: string;
  licenseType: 'INSTITUTIONAL_OPEN' | 'FACULTY_ONLY' | 'READ_ONLY_DRM' | 'RESEARCH_COMMONS';
  // Granular Access Permissions
  permissions: {
    canView: boolean;
    canReadOnline: boolean;
    canDownload: boolean;
    canPrint: boolean;
    canShare: boolean;
  };
  totalDownloads: number;
  totalReads: number;
}

export interface LibraryReservation {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  reservedAt: string;
  queuePosition?: number;
  status: 'QUEUED' | 'READY_FOR_PICKUP' | 'CANCELLED' | 'FULFILLED';
  expiresAt: string;
}

// -------------------------------------------------------------
// FINANCE DOMAIN
// -------------------------------------------------------------
export interface PaymentRecord {
  id: string;
  referenceNo: string;
  studentId: string;
  studentName: string;
  studentIdentifier: string;
  amount: number;
  paymentMethod: 'ONLINE_PORTAL' | 'BANK_TRANSFER' | 'POS' | 'CHEQUE';
  purpose: string;
  createdAt: string;
  // Segregation of Duties stages
  recordedBy: { name: string; role: 'Cashier' | 'System'; timestamp: string };
  verifiedBy?: { name: string; role: 'Finance Officer'; timestamp: string };
  reconciledBy?: { name: string; role: 'Accountant'; timestamp: string };
  approvedBy?: { name: string; role: 'Finance Manager'; timestamp: string };
  status: 'RECORDED' | 'VERIFIED' | 'RECONCILED' | 'APPROVED' | 'REJECTED';
  remarks?: string;
}

// -------------------------------------------------------------
// EXAMINATIONS DOMAIN
// -------------------------------------------------------------
export interface ExamCourseMarkEntry {
  studentId: string;
  studentName: string;
  studentIdentifier: string;
  caScore: number; // Continuous Assessment (e.g. max 30)
  examScore: number; // Final Exam (e.g. max 70)
  totalScore: number; // caScore + examScore
  letterGrade: string;
  moderatedScore?: number;
  remarks?: string;
}

export interface ExaminationResultWorkflow {
  id: string;
  courseCode: string;
  courseTitle: string;
  session: string;
  semester: string;
  totalCandidates: number;
  marks: ExamCourseMarkEntry[];
  // Strict multi-stage role progression:
  // Lecturer -> Moderator -> Examination Officer -> Registrar (Publication)
  stages: {
    marksEntry: { completed: boolean; completedBy?: string; date?: string };
    moderation: { completed: boolean; completedBy?: string; date?: string; notes?: string };
    examOfficerApproval: { completed: boolean; completedBy?: string; date?: string };
    registrarPublication: { completed: boolean; publishedBy?: string; date?: string };
  };
  status: 'DRAFT' | 'MARKS_SUBMITTED' | 'MODERATED' | 'OFFICER_APPROVED' | 'PUBLISHED';
}

// -------------------------------------------------------------
// HUMAN RESOURCES DOMAIN
// -------------------------------------------------------------
export interface EmployeeRecord {
  id: string;
  empId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  employmentType: 'FULL_TIME_ACADEMIC' | 'ADJUNCT_FACULTY' | 'ADMINISTRATIVE' | 'EXECUTIVE';
  dateJoined: string;
  salaryGrade: string;
  leaveBalanceDays: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'PROBATION';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'ANNUAL' | 'SICK' | 'SABBATICAL' | 'MATERNITY' | 'STUDY';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'PENDING' | 'RECOMMENDED' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
}

export interface PayrollBatch {
  id: string;
  batchNumber: string;
  month: string;
  year: number;
  totalGrossAmount: number;
  totalDeductions: number;
  totalNetAmount: number;
  employeeCount: number;
  status: 'DRAFT' | 'VERIFIED_HR' | 'AUDITED_FINANCE' | 'DISBURSED';
  processedBy: string;
  verifiedBy?: string;
}

// -------------------------------------------------------------
// ADMISSIONS DOMAIN
// -------------------------------------------------------------
export interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  applicantName: string;
  email: string;
  phone: string;
  intendedProgramme: string;
  faculty: string;
  appliedDate: string;
  qualificationScore: string; // e.g. 320/400
  documentsVerified: boolean;
  interviewScore?: number;
  status: 'SUBMITTED' | 'DOCS_VERIFIED' | 'INTERVIEW_SCHEDULED' | 'RECOMMENDED' | 'OFFERED' | 'ENROLLED' | 'REJECTED';
  decisionNotes?: string;
}

// -------------------------------------------------------------
// HOSTEL DOMAIN
// -------------------------------------------------------------
export interface HostelRoom {
  id: string;
  hallName: string;
  roomNumber: string;
  capacity: number;
  occupied: number;
  gender: 'MALE' | 'FEMALE';
  status: 'AVAILABLE' | 'FULL' | 'MAINTENANCE';
  residents: { studentId: string; studentName: string; matricNo: string }[];
}

// -------------------------------------------------------------
// LECTURER & ACADEMIC FACULTY PORTAL DOMAIN
// -------------------------------------------------------------
export interface LecturerCourseMaterial {
  id: string;
  courseCode: string;
  title: string;
  category: 'LECTURE_SLIDES' | 'SYLLABUS' | 'LAB_GUIDE' | 'READING' | 'SAMPLE_CODE' | 'ASSIGNMENT_BRIEF';
  fileName: string;
  fileSize: string;
  fileFormat: string;
  uploadDate: string;
  uploadedBy: string;
  version: number;
  visibility: 'PUBLISHED' | 'DRAFT' | 'RESTRICTED';
  downloadCount: number;
  tags: string[];
  versionHistory: {
    version: number;
    updatedAt: string;
    updatedBy: string;
    changeLog: string;
    fileSize: string;
  }[];
}

export interface LecturerLessonSchedule {
  id: string;
  courseCode: string;
  moduleName: string;
  topic: string;
  weekNumber: number;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  deliveryMode: 'IN_PERSON' | 'HYBRID' | 'ONLINE_LIVE' | 'RECORDED';
  status: 'COMPLETED' | 'SCHEDULED' | 'CANCELLED' | 'RESCHEDULED';
  learningObjectives: string[];
  materialsCount: number;
  attendanceRecorded: boolean;
}

export interface AttendanceRecordEntry {
  studentId: string;
  matricNumber: string;
  studentName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  checkInTime?: string;
  checkInMethod?: 'QR_SCAN' | 'MANUAL_LECTURER' | 'BIOMETRIC' | 'PORTAL_SIM';
  remarks?: string;
}

export interface LecturerAttendanceSession {
  id: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  timeSlot: string;
  venue: string;
  groupName: string;
  topic: string;
  mode: 'MANUAL' | 'QR_ACTIVE' | 'QR_CLOSED';
  qrSessionCode?: string;
  qrExpiresAt?: string;
  totalEnrolled: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
  records: AttendanceRecordEntry[];
}

export interface RubricLevel {
  id: string;
  title: string;
  points: number;
  description: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  maxPoints: number;
  description: string;
  levels: RubricLevel[];
}

export interface LecturerGradingRubric {
  id: string;
  courseCode: string;
  title: string;
  totalPoints: number;
  criteria: RubricCriterion[];
}

export interface LecturerAssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  status: 'GRADED' | 'UNGRADED' | 'LATE' | 'RESUBMISSION_REQUESTED';
  score?: number;
  maxPoints: number;
  percentageScore?: number;
  letterGrade?: string;
  similarityScore?: number; // Plagiarism percentage
  rubricScores?: Record<string, number>;
  feedbackNotes?: string;
  gradedBy?: string;
  gradedAt?: string;
  annotationsCount?: number;
}

export interface LecturerAssignmentItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  instructions: string;
  assignedDate: string;
  dueDate: string;
  maxPoints: number;
  weightPercentage: number;
  rubricId?: string;
  rubricTitle?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'CLOSED';
  plagiarismCheckEnabled: boolean;
  totalSubmissions: number;
  gradedSubmissions: number;
  averageScore?: number;
  submissions: LecturerAssignmentSubmission[];
}

export interface QuestionBankItem {
  id: string;
  courseCode: string;
  topic: string;
  questionType: 'MCQ' | 'MULTIPLE_SELECT' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY' | 'NUMERICAL';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  bloomTaxonomyLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
  questionText: string;
  options?: string[];
  correctAnswers: string | string[];
  points: number;
  explanation: string;
  tags: string[];
}

export interface OnlineTestAttempt {
  id: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  submittedAt: string;
  score: number;
  autoGradedScore: number;
  manualGradedScore: number;
  totalPoints: number;
  status: 'AUTO_GRADED' | 'REQUIRES_MANUAL_REVIEW' | 'COMPLETED';
  gradedBy?: string;
}

export interface LecturerOnlineTest {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  testType: 'QUIZ' | 'CONTINUOUS_ASSESSMENT' | 'MIDTERM' | 'FINAL_EXAM' | 'MOCK';
  durationMinutes: number;
  totalMarks: number;
  weightPercentage: number;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'CLOSED';
  scheduledStart: string;
  scheduledEnd: string;
  autoGradingEnabled: boolean;
  passingScore: number;
  attemptsAllowed: number;
  questionsCount: number;
  totalAttempts: number;
  pendingManualGradingCount: number;
  questions: QuestionBankItem[];
  attempts: OnlineTestAttempt[];
}

export interface LecturerStudentProfile {
  studentId: string;
  matricNumber: string;
  name: string;
  programme: string;
  yearLevel: string;
  email: string;
  phone: string;
  group: string;
  attendancePct: number;
  caScore: number; // Continuous assessment total
  examScore: number;
  totalScore: number;
  currentGrade: string;
  riskStatus: 'GOOD_STANDING' | 'MONITOR' | 'AT_RISK' | 'CRITICAL';
  riskReasons: string[];
  notes: { date: string; author: string; note: string }[];
}

export interface CourseGradebookEntry {
  studentId: string;
  matricNumber: string;
  studentName: string;
  programme: string;
  attendanceScore: number; // Max 10
  assignment1: number; // Max 15
  assignment2: number; // Max 15
  catScore: number; // Max 20 (Midterm/Quiz)
  projectScore: number; // Max 10
  continuousAssessmentTotal: number; // Sum of CA = 70 max or 30 max
  examScore: number; // Final Exam = 70 or 100
  totalWeightedScore: number; // 100% total
  letterGrade: string;
  gradePoint: number;
  status: 'DRAFT' | 'SUBMITTED' | 'MODERATED' | 'APPROVED' | 'PUBLISHED';
  flaggedOutlier?: boolean;
}

export interface GradeChangeRequest {
  id: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  courseCode: string;
  courseTitle: string;
  componentName: string; // e.g. Final Exam Score, CA Assignment 2
  oldScore: number;
  newScore: number;
  oldGrade: string;
  newGrade: string;
  reason: string;
  supportingDocName?: string;
  submittedAt: string;
  submittedBy: string;
  status: 'PENDING_HOD' | 'PENDING_DEAN' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewRemarks?: string;
}

export interface AcademicAdvisingRecord {
  id: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  programme: string;
  cgpa: number;
  academicStanding: 'GOOD_STANDING' | 'ACADEMIC_PROBATION' | 'DEAN_LIST';
  riskAlerts: string[];
  consultationLogs: {
    id: string;
    date: string;
    mode: 'IN_PERSON' | 'VIRTUAL' | 'EMAIL';
    discussionSummary: string;
    actionPlan: string;
    followUpDate: string;
    advisorName: string;
  }[];
  referrals: string[];
}

export interface StudentReferralItem {
  id: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  targetDepartment: 'COUNSELLING' | 'ACADEMIC_SUPPORT' | 'FINANCE_BURSARY' | 'DISABILITY_SERVICES' | 'UNIVERSITY_LIBRARY';
  reasonCategory: 'ACADEMIC_DIFFICULTY' | 'EMOTIONAL_WELLBEING' | 'FINANCIAL_HARDSHIP' | 'SPECIAL_NEEDS' | 'ATTENDANCE_DEFICIT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  description: string;
  submittedAt: string;
  referredBy: string;
  status: 'DISPATCHED' | 'APPOINTMENT_SCHEDULED' | 'RESOLVED';
  feedbackNotes?: string;
}

export interface SupervisionProject {
  id: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  programme: string;
  projectTitle: string;
  projectType: 'UNDERGRADUATE_CAPSTONE' | 'MASTERS_THESIS' | 'DOCTORAL_DISSERTATION';
  currentMilestone: 'PROPOSAL' | 'LITERATURE_REVIEW' | 'METHODOLOGY' | 'IMPLEMENTATION' | 'DRAFT_REPORT' | 'DEFENSE_READY' | 'FINAL_SUBMISSION';
  progressPercentage: number;
  status: 'ACTIVE' | 'ON_TRACK' | 'BEHIND_SCHEDULE' | 'DEFENDED';
  nextMeetingDate: string;
  nextDeliverable: string;
  milestones: {
    name: string;
    dueDate: string;
    completedDate?: string;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'OVERDUE';
    comments?: string;
  }[];
  submissions: {
    id: string;
    fileName: string;
    version: number;
    uploadedAt: string;
    supervisorFeedback?: string;
  }[];
}

export interface ResearchPublicationItem {
  id: string;
  title: string;
  authors: string[];
  publicationType: 'PEER_REVIEWED_JOURNAL' | 'INTERNATIONAL_CONFERENCE' | 'BOOK_CHAPTER' | 'PATENT' | 'WORKING_PAPER';
  journalOrConference: string;
  doi?: string;
  publicationDate: string;
  citationsCount: number;
  indexing: 'SCOPUS' | 'WEB_OF_SCIENCE' | 'IEEE_XPLORE' | 'ACM_DL' | 'GOOGLE_SCHOLAR';
  abstractText: string;
  pdfUrl?: string;
  fundingGrant?: string;
}

export interface LecturerTaskItem {
  id: string;
  title: string;
  category: 'GRADING' | 'TEACHING_PREP' | 'ADVISING' | 'RESEARCH' | 'ADMIN_COMMITTEE' | 'EXAM_MODERATION';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate: string;
  completed: boolean;
  courseCode?: string;
}

export interface LecturerMeetingSchedule {
  id: string;
  title: string;
  meetingType: 'DEPARTMENT_BOARD' | 'FACULTY_SENATE' | 'EXAM_BOARD' | 'CURRICULUM_REVIEW' | 'RESEARCH_GROUP';
  date: string;
  time: string;
  venue: string;
  agendaItems: string[];
  organizer: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  minutesAvailable: boolean;
}

export interface LecturerWorkloadStats {
  assignedCoursesCount: number;
  totalCreditHours: number;
  weeklyContactHours: number;
  totalStudentsTaught: number;
  supervisionCandidates: number;
  committeeAssignmentsCount: number;
  officeHoursWeekly: number;
  teachingLoadStatus: 'NORMAL' | 'OVERLOAD' | 'LIGHT';
}

export interface LecturerResourceRequest {
  id: string;
  category: 'LAB_EQUIPMENT' | 'ROOM_CHANGE' | 'SOFTWARE_LICENSE' | 'EXAM_PRINTING' | 'TEACHING_ASSISTANT' | 'TRAVEL_GRANT';
  title: string;
  courseCode?: string;
  justification: string;
  requestedDate: string;
  status: 'PENDING' | 'HOD_APPROVED' | 'PROCUREMENT_DISPATCHED' | 'FULFILLED' | 'REJECTED';
  approverRemarks?: string;
}

export interface LecturerCourseFull {
  id: string;
  code: string;
  title: string;
  faculty: string;
  department: string;
  level: string;
  semester: string;
  academicYear: string;
  creditUnits: number;
  contactHoursWeekly: number;
  isCoordinator: boolean;
  coordinatorName: string;
  instructors: string[];
  teachingAssistants: string[];
  enrolledStudentsCount: number;
  averageAttendancePct: number;
  gradebookLockStatus: 'DRAFT' | 'SUBMITTED' | 'MODERATED' | 'APPROVED' | 'PUBLISHED';
  syllabus: {
    description: string;
    prerequisites: string[];
    learningOutcomes: string[];
    gradingBreakdown: { component: string; weight: number }[];
  };
  materials: LecturerCourseMaterial[];
  lessons: LecturerLessonSchedule[];
  assignments: LecturerAssignmentItem[];
  tests: LecturerOnlineTest[];
  studentsRoster: LecturerStudentProfile[];
  gradebook: CourseGradebookEntry[];
}

// -------------------------------------------------------------
// PLATFORM-WIDE CRUD & DATA LIFECYCLE ENGINE TYPES
// -------------------------------------------------------------

export type CrudOperation =
  | 'create'
  | 'view'
  | 'edit'
  | 'submit'
  | 'approve'
  | 'reject'
  | 'publish'
  | 'unpublish'
  | 'archive'
  | 'restore'
  | 'activate'
  | 'deactivate'
  | 'lock'
  | 'unlock'
  | 'clone'
  | 'import'
  | 'export'
  | 'download'
  | 'upload'
  | 'assign'
  | 'unassign'
  | 'transfer'
  | 'promote'
  | 'suspend'
  | 'reinstate'
  | 'verify'
  | 'cancel'
  | 'soft_delete'
  | 'permanent_delete';

export type LifecycleState =
  | 'DRAFT'
  | 'PENDING'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'MODERATED'
  | 'APPROVED'
  | 'REJECTED'
  | 'ACTIVE'
  | 'PUBLISHED'
  | 'LOCKED'
  | 'COMPLETED'
  | 'SUSPENDED'
  | 'DEACTIVATED'
  | 'ARCHIVED'
  | 'SOFT_DELETED'
  | 'VOIDED';

export type CrudScope =
  | 'OWN'
  | 'COURSE'
  | 'CLASS'
  | 'DEPARTMENT'
  | 'FACULTY'
  | 'CAMPUS'
  | 'INSTITUTION';

export type CrudEntityType =
  | 'COURSE'
  | 'STUDENT'
  | 'LECTURER'
  | 'PROGRAMME'
  | 'CURRICULUM'
  | 'ACADEMIC_YEAR'
  | 'SEMESTER'
  | 'COURSE_ASSIGNMENT'
  | 'CLASS_GROUP'
  | 'STUDENT_ENROLMENT'
  | 'LESSON_MATERIAL'
  | 'ASSIGNMENT'
  | 'SUBMISSION'
  | 'QUESTION_BANK'
  | 'ONLINE_TEST'
  | 'TEST_ATTEMPT'
  | 'ATTENDANCE_SESSION'
  | 'GRADEBOOK_ENTRY'
  | 'EXAM_RESULT'
  | 'TRANSCRIPT'
  | 'GRADE_CHANGE_REQUEST'
  | 'EXAMINATION_PAPER'
  | 'LIBRARY_BOOK'
  | 'LIBRARY_LOAN'
  | 'RESEARCH_PROJECT'
  | 'PROJECT_SUPERVISION'
  | 'ACADEMIC_ADVISING'
  | 'TIMETABLE_SLOT'
  | 'CAMPUS_ROOM'
  | 'COMMUNICATION_MESSAGE'
  | 'TASK_ITEM'
  | 'STUDENT_REQUEST'
  | 'APPROVAL_ITEM'
  | 'INVOICE'
  | 'PAYMENT_RECORD'
  | 'HR_EMPLOYEE'
  | 'LEAVE_REQUEST'
  | 'ADMISSION_APPLICATION'
  | 'DOCUMENT_FILE'
  | 'SAVED_REPORT'
  | 'SYSTEM_CONFIG'
  | 'ROLE_DEFINITION';

export interface CrudRecordMeta {
  id: string;
  entityType: CrudEntityType;
  title: string;
  codeOrIdentifier: string;
  portalId: PortalId;
  lifecycleState: LifecycleState;
  previousState?: LifecycleState;
  version: number;
  optimisticLockToken: string;
  scope: CrudScope;
  departmentId: string;
  facultyId: string;
  campusId: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt?: string;
  deletedBy?: string;
  deletedReason?: string;
  isImmutable?: boolean;
  isProtected?: boolean; // Cannot be hard-deleted if referenced historically
  tags?: string[];
  attributes: Record<string, any>;
  versionHistory?: {
    version: number;
    changedAt: string;
    changedBy: string;
    changeReason: string;
    snapshot: Record<string, any>;
  }[];
}

export interface BulkCrudRequest {
  entityType: CrudEntityType;
  operation: CrudOperation;
  targetIds: string[];
  payload?: Record<string, any>;
  reason: string;
  confirmed: boolean;
}

export interface BulkCrudResult {
  operation: CrudOperation;
  entityType: CrudEntityType;
  totalRequested: number;
  successCount: number;
  failureCount: number;
  affectedIds: string[];
  errors: { id: string; error: string }[];
  auditBatchId: string;
  timestamp: string;
}

export interface ImportFieldDef {
  key: string;
  label: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'date';
  options?: string[];
  defaultValue?: any;
}

export interface ImportValidationResult {
  isValid: boolean;
  totalRows: number;
  validRowsCount: number;
  errorRowsCount: number;
  duplicateCount: number;
  parsedData: Record<string, any>[];
  errors: { row: number; field: string; message: string }[];
  warnings: string[];
}

export interface CrudTestCaseResult {
  id: string;
  section: string;
  category: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'EXPORT' | 'IMPORT' | 'LIFECYCLE' | 'CONCURRENCY';
  title: string;
  description: string;
  testedRole: string;
  testedScope: CrudScope;
  expectedOutcome: 'SUCCESS' | 'DENIED' | 'VALIDATION_ERROR' | 'LOCKED_REJECTED' | 'PROTECTED_REJECTED';
  actualOutcome: 'SUCCESS' | 'DENIED' | 'VALIDATION_ERROR' | 'LOCKED_REJECTED' | 'PROTECTED_REJECTED';
  passed: boolean;
  diagnostic: string;
  timestamp: string;
}

export type LetterheadHeaderStyle = 'CLASSIC_CREST' | 'MODERN_BANNER' | 'MINIMAL_EXECUTIVE' | 'FORMAL_SEAL';

export interface CampusBranch {
  id: string;
  name: string;
  code: string;
  type: 'MAIN_CAMPUS' | 'SATELLITE_CAMPUS' | 'TOWN_CENTER' | 'ANNEX_WORKSHOP' | 'VIRTUAL_ODEL';
  county: string;
  address: string;
  directorName: string;
  phone: string;
  email: string;
  studentCapacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  establishedDate?: string;
}

export interface AcademicDepartment {
  id: string;
  code: string;
  name: string;
  faculty: string;
  hodName: string;
  hodEmail: string;
  phone: string;
  officeLocation: string;
  status: 'ACTIVE' | 'INACTIVE';
  programmesCount?: number;
}

export interface AcademicTermSession {
  id: string;
  academicYear: string;
  termName: string;
  intakeName: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  examStartDate: string;
  examEndDate: string;
  isCurrentActive: boolean;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
}

export interface SchoolPaymentAccount {
  id: string;
  label: string;
  bankOrProvider: string;
  accountNumber: string;
  accountName: string;
  branch?: string;
  paybillOrTill?: string;
  purpose: 'TUITION_FEES' | 'EXAMINATION_FEES' | 'ACCOMMODATION' | 'APPLICATION_FEE' | 'CAPITATION_DEVELOPMENT' | 'GENERAL';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface InstitutionalGradeScale {
  id: string;
  grade: string;
  minScore: number;
  maxScore: number;
  gradePoint: number;
  classification: string;
  description: string;
}

export interface InstitutionalSettings {
  name: string;
  shortName: string;
  code: string;
  institutionCode?: string;
  motto: string;
  logoUrl: string;
  crestType: 'classic' | 'modern' | 'shield' | 'university' | 'tech';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateCountry: string;
  postalCode: string;
  phone: string;
  altPhone?: string;
  email: string;
  admissionEmail?: string;
  bursaryEmail?: string;
  website: string;
  accreditationBody: string;
  charterNumber: string;
  establishedYear: string | number;
  // Extended institutional identity & governance details
  category?: string;
  institutionCategory?: string;
  tvetaLicenseNumber?: string;
  knecCenterNumber?: string;
  kraPinNumber?: string;
  missionStatement?: string;
  visionStatement?: string;
  coreValues?: string[];
  viceChancellorName: string;
  viceChancellorTitle: string;
  deputyPrincipalAcademics?: string;
  deputyPrincipalAdmin?: string;
  deanOfStudents?: string;
  registrarName: string;
  registrarTitle: string;
  registrarSignatureUrl: string;
  bursarName: string;
  bursarTitle: string;
  bursarSignatureUrl: string;
  officialSealUrl: string;
  letterheadHeaderStyle: LetterheadHeaderStyle;
  watermarkOpacity: number;
  footerLegalText: string;
  securityVerificationUrl: string;
  enableQrValidation: boolean;
  enableDigitalSignatures: boolean;
  enableEmbossedSeal: boolean;
  // Dynamic collections with full CRUD operations
  campuses?: CampusBranch[];
  departments?: AcademicDepartment[];
  academicTerms?: AcademicTermSession[];
  paymentAccounts?: SchoolPaymentAccount[];
  gradeScales?: InstitutionalGradeScale[];
}

export type InstitutionalDocType = 
  | 'OFFICIAL_TRANSCRIPT'
  | 'ADMISSION_OFFER'
  | 'PAYMENT_RECEIPT'
  | 'FEE_INVOICE'
  | 'EXAM_BROADSHEET'
  | 'CLEARANCE_CERTIFICATE'
  | 'STAFF_APPOINTMENT'
  | 'BONAFIDE_CERTIFICATE'
  | 'TRANSCRIPT'
  | 'RECEIPT'
  | 'ADMISSION_LETTER'
  | 'BROADSHEET'
  | 'COURSE_REGISTRATION'
  | 'STUDENT_ATTESTATION'
  | 'COURSE_REGISTRATION_SLIP'
  | 'CUSTOM_REPORT';

export interface InstitutionalDocPayload {
  docType?: InstitutionalDocType | string;
  title: string;
  subtitle?: string;
  subTitle?: string;
  docNumber?: string;
  documentNumber?: string;
  issueDate?: string;
  date?: string;
  recipientName: string;
  recipientId?: string;
  recipientIdentifier?: string;
  recipientEmail?: string;
  recipientDepartment?: string;
  recipientDept?: string;
  recipientFaculty?: string;
  recipientProgram?: string;
  recipientLevel?: string;
  session?: string;
  academicSession?: string;
  issuingAuthority?: string;
  contentBody?: string;
  bodyParagraphs?: string[];
  docVerificationCode?: string;
  verificationHash?: string;
  status?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  metadata?: Record<string, any>;
  tableData?: {
    headers: string[];
    rows: (string | number | undefined | null)[][];
    summaryRow?: (string | number | undefined | null)[];
  };
  data?: Record<string, any>;
  customNotes?: string;
}

// -------------------------------------------------------------
// KENYAN TVET & COLLEGE DOMAIN EXTENSIONS
// -------------------------------------------------------------

export type KenyanQualificationLevel =
  | 'ARTISAN'
  | 'CRAFT_CERTIFICATE'
  | 'CERTIFICATE'
  | 'DIPLOMA'
  | 'HIGHER_DIPLOMA'
  | 'SHORT_COURSE';

export type KenyanExaminingBody =
  | 'KNEC'
  | 'TVET_CDACC'
  | 'NITA'
  | 'KASNEB'
  | 'COLLEGE_BOARD'
  | 'INTERNAL';

export type KenyanAcademicTermOrSemester =
  | 'TERM_1'
  | 'TERM_2'
  | 'TERM_3'
  | 'SEMESTER_1'
  | 'SEMESTER_2'
  | 'TRIMESTER_1'
  | 'TRIMESTER_2'
  | 'TRIMESTER_3';

export type StudentFundingCategory =
  | 'SELF_SPONSORED'
  | 'KUCCPS_GOVERNMENT'
  | 'HELB_LOAN'
  | 'COUNTY_BURSARY'
  | 'NG_CDF_BURSARY'
  | 'CORPORATE_SCHOLARSHIP'
  | 'INSTITUTIONAL_WORKSTUDY';

// Public Landing Website Models
export interface PublicProgrammeItem {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  departmentName: string;
  facultyName: string;
  qualificationLevel: KenyanQualificationLevel;
  examiningBody: KenyanExaminingBody;
  durationMonths: number;
  durationTerms: number;
  studyMode: 'FULL_TIME' | 'PART_TIME' | 'WEEKEND' | 'EVENING' | 'DISTANCE_ODEL';
  campus: string;
  intakes: ('JANUARY' | 'MAY' | 'SEPTEMBER')[];
  minimumRequirements: string;
  kcseRequirement: string;
  tuitionFeePerTerm: number;
  totalEstimatedFee: number;
  careerOutcomes: string[];
  accreditation: string;
  featured?: boolean;
}

export interface PublicNewsItem {
  id: string;
  title: string;
  category: 'ANNOUNCEMENT' | 'INTAKE_ALERT' | 'EXAMINATION_NOTICE' | 'EVENT' | 'TENDER' | 'GRADUATION';
  summary: string;
  content: string;
  publishedDate: string;
  author: string;
  imageUrl?: string;
  featured?: boolean;
  downloadUrl?: string;
}

export interface PublicDownloadItem {
  id: string;
  title: string;
  category: 'PROSPECTUS' | 'FEE_STRUCTURE' | 'APPLICATION_FORM' | 'ACADEMIC_CALENDAR' | 'STUDENT_HANDBOOK' | 'ATTACHMENT_GUIDELINES';
  fileFormat: 'PDF' | 'DOCX';
  fileSize: string;
  url: string;
  updatedDate: string;
  targetAudience: 'PUBLIC' | 'APPLICANTS' | 'STUDENTS' | 'TRAINERS';
}

// Online Application & Applicant Portal Models
export interface KcseSubjectGrade {
  subject: string;
  grade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'E';
  points: number;
}

export interface ApplicantMasterRecord {
  id: string;
  applicationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  nationalIdOrBirthCert?: string;
  nationalIdNumber?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  county?: string;
  subCounty?: string;
  postalAddress?: string;
  appliedDate?: string;
  
  // Academic Background
  previousSchool?: string;
  kcseIndexNumber?: string;
  kcseYear?: number;
  kcseMeanGrade?: string;
  kcseSubjectGrades?: KcseSubjectGrade[];
  
  // Programme Selection
  primaryProgrammeId?: string;
  primaryProgrammeName?: string;
  programmeId?: string;
  programmeCode?: string;
  programmeName?: string;
  qualificationLevel?: KenyanQualificationLevel;
  examiningBody?: KenyanExaminingBody;
  intakePeriod?: string;
  campus?: string;
  alternativeProgrammeId?: string;
  alternativeProgrammeName?: string;
  preferredIntake?: 'JANUARY' | 'MAY' | 'SEPTEMBER';
  preferredCampus?: string;
  studyMode?: 'FULL_TIME' | 'PART_TIME' | 'WEEKEND' | 'EVENING' | 'DISTANCE_ODEL';
  fundingSource?: StudentFundingCategory;
  kuccpsAdmissionNumber?: string;
  
  // Guardian / Emergency Contact
  guardianName?: string;
  guardianPhone?: string;
  guardianRelationship?: string;
  guardianEmail?: string;
  
  // Uploaded Verification Documents
  documents?: {
    id: string;
    category: 'KCSE_CERTIFICATE' | 'BIRTH_CERTIFICATE' | 'NATIONAL_ID' | 'PASSPORT_PHOTO' | 'LEAVING_CERTIFICATE';
    fileName: string;
    fileSize: string;
    uploadedAt: string;
    status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'FLAGGED_INVALID';
  }[];

  // Application Fee
  applicationFeeAmount?: number;
  applicationFeeStatus?: 'PENDING' | 'VERIFIED' | 'WAIVED';
  applicationFeePaid?: boolean;
  mpesaReference?: string;
  mpesaReceiptNumber?: string;
  paymentDate?: string;
  kcseResultSlipUrl?: string;
  nationalIdUrl?: string;
  passportPhotoUrl?: string;

  // Review & Decision Lifecycle
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'DOCS_CORRECTION_REQUESTED' | 'OFFERED' | 'OFFER_ACCEPTED' | 'ADMISSION_PROVISIONED' | 'ADMITTED' | 'REJECTED';
  admissionOfferDate?: string;
  offerDeadlineDate?: string;
  allocatedAdmissionNumber?: string;
  reviewerRemarks?: string;
  reviewedBy?: string;
  joiningInstructionsUrl?: string;
  admissionLetterUrl?: string;
}

// Single Source of Truth Student Master Record
export interface StudentMasterRecord {
  id: string;
  admissionNumber: string;
  fullName: string;
  photoUrl?: string;
  nationalIdOrBirthCert?: string;
  nationalIdNumber?: string;
  kcseIndexNumber?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  phone: string;
  email: string;
  county?: string;
  subCounty?: string;
  postalAddress?: string;

  // Academic Affiliation
  programmeId: string;
  programmeCode?: string;
  programmeName: string;
  qualificationLevel: KenyanQualificationLevel;
  examiningBody: KenyanExaminingBody;
  departmentId: string;
  departmentName: string;
  campusId?: string;
  campusName?: string;
  studyMode?: 'FULL_TIME' | 'PART_TIME' | 'WEEKEND' | 'DISTANCE_ODEL';
  intakeCohort?: string;
  intakePeriod?: string;
  cohortYear?: string;
  admissionDate?: string;
  dateAdmitted?: string;

  // Status & Lifecycle Tracking
  academicStatus: 'ADMITTED' | 'ACTIVE' | 'DEFERRED' | 'ACADEMIC_LEAVE' | 'ON_ATTACHMENT' | 'ATTACHMENT' | 'SUSPENDED' | 'COMPLETED' | 'GRADUATED' | 'DISCONTINUED';
  currentAcademicYear?: string;
  currentTermOrSemester?: KenyanAcademicTermOrSemester;
  currentTerm?: number;
  totalTerms?: number;
  totalTermsCompleted?: number;
  totalTermsRequired?: number;
  feeBalance?: number;
  industrialAttachmentCompleted?: boolean;

  // Guardian Details
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;

  // Sponsorship & Funding
  fundingCategory?: StudentFundingCategory;
  sponsorName?: string;
  helbAccountNumber?: string;

  // Audit Status History
  statusHistory?: {
    status: string;
    effectiveDate: string;
    reason: string;
    authorizedBy: string;
  }[];
}

// Transactional Student Ledger & M-Pesa Integration
export interface StudentTransactionLedgerEntry {
  id: string;
  studentId: string;
  admissionNumber: string;
  timestamp: string;
  entryType: 'OPENING_BALANCE' | 'INVOICE_CHARGE' | 'PAYMENT_MPESA' | 'PAYMENT_BANK' | 'HELB_DISBURSEMENT' | 'COUNTY_BURSARY' | 'CDF_BURSARY' | 'DISCOUNT' | 'CREDIT_NOTE' | 'REVERSAL_ADJUSTMENT';
  referenceNumber: string;
  description: string;
  termOrSemester: KenyanAcademicTermOrSemester;
  academicYear: string;
  debitAmount: number;
  creditAmount: number;
  runningBalance: number;
  etimsInvoiceNumber?: string;
  reconciledBy?: string;
  isReversed?: boolean;
  reversalReason?: string;
}

export interface MpesaPaymentTransaction {
  id: string;
  mpesaReceiptNumber: string;
  transactionAmount: number;
  payerPhoneNumber: string;
  billRefNumber: string;
  transactionTimestamp: string;
  channel: 'PAYBILL_247247' | 'TILL_NUMBER' | 'STK_PUSH_EXPRESS';
  status: 'QUEUED_VERIFICATION' | 'RECONCILED_MATCHED' | 'UNMATCHED_ACCOUNT' | 'DUPLICATE_FLAGGED' | 'REVERSED';
  matchedStudentId?: string;
  matchedAdmissionNumber?: string;
  matchedStudentName?: string;
  allocatedLedgerEntryId?: string;
  processedBy?: string;
  notes?: string;
}

// HOD & Academic Department Models
export interface DepartmentCurriculum {
  id: string;
  departmentId: string;
  departmentName: string;
  programmeId: string;
  programmeCode?: string;
  programmeName: string;
  qualificationLevel: KenyanQualificationLevel;
  curriculumVersion: string;
  examiningBody: KenyanExaminingBody;
  totalTerms: number;
  totalCreditsOrUnits?: number;
  units: {
    id?: string;
    unitCode?: string;
    unitTitle?: string;
    code?: string;
    title?: string;
    theoryHours?: number;
    practicalHours?: number;
    termNumber: number;
    isCore?: boolean;
    isPractical?: boolean;
    hoursPerWeek?: number;
    weeklyHours?: number;
    examiningBody?: string;
    prerequisites?: string[];
  }[];
  activeStudentsEnrolled?: number;
}

export interface LecturerUnitAllocation {
  id: string;
  academicYear: string;
  termOrSemester?: KenyanAcademicTermOrSemester;
  term?: string;
  unitCode: string;
  unitTitle?: string;
  unitName?: string;
  departmentId: string;
  lecturerId: string;
  lecturerName: string;
  weeklyContactHours?: number;
  weeklyHours?: number;
  assignedClassCohorts?: string[];
  roomVenue?: string;
  hodApproved?: boolean;
  assignedByHodId?: string;
  assignedAt?: string;
  status?: 'ALLOCATED' | 'ACCEPTED' | 'OVERLOAD_FLAGGED';
}

// Industrial Attachment & Career Services Models
export interface AttachmentPlacement {
  id: string;
  studentId?: string;
  admissionNumber: string;
  studentName: string;
  programmeName: string;
  departmentName?: string;
  companyName: string;
  companyLocation?: string;
  companyTown?: string;
  industrySupervisorName: string;
  industrySupervisorPhone?: string;
  industrySupervisorEmail?: string;
  facultyAssessorName?: string;
  
  startDate: string;
  endDate: string;
  durationWeeks?: number;
  totalWeeks?: number;
  verifiedWeeks?: number;
  assessorScore?: number;
  
  collegeVisitingSupervisorId?: string;
  collegeVisitingSupervisorName?: string;
  assessmentVisitDate?: string;
  supervisorScore?: number;
  logbookWeeksVerified?: number;
  totalRequiredWeeks?: number;
  
  status: 'PLACEMENT_PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'ASSESSED' | 'COMPLETED' | 'LOGBOOK_PENDING' | 'PLACED';
  logbookEntriesCount?: number;
  clearanceGranted?: boolean;
}

// Multi-Department Clearance Models
export interface DepartmentalClearanceSignoff {
  department: 'LIBRARY' | 'DEPARTMENT_WORKSHOP' | 'HOSTEL' | 'FINANCE' | 'REGISTRAR';
  officerName: string;
  officerRole: string;
  status: 'PENDING' | 'CLEARED' | 'OUTSTANDING_OBLIGATION' | 'EXEMPTED';
  obligationDetails?: string;
  feeOrItemDue?: number;
  signedAt?: string;
  remarks?: string;
}

export interface StudentClearanceRecord {
  id: string;
  studentId: string;
  admissionNumber: string;
  studentName: string;
  programmeName: string;
  departmentName: string;
  clearanceReason: 'GRADUATION' | 'COMPLETION' | 'TRANSFER' | 'WITHDRAWAL' | 'DEFERRAL';
  initiatedDate: string;
  targetCompletionDate: string;
  overallStatus: 'IN_PROGRESS' | 'COMPLETED_CLEARED' | 'BLOCKED';
  signoffs: DepartmentalClearanceSignoff[];
  finalCertificateIssued: boolean;
  finalClearedBy?: string;
  clearedDate?: string;
}

// Procurement & Stores Models
export interface ProcurementRequisition {
  id: string;
  requisitionNumber: string;
  departmentId: string;
  departmentName: string;
  requestedBy?: string;
  requestedDate?: string;
  requisitionerId?: string;
  requisitionerName?: string;
  title?: string;
  createdAt?: string;
  hodApprovalStatus?: string;
  items: {
    id?: string;
    itemName: string;
    category?: 'WORKSHOP_TOOLS' | 'LAB_CHEMICALS' | 'STATIONERY' | 'ICT_HARDWARE' | 'MAINTENANCE_PARTS';
    specification?: string;
    quantity?: number;
    quantityRequested?: number;
    unitOfMeasure?: string;
    estimatedUnitCost?: number;
    estimatedUnitPrice?: number;
    totalPrice?: number;
    purpose?: string;
  }[];
  totalEstimatedCost: number;
  status: 'DRAFT' | 'SUBMITTED' | 'HOD_RECOMMENDED' | 'PRINCIPAL_APPROVED' | 'PO_ISSUED' | 'APPROVED_PROCUREMENT' | 'GOODS_RECEIVED' | 'DELIVERED' | 'REJECTED' | 'APPROVED';
  poNumber?: string;
  grnNumber?: string;
  approverRemarks?: string;
}

export interface StoreInventoryItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: 'WORKSHOP_TOOLS' | 'LAB_SUPPLIES' | 'STATIONERY' | 'EQUIPMENT' | 'CLEANING' | 'ICT_HARDWARE' | 'LAB_CHEMICALS' | 'MAINTENANCE_PARTS' | 'ELECTRICAL' | 'CONSUMABLES' | string;
  unitOfMeasure: string;
  quantityInStock: number;
  reorderLevel: number;
  unitCost: number;
  storeLocation: string;
  lastRestockedDate?: string;
  status?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}



