'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { StudentRequest, AcademicCourse } from '@/types/erp';
import { MOCK_REGISTRATION_COURSES_POOL } from '@/lib/mock-data';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import {
  GraduationCap,
  BookOpenCheck,
  Library,
  Award,
  CreditCard,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  ChevronRight,
  ShieldCheck,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Printer,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function StudentPortalView() {
  const {
    currentUser,
    activeNavTab,
    setActiveNavTab,
    studentProfile,
    studentCourses,
    studentInvoices,
    studentRequests,
    clearanceItems,
    submitStudentRequest,
    payInvoice,
    navigateToPortal,
    logAction,
    publishCrossPortalEvent,
    openInstitutionalDocument
  } = useERP();

  // State for submitting a new student request
  const [reqType, setReqType] = useState<StudentRequest['type']>('OFFICIAL_TRANSCRIPT');
  const [reqSubject, setReqSubject] = useState('');
  const [reqDetails, setReqDetails] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  // State for Academic Registration
  const [registeredCoursesList, setRegisteredCoursesList] = useState<AcademicCourse[]>(MOCK_REGISTRATION_COURSES_POOL);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
  const [regSearch, setRegSearch] = useState('');
  const [regCategoryFilter, setRegCategoryFilter] = useState('ALL');

  // Filter state for timetable
  const [selectedDay, setSelectedDay] = useState<string>('ALL');

  // Filter state for invoices
  const [invoiceSearch, setInvoiceSearch] = useState('');

  const totalRegisteredCredits = registeredCoursesList
    .filter(c => c.status === 'REGISTERED')
    .reduce((sum, c) => sum + c.creditUnits, 0);

  const handleOpenAttestationLetter = () => {
    openInstitutionalDocument({
      title: 'CERTIFICATE OF BONA FIDE STUDENTSHIP & ATTESTATION',
      documentNumber: `ATT-${studentProfile.matricNumber.replace(/[^a-zA-Z0-9]/g, '')}-2026`,
      date: 'August 24, 2026',
      recipientName: currentUser.name,
      recipientId: studentProfile.matricNumber,
      recipientDept: studentProfile.department,
      metadata: {
        'Matriculation Number': studentProfile.matricNumber,
        'Academic Programme': studentProfile.programme,
        'Current Academic Level': `${studentProfile.currentLevel} Level (Undergraduate)`,
        'Current Academic Session': '2026/2027 Academic Session',
        'Academic Standing': 'Active / Good Standing',
        'Cumulative GPA': `${studentProfile.cgpa.toFixed(2)} / 4.00`
      },
      bodyParagraphs: [
        `This is to officially certify that ${currentUser.name.toUpperCase()} with Matriculation Number ${studentProfile.matricNumber} is a bona fide registered full-time student of this institution in the ${studentProfile.department}, pursuing a degree in ${studentProfile.programme}.`,
        `The student is currently enrolled in the ${studentProfile.currentLevel} Level for the 2026/2027 academic year and maintains a commendable academic standing with a Cumulative Grade Point Average (CGPA) of ${studentProfile.cgpa.toFixed(2)} on a 4.00 grading scale.`,
        `All university obligations, multi-departmental clearance requirements, and academic course registrations have been duly fulfilled. This official document is issued upon request for official verification, visa applications, scholarship renewals, or institutional sponsorships.`
      ],
      signatoryTitle: 'Registrar & Secretary to Senate',
      signatoryName: 'Dr. Arthur Vance, Ph.D, FNCS',
      status: 'VERIFIED',
      verificationHash: `APX-ATT-${studentProfile.matricNumber}-77921`
    });
  };

  const handleOpenTranscript = () => {
    openInstitutionalDocument({
      title: 'OFFICIAL ACADEMIC TRANSCRIPT & SENATE GAZETTE',
      documentNumber: `TRX-${studentProfile.matricNumber.replace(/[^a-zA-Z0-9]/g, '')}-2026`,
      date: 'August 24, 2026',
      recipientName: currentUser.name,
      recipientId: studentProfile.matricNumber,
      recipientDept: `${studentProfile.faculty} • ${studentProfile.department}`,
      metadata: {
        'Student Full Name': currentUser.name,
        'Matriculation ID': studentProfile.matricNumber,
        'Faculty / School': studentProfile.faculty,
        'Degree & Major': studentProfile.programme,
        'Cumulative CGPA': `${studentProfile.cgpa.toFixed(2)} / 4.00 (First Class Honours)`,
        'Graduation Status': 'In Progress (Active Good Standing)',
        'Senate Ratification': 'SENATE-RATIFIED-2026-AUG'
      },
      bodyParagraphs: [
        `This official transcript represents the authentic academic record of ${currentUser.name.toUpperCase()} at the institution. All courses, unit weights, continuous assessment scores, and terminal examination grades have been moderated by departmental boards and verified by Senate.`,
        `The student has earned a total of ${studentProfile.totalCreditsEarned} credits towards the minimum degree completion requirement of ${studentProfile.totalCreditsRequired} credit units.`
      ],
      tableData: {
        headers: ['Course Code', 'Course Title', 'Units', 'Score', 'Grade', 'Points', 'Session'],
        rows: [
          ['CSC 301', 'Advanced Algorithms & Complexity', 4, '88.5%', 'A', '4.00', '2026/1'],
          ['CSC 303', 'Operating Systems & Concurrency', 3, '81.0%', 'A-', '3.70', '2026/1'],
          ['CSC 305', 'Database Systems Engineering', 3, '92.0%', 'A+', '4.00', '2026/1'],
          ['MAT 301', 'Discrete Mathematics & Graph Theory', 3, '79.5%', 'B+', '3.30', '2026/1']
        ],
        summaryRow: ['Total Credits Registered: 13', 'Semester GPA: 3.82', '', '', '', 'Cumulative CGPA: 3.85', 'Status: PASSED']
      },
      signatoryTitle: 'Registrar & Secretary to Senate',
      signatoryName: 'Dr. Arthur Vance, Ph.D, FNCS',
      status: 'VERIFIED',
      verificationHash: `APX-TRX-${studentProfile.matricNumber}-99412`
    });
  };

  const handleOpenCourseSlip = () => {
    openInstitutionalDocument({
      title: 'OFFICIAL COURSE REGISTRATION SLIP',
      documentNumber: `CRS-${studentProfile.matricNumber.replace(/[^a-zA-Z0-9]/g, '')}-2026-S1`,
      date: 'August 24, 2026',
      recipientName: currentUser.name,
      recipientId: studentProfile.matricNumber,
      recipientDept: studentProfile.department,
      metadata: {
        'Student Name': currentUser.name,
        'Matric Number': studentProfile.matricNumber,
        'Level / Session': `${studentProfile.currentLevel} Level • 2026/2027 First Semester`,
        'Total Registered Units': `${totalRegisteredCredits} Credit Units`,
        'Status': 'DULY REGISTERED & VALIDATED'
      },
      bodyParagraphs: [
        `This serves as the official course registration confirmation slip for the 2026/2027 Academic Session. The student is authorized to attend lectures, sit for Continuous Assessments, and participate in Semester Examinations for the courses listed below.`
      ],
      tableData: {
        headers: ['Code', 'Course Title', 'Units', 'Category', 'Course Lecturer'],
        rows: registeredCoursesList.filter(c => c.status === 'REGISTERED').map(c => [
          c.code,
          c.title,
          `${c.creditUnits}`,
          c.category || 'Core',
          c.lecturer || 'Faculty Assigned'
        ])
      },
      signatoryTitle: 'Departmental Course Advisor & Head of Dept',
      signatoryName: 'Prof. Walter Sterling, Ph.D',
      status: 'VERIFIED',
      verificationHash: `APX-CRS-${studentProfile.matricNumber}-44812`
    });
  };

  const handleOpenClearanceCertificate = () => {
    openInstitutionalDocument({
      title: 'CONSOLIDATED INSTITUTIONAL CLEARANCE CERTIFICATE',
      documentNumber: `CLR-${studentProfile.matricNumber.replace(/[^a-zA-Z0-9]/g, '')}-2026`,
      date: 'August 24, 2026',
      recipientName: currentUser.name,
      recipientId: studentProfile.matricNumber,
      recipientDept: studentProfile.department,
      metadata: {
        'Candidate Name': currentUser.name,
        'Matriculation Number': studentProfile.matricNumber,
        'Academic Department': studentProfile.department,
        'Overall Clearance Status': 'CLEARED & APPROVED',
        'Verification Scope': 'Bursary, Library, Hostel, Academic Dept, Sports & Registry'
      },
      bodyParagraphs: [
        `This is to certify that ${currentUser.name.toUpperCase()} has satisfied all institutional clearance requirements across all university directorates and service divisions.`,
        `No outstanding liabilities, overdue library loans, unpaid tuition balances, or disciplinary encumbrances exist in the university repository.`
      ],
      tableData: {
        headers: ['Directorate / Department', 'Clearance Scope', 'Approving Officer', 'Verification Status'],
        rows: clearanceItems.map(item => [
          item.department,
          item.notes || 'Institutional Verification',
          item.officerName,
          item.status === 'CLEARED' ? 'CLEARED (APPROVED)' : item.status
        ])
      },
      signatoryTitle: 'Dean of Student Affairs & Central Clearance Board',
      signatoryName: 'Dr. Evelyn Sterling, Ph.D',
      status: 'VERIFIED',
      verificationHash: `APX-CLR-${studentProfile.matricNumber}-33901`
    });
  };

  const handleOpenInvoiceReceipt = (inv: typeof studentInvoices[0]) => {
    openInstitutionalDocument({
      title: 'OFFICIAL BURSARY PAYMENT RECEIPT',
      documentNumber: `RCT-${inv.invoiceNumber}-2026`,
      date: 'August 24, 2026',
      recipientName: currentUser.name,
      recipientId: studentProfile.matricNumber,
      recipientDept: studentProfile.department,
      metadata: {
        'Invoice Reference': inv.invoiceNumber,
        'Fee Description': inv.title,
        'Academic Session': inv.session,
        'Amount Paid': `$${inv.paidAmount.toFixed(2)} USD`,
        'Outstanding Balance': `$${inv.balance.toFixed(2)} USD`,
        'Settlement Status': inv.status === 'PAID' ? 'SETTLED & RECONCILED' : 'PARTIALLY SETTLED'
      },
      bodyParagraphs: [
        `This document certifies that payment for ${inv.title} has been received into the University Treasury and duly credited to student account ${studentProfile.matricNumber}.`
      ],
      tableData: {
        headers: ['Fee Item', 'Session', 'Due Date', 'Billed', 'Paid', 'Balance'],
        rows: [
          [inv.title, inv.session, inv.dueDate, `$${inv.amount.toFixed(2)}`, `$${inv.paidAmount.toFixed(2)}`, `$${inv.balance.toFixed(2)}`]
        ]
      },
      signatoryTitle: 'Bursar & Chief Financial Officer',
      signatoryName: 'Dr. Gregory Finch, FCA',
      status: 'VERIFIED',
      verificationHash: `APX-RCT-${inv.invoiceNumber}-88192`
    });
  };

  const handleToggleCourseRegistration = (courseId: string) => {
    setRegisteredCoursesList(prev => prev.map(course => {
      if (course.id === courseId) {
        const newStatus = course.status === 'REGISTERED' ? 'AVAILABLE' : 'REGISTERED';
        logAction(
          'STUDENT',
          'UPDATE',
          'Academic Registration',
          'GRANTED',
          `Toggled course ${course.code} status to ${newStatus}`
        );
        return { ...course, status: newStatus };
      }
      return course;
    }));
  };

  const handleCommitCourseRegistration = () => {
    setRegistrationSubmitted(true);
    publishCrossPortalEvent(
      'ACADEMIC_REGISTRATION_COMPLETED',
      'STUDENT',
      ['ELEARNING', 'EXAMINATIONS'],
      {
        studentId: currentUser.id,
        matricNumber: studentProfile.matricNumber,
        registeredCourseCodes: registeredCoursesList.filter(c => c.status === 'REGISTERED').map(c => c.code),
        totalCredits: totalRegisteredCredits
      },
      `Student ${currentUser.name} committed course registration (${totalRegisteredCredits} units)`
    );
    logAction(
      'STUDENT',
      'APPROVE',
      'Student Portal Registration',
      'GRANTED',
      `Finalized course registration for ${totalRegisteredCredits} units. Synchronized with LMS & Exam Board.`
    );
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqSubject || !reqDetails) return;
    submitStudentRequest(reqType, reqSubject, reqDetails);
    setReqSubject('');
    setReqDetails('');
    setIsSubmitSuccess(true);
    setIsNewRequestOpen(false);
    setTimeout(() => setIsSubmitSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. DASHBOARD / OVERVIEW TAB */}
      {/* ------------------------------------------------------------- */}
      {(activeNavTab === 'dashboard' || !activeNavTab) && (
        <div className="space-y-6">
          <PageHeader
            title={currentUser.name}
            badge={studentProfile.matricNumber}
            badgeVariant="brand"
            actions={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAttestationLetter}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Attestation</span>
                </button>
                <button
                  onClick={handleOpenTranscript}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Official Transcript</span>
                </button>
              </div>
            }
          />

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <StatCard
              label="Cumulative CGPA"
              value={studentProfile.cgpa.toFixed(2)}
              subtext="Scale: 4.00 Max"
              badge="First Class"
              badgeVariant="success"
              accentColor="#34d399"
              icon={<Award className="w-4 h-4" />}
            />
            <StatCard
              label="Credit Units"
              value={`${studentProfile.totalCreditsEarned} / ${studentProfile.totalCreditsRequired}`}
              subtext="81% Completion"
              icon={<BookOpenCheck className="w-4 h-4" />}
            />
            <StatCard
              label="Semester Registration"
              value="Cleared"
              subtext="4 Courses (13 Units)"
              badge="Active"
              badgeVariant="info"
              icon={<CheckCircle className="w-4 h-4" />}
            />
            <StatCard
              label="Bursary Balance"
              value="$0.00"
              subtext="Settled"
              badge="Cleared"
              badgeVariant="success"
              icon={<CreditCard className="w-4 h-4" />}
            />
          </div>

          {/* Enrolled Courses Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Current Courses
              </h3>
              <button
                onClick={() => setActiveNavTab('courses')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                Full Timetable <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <DataTable
              columns={[
                {
                  key: 'code',
                  header: 'Course Code',
                  render: (c: typeof studentCourses[0]) => (
                    <span className="font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                      {c.code}
                    </span>
                  )
                },
                {
                  key: 'title',
                  header: 'Course Title',
                  render: (c: typeof studentCourses[0]) => (
                    <div>
                      <span className="font-semibold text-slate-100 block">{c.title}</span>
                      <span className="text-[11px] text-slate-400">{c.instructorName}</span>
                    </div>
                  )
                },
                {
                  key: 'creditUnits',
                  header: 'Units',
                  align: 'center',
                  render: (c: typeof studentCourses[0]) => (
                    <span className="font-mono font-bold text-slate-200">{c.creditUnits}</span>
                  )
                },
                {
                  key: 'schedule',
                  header: 'Time & Venue',
                  render: (c: typeof studentCourses[0]) => (
                    <div className="font-mono text-xs">
                      <span className="text-emerald-400 font-semibold block">{c.schedule}</span>
                      <span className="text-slate-400 text-[11px]">{c.room}</span>
                    </div>
                  )
                },
                {
                  key: 'status',
                  header: 'Status',
                  align: 'right',
                  render: () => <StatusBadge variant="success" size="sm">Enrolled</StatusBadge>
                }
              ]}
              data={studentCourses}
              keyExtractor={(c) => c.id}
            />
          </div>

          {/* Academic Advising & Vital Notice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Assigned Faculty Advisor
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Active Support
                </span>
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-100">{studentProfile.advisorName}</div>
                <div className="text-slate-400">{studentProfile.advisorEmail}</div>
                <div className="text-slate-500 font-mono text-[11px] pt-1">Office Hours: Tuesday 2:00 PM – 4:00 PM (CIS-302)</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  Examination Notice
                </span>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Senate Ratified
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                First Semester examination cards are active. Ensure all departmental clearance checkpoints are verified before hall entry.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. PROFILE TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'profile' && (
        <div className="space-y-6">
          <PageHeader
            title="Student Profile"
            badge="Verified"
            badgeVariant="success"
            actions={
              <button
                onClick={handleOpenAttestationLetter}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Certificate</span>
              </button>
            }
          />

          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center border border-blue-400/40 shadow-inner">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{currentUser.name}</h2>
                    <StatusBadge variant="success" size="sm">Active</StatusBadge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {studentProfile.matricNumber} • {currentUser.id}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Academic Standing</span>
                <span className="text-emerald-400 font-bold text-base">Dean&apos;s Honours List (CGPA 3.85)</span>
              </div>
            </div>

            {/* Academic Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs font-mono">
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Faculty</span>
                <div className="text-slate-100 font-bold">{studentProfile.faculty}</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Department</span>
                <div className="text-slate-100 font-bold">{studentProfile.department}</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Programme</span>
                <div className="text-blue-300 font-bold">{studentProfile.programme}</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Level</span>
                <div className="text-slate-100 font-bold">{studentProfile.currentLevel} Level</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Session</span>
                <div className="text-slate-100 font-bold">{studentProfile.academicYear}</div>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Semester</span>
                <div className="text-emerald-400 font-bold">{studentProfile.currentSemester}</div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2.5">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Contact
                </h3>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500" /><span>{currentUser.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500" /><span className="font-mono">+1 (555) 234-5678</span></div>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500" /><span>Hostel Block C, Room 204</span></div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2.5">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Next of Kin
                </h3>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-500">Name:</span><span className="font-semibold text-slate-100">Eleanor Vance Doe (Mother)</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-mono text-slate-100">+1 (555) 987-6543</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Address:</span><span className="text-slate-100">42 University Crescent</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. COURSE REGISTRATION TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'registration' && (
        <div className="space-y-6">
          <PageHeader
            title="Course Registration"
            badge={`${totalRegisteredCredits} / 24 Units`}
            badgeVariant={totalRegisteredCredits > 24 ? 'danger' : 'success'}
            actions={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenCourseSlip}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Course Slip</span>
                </button>
                <button
                  onClick={handleCommitCourseRegistration}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{registrationSubmitted ? 'Update Registration' : 'Commit Registration'}</span>
                </button>
              </div>
            }
          />

          {registrationSubmitted && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Registration finalized.</span>
              </div>
              <button
                onClick={handleOpenCourseSlip}
                className="text-emerald-400 hover:underline font-semibold font-mono"
              >
                Print Slip →
              </button>
            </div>
          )}

          {/* Departmental Course Catalogue DataTable */}
          <DataTable
            columns={[
              {
                key: 'code',
                header: 'Code',
                render: (c: AcademicCourse) => (
                  <span className="font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                    {c.code}
                  </span>
                )
              },
              {
                key: 'title',
                header: 'Course Title',
                render: (c: AcademicCourse) => (
                  <div>
                    <span className="font-semibold text-slate-100 block">{c.title}</span>
                    <span className="text-[11px] text-slate-400">Lecturer: {c.lecturer}</span>
                  </div>
                )
              },
              {
                key: 'category',
                header: 'Category',
                render: (c: AcademicCourse) => (
                  <StatusBadge
                    variant={c.category === 'COMPULSORY' ? 'danger' : 'info'}
                    size="sm"
                  >
                    {c.category}
                  </StatusBadge>
                )
              },
              {
                key: 'creditUnits',
                header: 'Units',
                align: 'center',
                render: (c: AcademicCourse) => (
                  <span className="font-mono font-bold text-slate-200">{c.creditUnits}</span>
                )
              },
              {
                key: 'schedule',
                header: 'Schedule & Venue',
                render: (c: AcademicCourse) => (
                  <div className="font-mono text-[11px]">
                    <span className="text-emerald-400 block">{c.schedule}</span>
                    <span className="text-slate-400">{c.venue}</span>
                  </div>
                )
              },
              {
                key: 'prerequisites',
                header: 'Prerequisites',
                render: (c: AcademicCourse) => (
                  <span className="font-mono text-[11px] text-amber-400">{c.prerequisites}</span>
                )
              },
              {
                key: 'actions',
                header: 'Action',
                align: 'right',
                render: (c: AcademicCourse) => {
                  const isRegistered = c.status === 'REGISTERED';
                  return (
                    <button
                      onClick={() => handleToggleCourseRegistration(c.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                        isRegistered
                          ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                      }`}
                    >
                      {isRegistered ? 'Drop' : '+ Add'}
                    </button>
                  );
                }
              }
            ]}
            data={registeredCoursesList.filter(c => {
              const matchesSearch = !regSearch || c.code.toLowerCase().includes(regSearch.toLowerCase()) || c.title.toLowerCase().includes(regSearch.toLowerCase());
              const matchesCat = regCategoryFilter === 'ALL' || c.category === regCategoryFilter;
              return matchesSearch && matchesCat;
            })}
            keyExtractor={(c) => c.id}
            searchQuery={regSearch}
            onSearchChange={setRegSearch}
            searchPlaceholder="Search catalogue courses..."
            filters={
              <select
                value={regCategoryFilter}
                onChange={(e) => setRegCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Categories</option>
                <option value="COMPULSORY">Compulsory</option>
                <option value="ELECTIVE">Elective</option>
              </select>
            }
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. ENROLLED COURSES & TIMETABLE TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'courses' && (
        <div className="space-y-6">
          <PageHeader
            title="Lecture Timetable"
            badge="Semester 1"
            badgeVariant="info"
            actions={
              <button
                onClick={handleOpenCourseSlip}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Timetable</span>
              </button>
            }
          />

          {/* Day Filter Strip */}
          <div className="flex items-center gap-1.5">
            {['ALL', 'MON', 'TUE', 'WED', 'THU', 'FRI'].map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer font-mono ${
                  selectedDay === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <DataTable
            columns={[
              {
                key: 'code',
                header: 'Course Code',
                render: (c: typeof studentCourses[0]) => (
                  <span className="font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                    {c.code}
                  </span>
                )
              },
              {
                key: 'title',
                header: 'Course Title',
                render: (c: typeof studentCourses[0]) => (
                  <div>
                    <span className="font-semibold text-slate-100 block">{c.title}</span>
                    <span className="text-[11px] text-slate-400">Instructor: {c.instructorName}</span>
                  </div>
                )
              },
              {
                key: 'creditUnits',
                header: 'Units',
                align: 'center',
                render: (c: typeof studentCourses[0]) => (
                  <span className="font-mono font-bold text-slate-200">{c.creditUnits}</span>
                )
              },
              {
                key: 'schedule',
                header: 'Time Schedule',
                render: (c: typeof studentCourses[0]) => (
                  <span className="font-mono text-emerald-400 font-semibold">{c.schedule}</span>
                )
              },
              {
                key: 'room',
                header: 'Venue',
                render: (c: typeof studentCourses[0]) => (
                  <span className="font-mono text-slate-300">{c.room}</span>
                )
              },
              {
                key: 'attendance',
                header: 'Attendance',
                align: 'right',
                render: () => (
                  <div className="text-right font-mono">
                    <span className="text-blue-400 font-bold">94.5%</span>
                    <span className="block text-[10px] text-emerald-400">Exam Eligible</span>
                  </div>
                )
              }
            ]}
            data={studentCourses}
            keyExtractor={(c) => c.id}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. RESULTS & CGPA TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'results' && (
        <div className="space-y-6">
          <PageHeader
            title="Results & CGPA"
            badge="Senate Gazetted"
            badgeVariant="success"
            actions={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAttestationLetter}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Attestation Letter</span>
                </button>
                <button
                  onClick={handleOpenTranscript}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Official Transcript</span>
                </button>
              </div>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <StatCard
              label="Cumulative CGPA"
              value={studentProfile.cgpa.toFixed(2)}
              subtext="Scale: 4.00"
              badge="First Class"
              badgeVariant="success"
              accentColor="#34d399"
            />
            <StatCard
              label="Semester GPA"
              value="3.82"
              subtext="Semester 1"
              badge="Honours"
              badgeVariant="brand"
            />
            <StatCard
              label="Total Credits Earned"
              value={`${studentProfile.totalCreditsEarned} / ${studentProfile.totalCreditsRequired}`}
              subtext="Good Standing"
              badge="Approved"
              badgeVariant="success"
            />
          </div>

          <DataTable
            columns={[
              {
                key: 'code',
                header: 'Course Code',
                render: (r: any) => (
                  <span className="font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
                    {r.code}
                  </span>
                )
              },
              {
                key: 'title',
                header: 'Course Title',
                render: (r: any) => <span className="font-semibold text-slate-100">{r.title}</span>
              },
              {
                key: 'units',
                header: 'Units',
                align: 'center',
                render: (r: any) => <span className="font-mono font-bold text-slate-200">{r.units}</span>
              },
              {
                key: 'score',
                header: 'Total Score',
                align: 'center',
                render: (r: any) => <span className="font-mono font-bold text-slate-100">{r.score}</span>
              },
              {
                key: 'grade',
                header: 'Grade',
                align: 'center',
                render: (r: any) => (
                  <span className="font-mono font-black text-emerald-400 text-sm">{r.grade}</span>
                )
              },
              {
                key: 'points',
                header: 'Grade Points',
                align: 'center',
                render: (r: any) => <span className="font-mono text-slate-300">{r.points}</span>
              },
              {
                key: 'status',
                header: 'Senate Status',
                align: 'right',
                render: () => <StatusBadge variant="success" size="sm">Passed</StatusBadge>
              }
            ]}
            data={[
              { code: 'CSC 301', title: 'Advanced Algorithms & Complexity', units: 4, score: '88.5%', grade: 'A', points: '4.00' },
              { code: 'CSC 303', title: 'Operating Systems & Concurrency', units: 3, score: '81.0%', grade: 'A-', points: '3.70' },
              { code: 'CSC 305', title: 'Database Systems Engineering', units: 3, score: '92.0%', grade: 'A+', points: '4.00' },
              { code: 'MAT 301', title: 'Discrete Mathematics & Graph Theory', units: 3, score: '79.5%', grade: 'B+', points: '3.30' }
            ]}
            keyExtractor={(r) => r.code}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. FEES & INVOICES TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'fees' && (
        <div className="space-y-6">
          <PageHeader
            title="Fees & Invoices"
            badge="Ledger Reconciled"
            badgeVariant="success"
          />

          <DataTable
            columns={[
              {
                key: 'invoiceNumber',
                header: 'Invoice Ref',
                render: (inv: typeof studentInvoices[0]) => (
                  <span className="font-mono font-bold text-slate-300">{inv.invoiceNumber}</span>
                )
              },
              {
                key: 'title',
                header: 'Fee Description',
                render: (inv: typeof studentInvoices[0]) => (
                  <div>
                    <span className="font-semibold text-slate-100 block">{inv.title}</span>
                    <span className="text-[11px] text-slate-400 font-mono">Session: {inv.session}</span>
                  </div>
                )
              },
              {
                key: 'amount',
                header: 'Amount Billed',
                align: 'right',
                render: (inv: typeof studentInvoices[0]) => (
                  <span className="font-mono font-bold text-white">${inv.amount.toFixed(2)}</span>
                )
              },
              {
                key: 'paidAmount',
                header: 'Paid Amount',
                align: 'right',
                render: (inv: typeof studentInvoices[0]) => (
                  <span className="font-mono text-emerald-400 font-bold">${inv.paidAmount.toFixed(2)}</span>
                )
              },
              {
                key: 'balance',
                header: 'Outstanding Balance',
                align: 'right',
                render: (inv: typeof studentInvoices[0]) => (
                  <span className="font-mono font-semibold text-slate-300">${inv.balance.toFixed(2)}</span>
                )
              },
              {
                key: 'status',
                header: 'Status',
                render: (inv: typeof studentInvoices[0]) => (
                  <StatusBadge variant={getStatusBadgeVariant(inv.status)} size="sm">
                    {inv.status}
                  </StatusBadge>
                )
              },
              {
                key: 'actions',
                header: 'Actions',
                align: 'right',
                render: (inv: typeof studentInvoices[0]) => (
                  <div className="flex items-center justify-end gap-1.5">
                    {inv.status !== 'PAID' && (
                      <button
                        onClick={() => payInvoice(inv.id, inv.balance, 'DIRECT_PORTAL_SETTLEMENT')}
                        className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer"
                      >
                        Pay
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenInvoiceReceipt(inv)}
                      className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                    >
                      Receipt
                    </button>
                  </div>
                )
              }
            ]}
            data={studentInvoices.filter(inv =>
              !invoiceSearch || inv.title.toLowerCase().includes(invoiceSearch.toLowerCase()) || inv.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase())
            )}
            keyExtractor={(inv) => inv.id}
            searchQuery={invoiceSearch}
            onSearchChange={setInvoiceSearch}
            searchPlaceholder="Search invoices..."
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. CLEARANCE CHECKLIST TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'clearance' && (
        <div className="space-y-6">
          <PageHeader
            title="Clearance Checklist"
            badge="All Cleared"
            badgeVariant="success"
            actions={
              <button
                onClick={handleOpenClearanceCertificate}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Certificate</span>
              </button>
            }
          />

          <DataTable
            columns={[
              {
                key: 'department',
                header: 'Directorate / Unit',
                render: (item: typeof clearanceItems[0]) => (
                  <span className="font-bold text-slate-100">{item.department}</span>
                )
              },
              {
                key: 'notes',
                header: 'Verification Requirement',
                render: (item: typeof clearanceItems[0]) => (
                  <span className="text-slate-300">{item.notes || 'Full Clearance Audit'}</span>
                )
              },
              {
                key: 'officerName',
                header: 'Approving Officer',
                render: (item: typeof clearanceItems[0]) => (
                  <span className="font-mono text-slate-400 text-xs">{item.officerName}</span>
                )
              },
              {
                key: 'updatedAt',
                header: 'Date Cleared',
                render: (item: typeof clearanceItems[0]) => (
                  <span className="font-mono text-slate-400 text-xs">{item.updatedAt || '2026-08-20'}</span>
                )
              },
              {
                key: 'status',
                header: 'Status',
                align: 'right',
                render: (item: typeof clearanceItems[0]) => (
                  <StatusBadge variant={getStatusBadgeVariant(item.status)} size="sm">
                    {item.status}
                  </StatusBadge>
                )
              }
            ]}
            data={clearanceItems}
            keyExtractor={(item) => item.id}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. REQUESTS & PETITIONS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'requests' && (
        <div className="space-y-6">
          <PageHeader
            title="Petitions & Requests"
            actions={
              <button
                onClick={() => setIsNewRequestOpen(!isNewRequestOpen)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isNewRequestOpen ? 'Close Form' : 'New Petition'}</span>
              </button>
            }
          />

          {isSubmitSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Petition submitted successfully.</span>
            </div>
          )}

          {isNewRequestOpen && (
            <form onSubmit={handleCreateRequest} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Submit Request</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Request Category</label>
                  <select
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="OFFICIAL_TRANSCRIPT">Official Transcript Dispatch</option>
                    <option value="COURSE_ADD_DROP">Course Add/Drop Exemption</option>
                    <option value="GRADE_RECHECK">Examination Script Remarking</option>
                    <option value="LEAVE_OF_ABSENCE">Academic Leave of Absence</option>
                    <option value="HOSTEL_CHANGE">Hostel Room Reassignment</option>
                    <option value="CLEARANCE_PETITION">Clearance Petition</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Subject</label>
                  <input
                    type="text"
                    required
                    value={reqSubject}
                    onChange={(e) => setReqSubject(e.target.value)}
                    placeholder="e.g. Urgent Dispatch to Stanford University"
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="text-slate-400 block mb-1 font-semibold">Details</label>
                <textarea
                  required
                  rows={3}
                  value={reqDetails}
                  onChange={(e) => setReqDetails(e.target.value)}
                  placeholder="Provide details..."
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRequestOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm"
                >
                  Submit
                </button>
              </div>
            </form>
          )}

          <DataTable
            columns={[
              {
                key: 'id',
                header: 'Tracking Ref',
                render: (r: StudentRequest) => (
                  <span className="font-mono font-bold text-slate-300 text-xs">{r.id}</span>
                )
              },
              {
                key: 'type',
                header: 'Request Type',
                render: (r: StudentRequest) => (
                  <span className="font-mono text-xs text-blue-400 font-semibold">{r.type.replace(/_/g, ' ')}</span>
                )
              },
              {
                key: 'subject',
                header: 'Subject & Details',
                render: (r: StudentRequest) => (
                  <div>
                    <span className="font-semibold text-slate-100 block">{r.subject}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{r.details}</span>
                  </div>
                )
              },
              {
                key: 'submittedAt',
                header: 'Date Submitted',
                render: (r: StudentRequest) => (
                  <span className="font-mono text-slate-400 text-xs">{r.submittedAt}</span>
                )
              },
              {
                key: 'status',
                header: 'Status',
                align: 'right',
                render: (r: StudentRequest) => (
                  <StatusBadge variant={getStatusBadgeVariant(r.status)} size="sm">
                    {r.status}
                  </StatusBadge>
                )
              }
            ]}
            data={studentRequests}
            keyExtractor={(r) => r.id}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. DOCUMENTS & TRANSCRIPTS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'documents' && (
        <div className="space-y-6">
          <PageHeader
            title="Documents & Transcripts"
            badge="Senate Certified"
            badgeVariant="brand"
          />

          <DataTable
            columns={[
              {
                key: 'title',
                header: 'Document Name',
                render: (doc: any) => (
                  <div>
                    <span className="font-bold text-slate-100 block">{doc.title}</span>
                    <span className="text-[11px] text-slate-400">{doc.description}</span>
                  </div>
                )
              },
              {
                key: 'ref',
                header: 'Document Ref',
                render: (doc: any) => (
                  <span className="font-mono text-xs text-slate-300">{doc.ref}</span>
                )
              },
              {
                key: 'authority',
                header: 'Issuing Authority',
                render: (doc: any) => (
                  <span className="text-xs text-slate-300">{doc.authority}</span>
                )
              },
              {
                key: 'status',
                header: 'Status',
                render: (doc: any) => (
                  <StatusBadge variant="success" size="sm">{doc.status}</StatusBadge>
                )
              },
              {
                key: 'actions',
                header: 'Action',
                align: 'right',
                render: (doc: any) => (
                  <button
                    onClick={doc.onOpen}
                    className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3 h-3" />
                    <span>View / Print</span>
                  </button>
                )
              }
            ]}
            data={[
              {
                title: 'Official Academic Transcript',
                description: 'Record of semester grades, CGPA, and Senate gazette stamp.',
                ref: `TRX-${studentProfile.matricNumber.replace(/[^a-zA-Z0-9]/g, '')}-2026`,
                authority: 'University Senate & Registrar',
                status: 'VERIFIED',
                onOpen: handleOpenTranscript
              },
              {
                title: 'Certificate of Bona Fide Studentship',
                description: 'Attestation letter for visa and official verification.',
                ref: `ATT-${studentProfile.matricNumber.replace(/[^a-zA-Z0-9]/g, '')}-2026`,
                authority: 'Academic Affairs Division',
                status: 'VERIFIED',
                onOpen: handleOpenAttestationLetter
              },
              {
                title: 'Course Registration Slip',
                description: 'First Semester 2026/2027 validated course slip.',
                ref: `CRS-${studentProfile.matricNumber.replace(/[^a-zA-Z0-9]/g, '')}-2026-S1`,
                authority: 'Head of Department & Course Advisor',
                status: 'VERIFIED',
                onOpen: handleOpenCourseSlip
              },
              {
                title: 'Institutional Clearance Certificate',
                description: 'Consolidated clearance across Bursary, Library, Hostel, and Registry.',
                ref: `CLR-${studentProfile.matricNumber.replace(/[^a-zA-Z0-9]/g, '')}-2026`,
                authority: 'Dean of Student Affairs',
                status: 'VERIFIED',
                onOpen: handleOpenClearanceCertificate
              }
            ]}
            keyExtractor={(doc) => doc.ref}
          />
        </div>
      )}

    </div>
  );
}
