'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalDataLifecycleManager } from '@/components/common/PortalDataLifecycleManager';
import {
  LecturerCourseFull,
  LecturerAssignmentItem,
  LecturerAssignmentSubmission,
  LecturerAttendanceSession,
  LecturerGradingRubric,
  QuestionBankItem,
  LecturerOnlineTest,
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
import {
  MOCK_LECTURER_COURSES,
  MOCK_ATTENDANCE_SESSIONS,
  MOCK_GRADING_RUBRICS,
  MOCK_QUESTION_BANKS,
  MOCK_GRADE_CHANGE_REQUESTS,
  MOCK_ADVISING_RECORDS,
  MOCK_STUDENT_REFERRALS,
  MOCK_SUPERVISION_PROJECTS,
  MOCK_RESEARCH_PUBLICATIONS,
  MOCK_LECTURER_TASKS,
  MOCK_LECTURER_MEETINGS,
  MOCK_LECTURER_WORKLOAD,
  MOCK_LECTURER_REQUESTS
} from '@/lib/mock-data';
import {
  GraduationCap,
  BookOpenCheck,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  MessageSquare,
  Search,
  Plus,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  Users,
  QrCode,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Upload,
  UserCheck,
  HelpCircle,
  Send,
  RefreshCw,
  FolderOpen,
  Sparkles,
  BarChart3,
  ExternalLink,
  Lock,
  FileCheck2,
  ListTodo
} from 'lucide-react';

export function LecturerPortalView() {
  const {
    currentUser,
    activeNavTab,
    setActiveNavTab,
    logAction,
    navigateToPortal,
    publishCrossPortalEvent
  } = useERP();

  // Primary Domain State
  const [courses, setCourses] = useState<LecturerCourseFull[]>(MOCK_LECTURER_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('crs_csc301');
  const [attendanceSessions, setAttendanceSessions] = useState<LecturerAttendanceSession[]>(MOCK_ATTENDANCE_SESSIONS);
  const [rubrics, setRubrics] = useState<LecturerGradingRubric[]>(MOCK_GRADING_RUBRICS);
  const [questionBanks, setQuestionBanks] = useState<QuestionBankItem[]>(MOCK_QUESTION_BANKS);
  const [gradeChangeRequests, setGradeChangeRequests] = useState<GradeChangeRequest[]>(MOCK_GRADE_CHANGE_REQUESTS);
  const [advisingRecords, setAdvisingRecords] = useState<AcademicAdvisingRecord[]>(MOCK_ADVISING_RECORDS);
  const [referrals, setReferrals] = useState<StudentReferralItem[]>(MOCK_STUDENT_REFERRALS);
  const [supervisionProjects, setSupervisionProjects] = useState<SupervisionProject[]>(MOCK_SUPERVISION_PROJECTS);
  const [publications] = useState<ResearchPublicationItem[]>(MOCK_RESEARCH_PUBLICATIONS);
  const [tasks, setTasks] = useState<LecturerTaskItem[]>(MOCK_LECTURER_TASKS);
  const [meetings] = useState<LecturerMeetingSchedule[]>(MOCK_LECTURER_MEETINGS);
  const [workload] = useState<LecturerWorkloadStats>(MOCK_LECTURER_WORKLOAD);
  const [requests, setRequests] = useState<LecturerResourceRequest[]>(MOCK_LECTURER_REQUESTS);

  // Active selected entities for drilldown / modal states
  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const [activeAttendanceSession, setActiveAttendanceSession] = useState<LecturerAttendanceSession | null>(attendanceSessions[0]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('asg_csc301_01');
  const [activeSubmission, setActiveSubmission] = useState<LecturerAssignmentSubmission | null>(
    activeCourse.assignments[0]?.submissions[0] || null
  );

  // New item modal form states
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [newSessionTopic, setNewSessionTopic] = useState('');
  const [newSessionVenue, setNewSessionVenue] = useState('Lecture Theatre 3 (LT-3)');
  
  // Grade change form state
  const [isGradeChangeModalOpen, setIsGradeChangeModalOpen] = useState(false);
  const [gcrStudentId, setGcrStudentId] = useState('usr_david_okafor');
  const [gcrComponent, setGcrComponent] = useState('Assignment 1');
  const [gcrOldScore, setGcrOldScore] = useState(8);
  const [gcrNewScore, setGcrNewScore] = useState(14);
  const [gcrReason, setGcrReason] = useState('');

  // New Referral form state
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [refStudentId, setRefStudentId] = useState('usr_emmanuel_eze');
  const [refDept, setRefDept] = useState<StudentReferralItem['targetDepartment']>('ACADEMIC_SUPPORT');
  const [refReason, setRefReason] = useState<StudentReferralItem['reasonCategory']>('ACADEMIC_DIFFICULTY');
  const [refDesc, setRefDesc] = useState('');

  // Toast feedback
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  const handleStartQRSession = () => {
    const code = `${activeCourse.code}-LIVE-${Math.floor(10000 + Math.random() * 90000)}`;
    const newSes: LecturerAttendanceSession = {
      id: `att_ses_${Date.now()}`,
      courseCode: activeCourse.code,
      courseTitle: activeCourse.title,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '09:00 - 11:00 AM',
      venue: newSessionVenue || 'Lecture Theatre 3 (LT-3)',
      groupName: 'Lecture Section A',
      topic: newSessionTopic || 'Lecture Session Topic',
      mode: 'QR_ACTIVE',
      qrSessionCode: code,
      qrExpiresAt: '2026-08-24 18:00',
      totalEnrolled: activeCourse.enrolledStudentsCount,
      presentCount: 0,
      absentCount: activeCourse.enrolledStudentsCount,
      lateCount: 0,
      excusedCount: 0,
      attendanceRate: 0,
      records: activeCourse.studentsRoster.map(s => ({
        studentId: s.studentId,
        matricNumber: s.matricNumber,
        studentName: s.name,
        status: 'ABSENT'
      }))
    };
    setAttendanceSessions(prev => [newSes, ...prev]);
    setActiveAttendanceSession(newSes);
    setIsNewSessionModalOpen(false);
    setNewSessionTopic('');
    logAction('LECTURER', 'START_QR_SESSION', activeCourse.code, 'GRANTED', `Initiated live QR attendance session ${code}`);
    showFeedback(`Live QR Code generated! Session ${code} active for student scans.`);
  };

  const handleManualAttendanceToggle = (sessionId: string, studentId: string, newStatus: 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED') => {
    setAttendanceSessions(prev =>
      prev.map(ses => {
        if (ses.id !== sessionId) return ses;
        const updatedRecords = ses.records.map(rec => {
          if (rec.studentId !== studentId) return rec;
          return {
            ...rec,
            status: newStatus,
            checkInMethod: 'MANUAL_LECTURER' as const,
            checkInTime: newStatus === 'PRESENT' || newStatus === 'LATE' ? '09:15 AM' : undefined
          };
        });
        const presentCount = updatedRecords.filter(r => r.status === 'PRESENT').length;
        const lateCount = updatedRecords.filter(r => r.status === 'LATE').length;
        const excusedCount = updatedRecords.filter(r => r.status === 'EXCUSED').length;
        const absentCount = updatedRecords.filter(r => r.status === 'ABSENT').length;
        const effectivePresent = presentCount + (lateCount * 0.5);
        const rate = Number(((effectivePresent / (updatedRecords.length || 1)) * 100).toFixed(1));

        const updatedSession = {
          ...ses,
          records: updatedRecords,
          presentCount,
          lateCount,
          excusedCount,
          absentCount,
          attendanceRate: rate
        };

        if (activeAttendanceSession?.id === sessionId) {
          setActiveAttendanceSession(updatedSession);
        }
        return updatedSession;
      })
    );
    showFeedback(`Attendance updated for student: Marked as ${newStatus}.`);
  };

  const handleGradeSubmission = (asgId: string, subId: string, score: number, feedback: string) => {
    setCourses(prev =>
      prev.map(crs => {
        if (crs.id !== selectedCourseId) return crs;
        return {
          ...crs,
          assignments: crs.assignments.map(asg => {
            if (asg.id !== asgId) return asg;
            return {
              ...asg,
              submissions: asg.submissions.map(sub => {
                if (sub.id !== subId) return sub;
                const percentage = Math.round((score / sub.maxPoints) * 100);
                const letter = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : 'F';
                return {
                  ...sub,
                  status: 'GRADED',
                  score,
                  percentageScore: percentage,
                  letterGrade: letter,
                  feedbackNotes: feedback,
                  gradedBy: currentUser.name,
                  gradedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
                };
              })
            };
          })
        };
      })
    );
    logAction('LECTURER', 'GRADE_ASSIGNMENT', asgId, 'GRANTED', `Evaluated submission ${subId} with score ${score}`);
    showFeedback(`Submission evaluated and grade released to student portal.`);
  };

  const handleGradebookScoreChange = (studentId: string, field: 'assignment1' | 'assignment2' | 'catScore' | 'projectScore' | 'examScore', val: number) => {
    setCourses(prev =>
      prev.map(crs => {
        if (crs.id !== selectedCourseId) return crs;
        return {
          ...crs,
          gradebook: crs.gradebook.map(entry => {
            if (entry.studentId !== studentId) return entry;
            const updated = { ...entry, [field]: val };
            const caTotal = (updated.attendanceScore || 0) + (updated.assignment1 || 0) + (updated.assignment2 || 0) + (updated.catScore || 0) + (updated.projectScore || 0);
            const total = caTotal + (updated.examScore || 0);
            const letter = total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B+' : total >= 60 ? 'B' : total >= 50 ? 'C' : total >= 45 ? 'D' : 'F';
            const gp = total >= 80 ? 4.0 : total >= 70 ? 3.5 : total >= 60 ? 3.0 : total >= 50 ? 2.0 : total >= 45 ? 1.0 : 0.0;
            return {
              ...updated,
              continuousAssessmentTotal: caTotal,
              totalWeightedScore: total,
              letterGrade: letter,
              gradePoint: gp
            };
          })
        };
      })
    );
  };

  const handleSubmitGradeChangeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const student = activeCourse.studentsRoster.find(s => s.studentId === gcrStudentId);
    const newGcr: GradeChangeRequest = {
      id: `gcr_${Date.now()}`,
      studentId: gcrStudentId,
      studentName: student?.name || 'Student',
      matricNumber: student?.matricNumber || 'STU-2026',
      courseCode: activeCourse.code,
      courseTitle: activeCourse.title,
      componentName: gcrComponent,
      oldScore: gcrOldScore,
      newScore: gcrNewScore,
      oldGrade: 'B+',
      newGrade: 'A',
      reason: gcrReason,
      supportingDocName: 'Lecturer_Score_Recalculation_Sheet.pdf',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      submittedBy: currentUser.name,
      status: 'PENDING_HOD',
      reviewedBy: 'Prof. Tunde Adeyemi (HoD)'
    };
    setGradeChangeRequests(prev => [newGcr, ...prev]);
    setIsGradeChangeModalOpen(false);
    setGcrReason('');
    logAction('LECTURER', 'SUBMIT_GRADE_CHANGE', activeCourse.code, 'GRANTED', `Submitted score change request for ${student?.name}`);
    showFeedback(`Grade change petition forwarded to Head of Department for endorsement.`);
  };

  const handleSubmitReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const student = activeCourse.studentsRoster.find(s => s.studentId === refStudentId);
    const newRef: StudentReferralItem = {
      id: `ref_${Date.now()}`,
      studentId: refStudentId,
      studentName: student?.name || 'Student',
      matricNumber: student?.matricNumber || 'STU-2026',
      targetDepartment: refDept,
      reasonCategory: refReason,
      severity: 'HIGH',
      description: refDesc,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      referredBy: currentUser.name,
      status: 'DISPATCHED'
    };
    setReferrals(prev => [newRef, ...prev]);
    setIsReferralModalOpen(false);
    setRefDesc('');
    logAction('LECTURER', 'STUDENT_REFERRAL', refStudentId, 'GRANTED', `Dispatched referral to ${refDept}`);
    showFeedback(`Advisee referral dispatched to ${refDept}. Early warning flag updated.`);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleLockGradebookAndSubmit = () => {
    setCourses(prev =>
      prev.map(crs => (crs.id === selectedCourseId ? { ...crs, gradebookLockStatus: 'SUBMITTED' } : crs))
    );
    publishCrossPortalEvent(
      'LECTURER_MARKS_SUBMITTED_TO_EXAM_BOARD',
      'LECTURER',
      ['EXAMINATIONS', 'ADMIN'],
      { courseCode: activeCourse.code, lecturer: currentUser.name, totalStudents: activeCourse.studentsRoster.length },
      `Lecturer ${currentUser.name} officially submitted grades for ${activeCourse.code} to Examination Moderation Board.`
    );
    logAction('LECTURER', 'SUBMIT_MARKS_EXAM_BOARD', activeCourse.code, 'GRANTED', 'Gradebook submitted for moderation');
    showFeedback(`Gradebook for ${activeCourse.code} locked and transmitted to Exam Board workflow!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast feedback */}
      {actionFeedback && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-slate-900 border border-blue-500 shadow-2xl text-blue-300 text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. LECTURER DASHBOARD TAB */}
      {/* ------------------------------------------------------------- */}
      {(activeNavTab === 'dashboard' || !activeNavTab) && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Faculty Academic Portal
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentUser.department} • {currentUser.institution}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Welcome back, {currentUser.name}
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl">
                Manage your course syllabi, launch live QR attendance sessions, evaluate assignment submissions, moderate semester gradebooks, and mentor academic advisees.
              </p>
            </div>

            {/* Quick Action Hub */}
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  setActiveNavTab('attendance');
                  setIsNewSessionModalOpen(true);
                }}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-950/50 transition"
              >
                <QrCode className="w-4 h-4" />
                <span>Launch QR Attendance</span>
              </button>
              <button
                onClick={() => setActiveNavTab('gradebook')}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/50 transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Open Gradebook</span>
              </button>
            </div>
          </div>

          {/* Key Faculty Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>ASSIGNED COURSES</span>
                <BookOpenCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{courses.length} Active</div>
              <span className="text-[11px] text-slate-400">{workload.weeklyContactHours} contact hrs/week</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>TOTAL STUDENTS</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{workload.totalStudentsTaught}</div>
              <span className="text-[11px] text-emerald-400">91.4% avg class attendance</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>PENDING GRADING</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">6 Submissions</div>
              <span className="text-[11px] text-slate-400">CSC301 Assignment 1</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>AT-RISK ADVISEES</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-400 font-mono">2 Students</div>
              <span className="text-[11px] text-rose-400">Attendance &lt; 75% alerts</span>
            </div>
          </div>

          {/* Main Dashboard Grid: Assigned Courses & Active Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Courses Overview List (Left 2 Cols) */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpenCheck className="w-4 h-4 text-blue-400" />
                    My Assigned Teaching Modules ({courses.length})
                  </h2>
                  <p className="text-xs text-slate-400">First Semester 2026/2027 Academic Session</p>
                </div>
                <button
                  onClick={() => setActiveNavTab('courses')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                >
                  Manage Courses <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {courses.map(crs => (
                  <div
                    key={crs.id}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      selectedCourseId === crs.id
                        ? 'bg-slate-850 border-blue-500/60 ring-1 ring-blue-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                    onClick={() => setSelectedCourseId(crs.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-bold text-xs border border-blue-500/20">
                          {crs.code}
                        </span>
                        <h3 className="font-bold text-white text-sm">{crs.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">{crs.level}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {crs.creditUnits} Units
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-mono">Enrolled Roster</span>
                        <span className="text-slate-200 font-bold font-mono">{crs.enrolledStudentsCount} Students</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-mono">Avg Attendance</span>
                        <span className="text-emerald-400 font-bold font-mono">{crs.averageAttendancePct}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-mono">Gradebook Status</span>
                        <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                          crs.gradebookLockStatus === 'SUBMITTED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {crs.gradebookLockStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourseId(crs.id);
                            setActiveNavTab('gradebook');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold transition"
                        >
                          Gradebook →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Pending Tasks & Schedule */}
            <div className="space-y-6">
              
              {/* Task Checklist */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-amber-400" />
                    Action Checklist
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {tasks.filter(t => t.completed).length}/{tasks.length} Done
                  </span>
                </div>

                <div className="space-y-2">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                        task.completed
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-60 text-slate-500'
                          : 'bg-slate-850 border-slate-700/70 text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="mt-0.5 rounded bg-slate-800 border-slate-600 text-blue-600 focus:ring-0"
                      />
                      <div className="flex-1 space-y-0.5">
                        <span className={task.completed ? 'line-through' : 'font-medium'}>{task.title}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <span>Due: {task.dueDate}</span>
                          {task.courseCode && <span className="text-blue-400">{task.courseCode}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Academic Meetings */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Upcoming Board Meetings
                </h3>
                <div className="space-y-2.5">
                  {meetings.map(m => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-850 border border-slate-700/60 space-y-1 text-xs">
                      <span className="font-bold text-white block">{m.title}</span>
                      <div className="text-[11px] text-slate-300 flex items-center gap-2 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{m.date} • {m.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{m.venue}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. COURSES & SYLLABI TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'data_lifecycle' && (
        <PortalDataLifecycleManager
          portalId="LECTURER"
          allowedEntityTypes={['COURSE', 'ASSIGNMENT', 'QUESTION_BANK', 'RESEARCH_PROJECT']}
          title="Lecturer Course Content & Asset Lifecycle Studio"
          subtitle="Manage drafts, syllabus approvals, CBT question banks, and research project metadata with optimistic concurrency and version control."
        />
      )}

      {activeNavTab === 'courses' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Course Selector Toolbar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase font-mono">Active Course:</span>
              <select
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold text-xs focus:ring-2 focus:ring-blue-500"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Coordinator: <strong className="text-white">{activeCourse.coordinatorName}</strong></span>
            </div>
          </div>

          {/* Syllabus & Course Outline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Syllabus Overview & Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Course Description & Objectives ({activeCourse.code})
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeCourse.syllabus.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono">Target Learning Outcomes</span>
                  <div className="space-y-1.5">
                    {activeCourse.syllabus.learningOutcomes.map((lo, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{lo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono">Assessment Weighting Breakdown</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    {activeCourse.syllabus.gradingBreakdown.map((gb, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-850 border border-slate-700 text-center">
                        <span className="text-slate-400 block text-[10px]">{gb.component}</span>
                        <span className="text-white font-bold text-sm">{gb.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lesson Plans & Weekly Delivery Schedule */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    Weekly Lesson Plans ({activeCourse.lessons.length} Modules)
                  </h3>
                </div>

                <div className="space-y-3">
                  {activeCourse.lessons.map(les => (
                    <div key={les.id} className="p-4 rounded-xl bg-slate-850 border border-slate-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">Week {les.weekNumber}: {les.topic}</span>
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          les.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {les.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                        <span>Scheduled: {les.scheduledDate} ({les.startTime} - {les.endTime})</span>
                        <span>Venue: {les.venue}</span>
                        <span>Mode: {les.deliveryMode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Materials & Resources Upload Hub */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-amber-400" />
                    Course Materials & Uploads
                  </h3>
                </div>

                <div className="space-y-3">
                  {activeCourse.materials.map(mat => (
                    <div key={mat.id} className="p-3.5 rounded-xl bg-slate-850 border border-slate-700 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-white">{mat.title}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-blue-300">
                          v{mat.version}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>{mat.fileSize} • {mat.fileFormat}</span>
                        <span>{mat.downloadCount} Downloads</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. ATTENDANCE & QR SESSIONS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'attendance' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Header Action */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-400" />
                Lecture Attendance & Geofenced QR Check-In Studio
              </h2>
              <p className="text-xs text-slate-400">
                Generate real-time animated QR codes for in-class student verification and manage manual presence overrides.
              </p>
            </div>

            <button
              onClick={() => setIsNewSessionModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-950/40 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Start New In-Class QR Session</span>
            </button>
          </div>

          {/* Active Attendance Session Grid & QR Display */}
          {activeAttendanceSession && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* QR Code Card */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400">
                  {activeAttendanceSession.courseCode} Check-In Code
                </span>

                {/* QR Visual Canvas Mock */}
                <div className="w-48 h-48 rounded-2xl bg-white p-4 flex flex-col items-center justify-center shadow-2xl relative border-4 border-blue-500">
                  <QrCode className="w-36 h-36 text-slate-950" />
                  <span className="text-[9px] font-mono font-black text-slate-900 tracking-widest mt-1">
                    {activeAttendanceSession.qrSessionCode}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">{activeAttendanceSession.topic}</span>
                  <span className="text-xs text-slate-400 font-mono">{activeAttendanceSession.venue} • {activeAttendanceSession.timeSlot}</span>
                </div>

                <div className="w-full pt-2 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-850 border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">PRESENT</span>
                    <span className="text-emerald-400 font-bold text-base">{activeAttendanceSession.presentCount}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-850 border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">LATE</span>
                    <span className="text-amber-400 font-bold text-base">{activeAttendanceSession.lateCount}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-850 border border-slate-700">
                    <span className="text-slate-400 text-[10px] block">ABSENT</span>
                    <span className="text-rose-400 font-bold text-base">{activeAttendanceSession.absentCount}</span>
                  </div>
                </div>
              </div>

              {/* Real-time Student Attendance Verification Roster */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    Session Attendance Roster ({activeAttendanceSession.records.length} Students)
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Class Attendance: {activeAttendanceSession.attendanceRate}%
                  </span>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {activeAttendanceSession.records.map(rec => (
                    <div
                      key={rec.studentId}
                      className="p-3 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{rec.studentName}</span>
                          <span className="font-mono text-[10px] text-slate-400">{rec.matricNumber}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {rec.checkInTime ? `Checked in at ${rec.checkInTime} (${rec.checkInMethod})` : 'No check-in record logged'}
                        </div>
                      </div>

                      {/* Manual Override Radio Buttons */}
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <button
                          onClick={() => handleManualAttendanceToggle(activeAttendanceSession.id, rec.studentId, 'PRESENT')}
                          className={`px-2.5 py-1 rounded font-bold transition ${
                            rec.status === 'PRESENT'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleManualAttendanceToggle(activeAttendanceSession.id, rec.studentId, 'LATE')}
                          className={`px-2.5 py-1 rounded font-bold transition ${
                            rec.status === 'LATE'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleManualAttendanceToggle(activeAttendanceSession.id, rec.studentId, 'EXCUSED')}
                          className={`px-2.5 py-1 rounded font-bold transition ${
                            rec.status === 'EXCUSED'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          Excused
                        </button>
                        <button
                          onClick={() => handleManualAttendanceToggle(activeAttendanceSession.id, rec.studentId, 'ABSENT')}
                          className={`px-2.5 py-1 rounded font-bold transition ${
                            rec.status === 'ABSENT'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. ASSIGNMENTS & RUBRICS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'assignments' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Assignment Header */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-400" />
                Continuous Assessment & Rubric Speed Grader
              </h2>
              <p className="text-xs text-slate-400">
                Grade student programming submissions, verify plagiarism similarity indices, and score against criteria rubrics.
              </p>
            </div>
          </div>

          {/* Submissions & Speed Grader View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Submissions List */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Users className="w-4 h-4 text-blue-400" />
                CSC301 Assignment 1 Submissions
              </h3>

              <div className="space-y-2.5">
                {activeCourse.assignments[0]?.submissions.map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => setActiveSubmission(sub)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                      activeSubmission?.id === sub.id
                        ? 'bg-slate-850 border-blue-500 ring-1 ring-blue-500/30'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{sub.studentName}</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        sub.status === 'GRADED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {sub.status === 'GRADED' ? `${sub.score}/${sub.maxPoints}` : 'Ungraded'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{sub.matricNumber}</span>
                      <span className="text-blue-400">Sim: {sub.similarityScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Speed Grader Pane */}
            {activeSubmission && (
              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{activeSubmission.studentName} ({activeSubmission.matricNumber})</h3>
                    <p className="text-xs text-slate-400 font-mono">Submitted file: {activeSubmission.fileName} ({activeSubmission.fileSize})</p>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                    Plagiarism: {activeSubmission.similarityScore}% Match
                  </span>
                </div>

                {/* Rubric Criteria Evaluation */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono">Rubric Scoring Criteria</span>
                  <div className="space-y-2">
                    {rubrics[0]?.criteria.map(crit => (
                      <div key={crit.id} className="p-3 rounded-xl bg-slate-850 border border-slate-700/70 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{crit.name}</span>
                          <span className="font-mono text-blue-400 font-bold">Max {crit.maxPoints} pts</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{crit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grade & Feedback Entry */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold uppercase text-slate-300 font-mono">Awarded Score (0-100):</label>
                    <input
                      type="number"
                      defaultValue={activeSubmission.score || 90}
                      id="gradeInputScore"
                      className="w-24 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-slate-300 font-mono block mb-1">Qualitative Lecturer Feedback:</label>
                    <textarea
                      rows={3}
                      id="gradeFeedbackNotes"
                      defaultValue={activeSubmission.feedbackNotes || 'Clean code structure and comprehensive benchmark charts.'}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        const score = Number((document.getElementById('gradeInputScore') as HTMLInputElement)?.value || 90);
                        const fb = (document.getElementById('gradeFeedbackNotes') as HTMLTextAreaElement)?.value || '';
                        handleGradeSubmission('asg_csc301_01', activeSubmission.id, score, fb);
                      }}
                      className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
                    >
                      Save & Release Grade to Student Portal
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. CBT TESTS & QUESTION BANK TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'cbt_tests' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  Departmental Question Bank & Online Assessment Engine
                </h2>
                <p className="text-xs text-slate-400">
                  Taxonomy-indexed question bank (MCQ, Multiple Select, Algorithmic Code Trace).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {questionBanks.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-900 text-blue-300 border border-slate-700">
                        {q.topic}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {q.difficulty} • Bloom: {q.bloomTaxonomyLevel}
                      </span>
                    </div>
                    <span className="font-mono text-slate-400 font-bold">{q.points} Points</span>
                  </div>
                  <p className="text-white font-medium">{idx + 1}. {q.questionText}</p>
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-slate-300 font-mono text-[11px]">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="p-2 rounded bg-slate-900 border border-slate-800">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. GRADEBOOK & RESULT SUBMISSION TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'gradebook' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Gradebook Header with Submission Lock Controls */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  {activeCourse.code} Gradebook
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  activeCourse.gradebookLockStatus === 'SUBMITTED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  Status: {activeCourse.gradebookLockStatus}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Semester Marks Entry & Senate Moderation Sheet
              </h2>
              <p className="text-xs text-slate-400">
                Direct marks entry with live weighted total computation, letter grade mapping, and formal grade change petitions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsGradeChangeModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition"
              >
                Grade Change Request
              </button>
              <button
                onClick={handleLockGradebookAndSubmit}
                disabled={activeCourse.gradebookLockStatus === 'SUBMITTED'}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg ${
                  activeCourse.gradebookLockStatus === 'SUBMITTED'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Submit to Exam Board</span>
              </button>
            </div>
          </div>

          {/* Interactive Gradebook Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                    <th className="pb-3 pr-4">Student Name & Matric</th>
                    <th className="pb-3 px-2">Att (10)</th>
                    <th className="pb-3 px-2">Asg 1 (15)</th>
                    <th className="pb-3 px-2">Asg 2 (15)</th>
                    <th className="pb-3 px-2">CAT (20)</th>
                    <th className="pb-3 px-2">Project (10)</th>
                    <th className="pb-3 px-2 text-blue-400 font-bold">CA Total (70)</th>
                    <th className="pb-3 px-2">Exam (30)</th>
                    <th className="pb-3 px-2 text-emerald-400 font-bold">Total (100)</th>
                    <th className="pb-3 px-2">Grade</th>
                    <th className="pb-3 pl-2">GP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {activeCourse.gradebook.map(entry => (
                    <tr key={entry.studentId} className="hover:bg-slate-850/50 transition">
                      <td className="py-3 pr-4">
                        <span className="font-bold text-white block">{entry.studentName}</span>
                        <span className="text-[11px] text-slate-400">{entry.matricNumber}</span>
                      </td>
                      <td className="py-3 px-2 text-slate-300">{entry.attendanceScore}</td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={entry.assignment1}
                          onChange={e => handleGradebookScoreChange(entry.studentId, 'assignment1', Number(e.target.value))}
                          className="w-12 px-1.5 py-1 rounded bg-slate-800 border border-slate-700 text-white text-center"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={entry.assignment2}
                          onChange={e => handleGradebookScoreChange(entry.studentId, 'assignment2', Number(e.target.value))}
                          className="w-12 px-1.5 py-1 rounded bg-slate-800 border border-slate-700 text-white text-center"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={entry.catScore}
                          onChange={e => handleGradebookScoreChange(entry.studentId, 'catScore', Number(e.target.value))}
                          className="w-12 px-1.5 py-1 rounded bg-slate-800 border border-slate-700 text-white text-center"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={entry.projectScore}
                          onChange={e => handleGradebookScoreChange(entry.studentId, 'projectScore', Number(e.target.value))}
                          className="w-12 px-1.5 py-1 rounded bg-slate-800 border border-slate-700 text-white text-center"
                        />
                      </td>
                      <td className="py-3 px-2 font-bold text-blue-400 text-sm">
                        {entry.continuousAssessmentTotal}
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={entry.examScore}
                          onChange={e => handleGradebookScoreChange(entry.studentId, 'examScore', Number(e.target.value))}
                          className="w-12 px-1.5 py-1 rounded bg-slate-800 border border-slate-700 text-white text-center"
                        />
                      </td>
                      <td className="py-3 px-2 font-black text-emerald-400 text-sm">
                        {entry.totalWeightedScore}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          entry.letterGrade === 'A+' || entry.letterGrade === 'A'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : entry.letterGrade === 'F'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {entry.letterGrade}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-slate-300 font-bold">
                        {entry.gradePoint.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Grade Change Petitions */}
          {gradeChangeRequests.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Submitted Grade Change Requests
              </h3>
              <div className="space-y-2">
                {gradeChangeRequests.map(gcr => (
                  <div key={gcr.id} className="p-3.5 rounded-xl bg-slate-850 border border-slate-700 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{gcr.studentName} ({gcr.matricNumber})</span>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-amber-500/20 text-amber-300">
                        {gcr.status}
                      </span>
                    </div>
                    <p className="text-slate-300">{gcr.reason}</p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Adjustment: {gcr.oldScore} ({gcr.oldGrade}) → {gcr.newScore} ({gcr.newGrade}) • Reviewed by: {gcr.reviewedBy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. ADVISING & STUDENT MENTORSHIP TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'advising' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Academic Advising & Early Warning Intervention Hub
              </h2>
              <p className="text-xs text-slate-400">
                Track advisee CGPAs, log consultation sessions, and dispatch referrals to Academic Support or Counselling.
              </p>
            </div>

            <button
              onClick={() => setIsReferralModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Student Referral</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {advisingRecords.map(adv => (
              <div key={adv.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{adv.studentName}</h3>
                    <p className="text-xs text-slate-400 font-mono">{adv.matricNumber} • {adv.programme}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black font-mono text-emerald-400">{adv.cgpa.toFixed(2)} CGPA</span>
                    <span className={`block text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      adv.academicStanding === 'DEAN_LIST'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {adv.academicStanding}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono">Advisory Consultations</span>
                  {adv.consultationLogs.map(log => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-850 border border-slate-700 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Date: {log.date} ({log.mode})</span>
                        <span>Follow-up: {log.followUpDate}</span>
                      </div>
                      <p className="text-slate-200">{log.discussionSummary}</p>
                      <div className="text-[11px] text-blue-300 font-mono">
                        Action Plan: {log.actionPlan}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. SUPERVISION & THESIS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'supervision' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              Final Year Capstone & Postgraduate Thesis Supervision
            </h2>
            <p className="text-xs text-slate-400">
              Track candidate milestones, review submitted dissertation chapters, and record defense readiness.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-2">
              {supervisionProjects.map(proj => (
                <div key={proj.id} className="p-5 rounded-2xl bg-slate-850 border border-slate-700 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
                    <div>
                      <span className="font-bold text-white text-sm">{proj.projectTitle}</span>
                      <p className="text-[11px] text-slate-400">{proj.studentName} ({proj.matricNumber}) • {proj.programme}</p>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                      {proj.currentMilestone} ({proj.progressPercentage}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-mono uppercase block">Next Meeting:</span>
                      <span className="text-slate-200 font-bold">{proj.nextMeetingDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono uppercase block">Next Deliverable:</span>
                      <span className="text-slate-200">{proj.nextDeliverable}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. RESEARCH & PUBLICATIONS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'research' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Faculty Research & Scopus Publications Portfolio
            </h2>

            <div className="space-y-3">
              {publications.map(pub => (
                <div key={pub.id} className="p-5 rounded-xl bg-slate-850 border border-slate-700 space-y-2 text-xs">
                  <span className="font-bold text-white text-sm block">{pub.title}</span>
                  <p className="text-slate-400">{pub.authors.join(', ')} • {pub.journalOrConference} ({pub.publicationDate})</p>
                  <p className="text-slate-300 italic">{pub.abstractText}</p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>DOI: {pub.doi}</span>
                    <span className="text-emerald-400 font-bold">{pub.citationsCount} Citations</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 10. WORKLOAD & REQUISITIONS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'workload' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              Academic Workload Metrics & Resource Requisitions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700">
                <span className="text-slate-400 text-xs block">Weekly Contact Hours</span>
                <span className="text-2xl font-black text-white">{workload.weeklyContactHours} Hours</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700">
                <span className="text-slate-400 text-xs block">Office Consultation Hours</span>
                <span className="text-2xl font-black text-emerald-400">{workload.officeHoursWeekly} Hours</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700">
                <span className="text-slate-400 text-xs block">Supervision Candidates</span>
                <span className="text-2xl font-black text-blue-400">{workload.supervisionCandidates}</span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <h3 className="text-sm font-bold text-white">Departmental Equipment & Exam Requisitions</h3>
              <div className="space-y-2">
                {requests.map(req => (
                  <div key={req.id} className="p-3.5 rounded-xl bg-slate-850 border border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{req.title}</span>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-500/20 text-emerald-400">
                        {req.status}
                      </span>
                    </div>
                    <p className="text-slate-300">{req.justification}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 11. LECTURER MONITOR TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'monitor' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Lecturer Portal Telemetry & Audit Stream
            </h2>
            <p className="text-xs text-slate-400">
              Live audit events generated from lecturer grade releases, attendance check-ins, and syllabus updates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700">
              <span className="text-slate-400 text-xs block">QR Check-in Events</span>
              <span className="text-2xl font-black text-white">124 Today</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700">
              <span className="text-slate-400 text-xs block">Plagiarism Scans</span>
              <span className="text-2xl font-black text-emerald-400">54 Verified</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700">
              <span className="text-slate-400 text-xs block">Exam Moderation Sync</span>
              <span className="text-2xl font-black text-blue-400">100% Online</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: START NEW QR ATTENDANCE SESSION */}
      {/* ------------------------------------------------------------- */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-400" />
              Launch Live QR Attendance Session
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Session Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Self-Balancing AVL Trees Rotation Walkthrough"
                  value={newSessionTopic}
                  onChange={e => setNewSessionTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Lecture Venue / Lab</label>
                <input
                  type="text"
                  value={newSessionVenue}
                  onChange={e => setNewSessionVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewSessionModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleStartQRSession}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Generate Live QR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: SUBMIT GRADE CHANGE PETITION */}
      {/* ------------------------------------------------------------- */}
      {isGradeChangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              Official Grade Change Request (HoD Endorsement)
            </h3>

            <form onSubmit={handleSubmitGradeChangeRequest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Select Student</label>
                <select
                  value={gcrStudentId}
                  onChange={e => setGcrStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                >
                  {activeCourse.studentsRoster.map(s => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.name} ({s.matricNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Old Score</label>
                  <input
                    type="number"
                    value={gcrOldScore}
                    onChange={e => setGcrOldScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">New Score</label>
                  <input
                    type="number"
                    value={gcrNewScore}
                    onChange={e => setGcrNewScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Academic Justification</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify rubric re-evaluation or script recount reason..."
                  value={gcrReason}
                  onChange={e => setGcrReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGradeChangeModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Submit Petition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DISPATCH STUDENT REFERRAL */}
      {/* ------------------------------------------------------------- */}
      {isReferralModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-400" />
              Dispatch Advisee Referral
            </h3>

            <form onSubmit={handleSubmitReferral} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Target Advisee</label>
                <select
                  value={refStudentId}
                  onChange={e => setRefStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                >
                  {activeCourse.studentsRoster.map(s => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.name} ({s.matricNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Destination Service</label>
                <select
                  value={refDept}
                  onChange={e => setRefDept(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="ACADEMIC_SUPPORT">Academic Support & Peer Tutoring</option>
                  <option value="COUNSELLING_CENTER">University Counselling Center</option>
                  <option value="FINANCE_BURSARY">Finance & Hardship Grants</option>
                  <option value="DISABILITY_SERVICES">Accessibility & Disability Services</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Referral Reason / Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain nature of academic or personal difficulty..."
                  value={refDesc}
                  onChange={e => setRefDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReferralModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Dispatch Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
