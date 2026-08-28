'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { StudentRequest, AcademicCourse } from '@/types/erp';
import { MOCK_REGISTRATION_COURSES_POOL } from '@/lib/mock-data';
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
  AlertCircle,
  Plus,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  CheckCircle2,
  Trash2,
  Printer,
  Download,
  QrCode,
  Sparkles,
  ExternalLink,
  BookMarked,
  FileCheck2,
  Users
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

  // State for Academic Registration
  const [registeredCoursesList, setRegisteredCoursesList] = useState<AcademicCourse[]>(MOCK_REGISTRATION_COURSES_POOL);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [attestationGenerated, setAttestationGenerated] = useState(false);

  // Filter state for timetable
  const [selectedDay, setSelectedDay] = useState<string>('ALL');

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
        `All university obligations, multi-departmental clearance clearances, and academic course registrations have been duly fulfilled. This official document is issued upon request for official verification, visa applications, scholarship renewals, or institutional sponsorships.`,
        `Any alteration, defacement, or unauthorized replication of this document renders it null and void. Authenticity can be verified instantaneously using the cryptographic verification seal below.`
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
        'Senate Award Date': 'July 2026'
      },
      bodyParagraphs: [
        `The Senate of the University hereby certifies that ${currentUser.name} has completed all academic coursework, practical laboratory sessions, and departmental examinations prescribed for the academic degree programme.`,
        `Grading System Key: A (70-100%, 4.00 GP), B (60-69%, 3.00 GP), C (50-59%, 2.00 GP), D (45-49%, 1.00 GP), F (0-44%, 0.00 GP). Minimum CGPA required for graduation: 2.00.`
      ],
      tableData: {
        headers: ['Course Code', 'Course Title', 'Credit Units', 'Score', 'Grade', 'Grade Point'],
        rows: [
          ['CSC301', 'Data Structures & Algorithms in C++', '4', '96', 'A+', '4.00'],
          ['CSC305', 'Operating Systems & Architecture', '3', '88', 'A', '4.00'],
          ['MAT201', 'Linear Algebra & Numerical Methods', '3', '84', 'B+', '3.50'],
          ['CSC309', 'Database Management Systems & SQL', '3', '91', 'A+', '4.00'],
          ['CSC311', 'Computer Networks & Security', '3', '94', 'A+', '4.00'],
          ['GST202', 'Philosophy, Logic & Human Existence', '2', '89', 'A', '4.00']
        ]
      },
      signatoryTitle: 'Registrar & Academic Affairs Director',
      signatoryName: 'Dr. Arthur Vance, Ph.D, FNCS',
      status: 'VERIFIED',
      verificationHash: `APX-TRX-SENATE-GAZETTE-99812`
    });
  };

  const handleOpenCourseSlip = () => {
    openInstitutionalDocument({
      title: 'OFFICIAL COURSE REGISTRATION FORM & SEMESTER SLIP',
      documentNumber: `REG-${studentProfile.matricNumber.replace(/[^a-zA-Z0-9]/g, '')}-2026/1`,
      date: 'August 24, 2026',
      recipientName: currentUser.name,
      recipientId: studentProfile.matricNumber,
      recipientDept: studentProfile.department,
      metadata: {
        'Academic Session': '2026/2027 Session (First Semester)',
        'Programme': studentProfile.programme,
        'Level': `${studentProfile.currentLevel} Level`,
        'Total Registered Units': `${totalRegisteredCredits} Credit Units`,
        'Academic Advisor': 'Dr. Marcus Henderson (HOD Computing)',
        'Advisor Endorsement': 'APPROVED & SEALED'
      },
      bodyParagraphs: [
        `This slip certifies that the candidate has completed official online course registration for the current semester in compliance with university regulations and curriculum prerequisites.`,
        `Attendance threshold: A minimum of 75% attendance in lecture hours and laboratory practicums is required to qualify for end-of-semester examination admittance.`
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
      signatoryName: 'Dr. Marcus Henderson, Ph.D',
      status: 'VERIFIED',
      verificationHash: `APX-REG-COURSE-SLIP-44120`
    });
  };

  const handleOpenClearanceCertificate = () => {
    openInstitutionalDocument({
      title: 'CONSOLIDATED MULTI-DEPARTMENTAL CLEARANCE CERTIFICATE',
      documentNumber: `CLR-${studentProfile.matricNumber.replace(/[^a-zA-Z0-9]/g, '')}-2026`,
      date: 'August 24, 2026',
      recipientName: currentUser.name,
      recipientId: studentProfile.matricNumber,
      recipientDept: studentProfile.department,
      metadata: {
        'Student Name': currentUser.name,
        'Matriculation No': studentProfile.matricNumber,
        'Graduation / Exam Eligibility': 'FULL CLEARANCE GRANTED',
        'Bursary Status': 'Zero Balance Outstanding ($0.00)',
        'Library Status': 'All borrowed materials and journals returned',
        'Hostel / Hall Status': 'Room key inventory verified'
      },
      bodyParagraphs: [
        `This is to confirm that the student named herein has satisfied all statutory, financial, academic, and administrative clearance requirements of the University.`,
        `All university assets, library books, and laboratory equipment have been accounted for, and all fees/levies for the academic period stand cleared.`
      ],
      tableData: {
        headers: ['Clearing Unit', 'Clearing Officer', 'Status', 'Timestamp', 'Official Remarks'],
        rows: clearanceItems.map(item => [
          item.department,
          item.officerName,
          item.status,
          item.updatedAt,
          item.notes
        ])
      },
      signatoryTitle: 'Dean of Student Affairs & Central Registry',
      signatoryName: 'Prof. Evelyn Reed, Ph.D',
      status: 'VERIFIED',
      verificationHash: `APX-CLR-FULL-CLEARANCE-10023`
    });
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqSubject.trim() || !reqDetails.trim()) return;
    submitStudentRequest(reqType, reqSubject.trim(), reqDetails.trim());
    setIsSubmitSuccess(true);
    setReqSubject('');
    setReqDetails('');
    setTimeout(() => setIsSubmitSuccess(false), 3000);
  };

  const handleToggleCourseRegistration = (courseId: string) => {
    setRegisteredCoursesList(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        const newStatus = c.status === 'REGISTERED' ? 'AVAILABLE' : 'REGISTERED';
        return { ...c, status: newStatus };
      })
    );
  };

  const handleCommitCourseRegistration = () => {
    setRegistrationSubmitted(true);
    publishCrossPortalEvent(
      'ACADEMIC_COURSE_REGISTRATION_COMMITTED',
      'STUDENT',
      ['ELEARNING', 'ADMIN'],
      { studentId: currentUser.id, totalCredits: totalRegisteredCredits },
      `Student ${currentUser.name} committed registration for ${totalRegisteredCredits} credit units.`
    );
    logAction('STUDENT', 'SUBMIT_REGISTRATION', 'First Semester 2026/2027', 'GRANTED', `Registered for ${totalRegisteredCredits} credit units`);
  };

  return (
    <div className="space-y-6">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. DASHBOARD TAB */}
      {/* ------------------------------------------------------------- */}
      {(activeNavTab === 'dashboard' || !activeNavTab) && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Welcome Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/60 border border-blue-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Institutional Self-Service
                </span>
                <span className="text-xs text-slate-400 font-mono">{studentProfile.matricNumber}</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Welcome, {currentUser.name}
              </h1>
              <p className="text-xs text-slate-300 max-w-xl">
                {studentProfile.programme} • {studentProfile.currentLevel} • Academic Year {studentProfile.academicYear}
              </p>
            </div>

            {/* Quick Cross-Portal Deep Launch Bridges */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigateToPortal('ELEARNING')}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition group"
              >
                <BookOpenCheck className="w-4 h-4 text-white" />
                <div className="text-left">
                  <span className="block leading-none">Open E-Learning</span>
                  <span className="text-[10px] text-emerald-200 font-normal">Separate LMS Portal</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => navigateToPortal('ELIBRARY')}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-950/40 transition group"
              >
                <Library className="w-4 h-4 text-white" />
                <div className="text-left">
                  <span className="block leading-none">Open E-Library</span>
                  <span className="text-[10px] text-amber-200 font-normal">Separate Library Portal</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>

          {/* Academic Standing & Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Cumulative GPA</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400 font-mono">{studentProfile.cgpa.toFixed(2)}</span>
                <span className="text-xs text-slate-400 font-mono">/ 4.00</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mt-1">
                ★ Dean&apos;s Honours List
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Credit Units</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white font-mono">{studentProfile.totalCreditsEarned}</span>
                <span className="text-xs text-slate-400 font-mono">/ {studentProfile.totalCreditsRequired} Required</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(studentProfile.totalCreditsEarned / studentProfile.totalCreditsRequired) * 100}%` }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Semester Registration</span>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-white">Officially Cleared</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">4 Enrolled Courses (13 Units)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Bursary Balance</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono">$0.00</span>
                <span className="text-xs text-emerald-400 font-semibold ml-1 font-mono">Paid in Full</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Exam Hall Permit Active</span>
            </div>

          </div>

          {/* Quick Modules Grid: Timetable & Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Registered Courses & Schedules */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Current Semester Course Schedule
                </h3>
                <button
                  onClick={() => setActiveNavTab('courses')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                >
                  Full Timetable <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {studentCourses.map(course => (
                  <div
                    key={course.id}
                    className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[11px]">
                          {course.code}
                        </span>
                        <span className="font-bold text-slate-100">{course.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>Instructor: <strong className="text-slate-300">{course.instructorName}</strong></span>
                        <span>•</span>
                        <span>{course.creditUnits} Credit Units</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right font-mono text-[11px] text-slate-300 space-y-0.5">
                      <div className="text-emerald-400 font-semibold">{course.schedule}</div>
                      <div className="text-slate-500">{course.room}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional Announcements & Academic Advisor */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Academic Advising & Support
              </h3>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Assigned Faculty Advisor</span>
                <div className="font-bold text-white text-sm">{studentProfile.advisorName}</div>
                <p className="text-[11px] text-slate-400">{studentProfile.advisorEmail}</p>
                <div className="pt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                    Office Hours: Tue 2-4 PM (CIS-302)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-800/40 text-xs space-y-2">
                <div className="flex items-center gap-2 text-blue-300 font-bold">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  <span>Important Portal Notice</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  First Semester Examination timetable officially gazetted. Verify your course clearance badges before examination entrance.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. STUDENT PROFILE & BIO TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl border-2 border-blue-500 object-cover shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active Student
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Matriculation No: <strong className="text-blue-400">{studentProfile.matricNumber}</strong> • Student ID: {currentUser.id}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right font-mono">
                <span className="text-xs text-slate-400 block">Academic Standing</span>
                <span className="text-emerald-400 font-black text-lg">DEAN&apos;S HONOURS LIST</span>
              </div>
            </div>

            {/* Bio & Academic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Faculty</span>
                <div className="text-white font-bold">{studentProfile.faculty}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Department</span>
                <div className="text-white font-bold">{studentProfile.department}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Programme of Study</span>
                <div className="text-blue-300 font-bold">{studentProfile.programme}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Current Level</span>
                <div className="text-white font-bold">{studentProfile.currentLevel}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Academic Session</span>
                <div className="text-white font-bold">{studentProfile.academicYear}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Current Semester</span>
                <div className="text-emerald-400 font-bold">{studentProfile.currentSemester}</div>
              </div>

            </div>

            {/* Contact Details & Next of Kin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              <div className="p-5 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-700/60 pb-2">
                  <User className="w-4 h-4 text-blue-400" />
                  Personal Contact Details
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>+1 (555) 234-5678</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Apex Tech Student Hostel Block C, Room 204</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-700/60 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Next of Kin & Emergency Contact
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Name:</span>
                    <span className="font-bold text-white">Eleanor Vance Doe (Mother)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Emergency Phone:</span>
                    <span className="font-mono text-white">+1 (555) 987-6543</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Residential Address:</span>
                    <span className="text-white">42 University Crescent, Apex City</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. ACADEMIC REGISTRATION TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'registration' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Header Action Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/30">
                  Course Add / Drop Window
                </span>
                <span className="text-xs text-slate-400 font-mono">Max Credit Limit: 24 Units</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Semester Course Registration Studio (First Semester 2026/2027)
              </h2>
              <p className="text-xs text-slate-400">
                Select compulsory and elective modules. Click Submit Registration to commit roster to LMS and Exam Board.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-700 font-mono text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Selected Credits</span>
                <span className="text-xl font-black text-emerald-400">{totalRegisteredCredits} / 24</span>
              </div>

              <button
                onClick={() => setShowSlipModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>View Slip</span>
              </button>

              <button
                onClick={handleCommitCourseRegistration}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-950/40 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{registrationSubmitted ? 'Update Registration' : 'Commit Registration'}</span>
              </button>
            </div>
          </div>

          {registrationSubmitted && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold block">Academic Registration Finalized!</span>
                <span className="text-[11px] text-emerald-200 font-normal">
                  Roster synchronized with E-Learning Portal (LMS) and Faculty Examination Board. Official Registration Slip generated.
                </span>
              </div>
            </div>
          )}

          {/* Course Selection Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-blue-400" />
              Available Departmental Course Catalogue (300 Level)
            </h3>

            <div className="space-y-3">
              {registeredCoursesList.map(course => {
                const isRegistered = course.status === 'REGISTERED';
                return (
                  <div
                    key={course.id}
                    className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      isRegistered
                        ? 'bg-slate-850 border-blue-500/60 ring-1 ring-blue-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-slate-800 text-blue-300 border border-slate-700">
                          {course.code}
                        </span>
                        <span className="font-bold text-white text-sm">{course.title}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          course.category === 'COMPULSORY'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {course.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3 font-mono">
                        <span>Lecturer: {course.lecturer}</span>
                        <span>•</span>
                        <span>Schedule: {course.schedule}</span>
                        <span>•</span>
                        <span>Venue: {course.venue}</span>
                        <span>•</span>
                        <span className="text-amber-400">Prereq: {course.prerequisites}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                      <span className="font-mono font-bold text-white text-sm px-2 py-1 rounded bg-slate-800 border border-slate-700">
                        {course.creditUnits} Units
                      </span>
                      <button
                        onClick={() => handleToggleCourseRegistration(course.id)}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition ${
                          isRegistered
                            ? 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                        }`}
                      >
                        {isRegistered ? 'Drop Course' : '+ Add Course'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. ENROLLED COURSES & TIMETABLE TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'courses' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Weekly Lecture Timetable & Course Directory
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual lecture timetable, venue room allocations, and attendance compliance metrics.
                </p>
              </div>

              {/* Day Filter */}
              <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl text-xs font-mono">
                {['ALL', 'MON', 'TUE', 'WED', 'THU', 'FRI'].map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      selectedDay === d
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentCourses.map(crs => (
                <div
                  key={crs.id}
                  className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-700/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700">
                          {crs.code}
                        </span>
                        <span className="font-bold text-white text-sm">{crs.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">Instructor: {crs.instructorName}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {crs.creditUnits} Units
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">TIME & VENUE</span>
                      <span className="text-emerald-400 font-bold">{crs.schedule}</span>
                      <span className="text-slate-400 block">{crs.room}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">ATTENDANCE RATE</span>
                      <span className="text-blue-400 font-bold text-sm">94.5%</span>
                      <span className="text-emerald-400 block text-[10px]">✓ Exam Eligible</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">LMS Portal Sync: <strong className="text-emerald-400">Connected</strong></span>
                    <button
                      onClick={() => navigateToPortal('ELEARNING')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                    >
                      Open in LMS →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. RESULTS & CGPA TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'results' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                Official Senate Published Results
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Official statement of academic results validated by Senate Examination Board.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Senate Verified & Sealed
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Cumulative GPA (CGPA)</span>
                <span className="text-2xl font-black text-emerald-400">{studentProfile.cgpa.toFixed(2)} / 4.00</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Credits Earned</span>
                <span className="text-2xl font-black text-white">{studentProfile.totalCreditsEarned} Credits</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Standing</span>
                <span className="text-base font-bold text-emerald-400">FIRST CLASS HONOURS</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-3 pr-4">Course Code & Title</th>
                    <th className="pb-3 px-2">Units</th>
                    <th className="pb-3 px-2">CA (30)</th>
                    <th className="pb-3 px-2">Exam (70)</th>
                    <th className="pb-3 px-2">Total (100)</th>
                    <th className="pb-3 px-2">Grade</th>
                    <th className="pb-3 pl-2">GP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {studentCourses.map(course => (
                    <tr key={course.id} className="hover:bg-slate-850/40 transition">
                      <td className="py-3 pr-4">
                        <span className="font-bold text-white block">{course.code}</span>
                        <span className="text-[11px] text-slate-400">{course.title}</span>
                      </td>
                      <td className="py-3 px-2">{course.creditUnits}</td>
                      <td className="py-3 px-2 text-slate-300">28</td>
                      <td className="py-3 px-2 text-slate-300">64</td>
                      <td className="py-3 px-2 font-bold text-emerald-400">92</td>
                      <td className="py-3 px-2 font-bold text-emerald-300">A+</td>
                      <td className="py-3 pl-2 font-bold text-white">4.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. TRANSCRIPTS & DOCUMENTS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'documents' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Official Electronic Transcripts & Academic Documents
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cryptographically watermarked official transcripts, enrollment attestation certificates, and clearance records.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleOpenAttestationLetter}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Official Letterhead Attestation</span>
                </button>

                <button
                  onClick={handleOpenTranscript}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-bold flex items-center gap-2 border border-slate-700 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Letterhead Transcript</span>
                </button>

                <button
                  onClick={handleOpenCourseSlip}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold flex items-center gap-2 border border-slate-700 transition cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Course Slip</span>
                </button>

                <button
                  onClick={handleOpenClearanceCertificate}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold flex items-center gap-2 border border-slate-700 transition cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Clearance Cert</span>
                </button>
              </div>
            </div>

            {attestationGenerated && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-bold block">Attestation Certificate Generated!</span>
                  <span className="text-[11px] text-emerald-200 font-normal">
                    Certificate verification hash: <code className="font-mono text-white">#APX-DOC-2026-99214</code>. Validated with official Registrar digital stamp.
                  </span>
                </div>
              </div>
            )}

            {/* Official Electronic Transcript Preview Card */}
            <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-2xl space-y-6 border-4 border-slate-200 relative overflow-hidden">
              
              {/* Official Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <GraduationCap className="w-96 h-96 text-slate-900" />
              </div>

              {/* Institution Official Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest font-black text-blue-700">
                    Apex Institute of Technology • Office of the Registrar
                  </span>
                  <h3 className="text-xl font-black tracking-tight text-slate-950">
                    OFFICIAL ACADEMIC TRANSCRIPT
                  </h3>
                  <p className="text-xs text-slate-600 font-mono">
                    Electronic Copy • Certified Senate Gazette Record
                  </p>
                </div>

                <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 flex items-center gap-3">
                  <QrCode className="w-12 h-12 text-slate-900" />
                  <div className="text-[10px] font-mono text-slate-700 space-y-0.5">
                    <span className="font-bold block">VERIFY AUTHENTICITY</span>
                    <span>Doc ID: #TRX-2026-084</span>
                    <span className="text-emerald-700 font-bold block">Status: VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Student Demographics Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono border-b border-slate-200 pb-4">
                <div>
                  <span className="text-slate-500 text-[10px] block">STUDENT NAME</span>
                  <span className="font-bold text-slate-950">{currentUser.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">MATRICULATION NO</span>
                  <span className="font-bold text-slate-950">{studentProfile.matricNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">PROGRAMME</span>
                  <span className="font-bold text-slate-950">{studentProfile.programme}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">FINAL CGPA</span>
                  <span className="font-black text-emerald-700 text-sm">{studentProfile.cgpa.toFixed(2)} / 4.00</span>
                </div>
              </div>

              {/* Semester by Semester Transcript Grid */}
              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-2">
                  <span className="font-bold text-slate-900 uppercase text-[11px] block border-b border-slate-300 pb-1">
                    Year 3 • First Semester 2026/2027
                  </span>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600 text-[10px] uppercase">
                        <th className="pb-1 pr-4">Course Code</th>
                        <th className="pb-1 pr-4">Course Title</th>
                        <th className="pb-1 px-2">Units</th>
                        <th className="pb-1 px-2">Score</th>
                        <th className="pb-1 px-2">Grade</th>
                        <th className="pb-1 pl-2">Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr>
                        <td className="py-1.5 font-bold">CSC301</td>
                        <td className="py-1.5">Data Structures & Algorithms in C++</td>
                        <td className="py-1.5 px-2">4</td>
                        <td className="py-1.5 px-2 font-bold">96</td>
                        <td className="py-1.5 px-2 font-bold text-emerald-700">A+</td>
                        <td className="py-1.5 pl-2 font-bold">4.00</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">CSC305</td>
                        <td className="py-1.5">Operating Systems & Architecture</td>
                        <td className="py-1.5 px-2">3</td>
                        <td className="py-1.5 px-2 font-bold">88</td>
                        <td className="py-1.5 px-2 font-bold text-emerald-700">A</td>
                        <td className="py-1.5 pl-2 font-bold">4.00</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">MAT201</td>
                        <td className="py-1.5">Linear Algebra & Numerical Methods</td>
                        <td className="py-1.5 px-2">3</td>
                        <td className="py-1.5 px-2 font-bold">84</td>
                        <td className="py-1.5 px-2 font-bold text-blue-700">B+</td>
                        <td className="py-1.5 pl-2 font-bold">3.50</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold">CSC309</td>
                        <td className="py-1.5">Database Management Systems</td>
                        <td className="py-1.5 px-2">3</td>
                        <td className="py-1.5 px-2 font-bold">91</td>
                        <td className="py-1.5 px-2 font-bold text-emerald-700">A+</td>
                        <td className="py-1.5 pl-2 font-bold">4.00</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex justify-end pt-1 text-[11px] font-bold text-slate-700">
                    Semester GPA: 3.88 • Total Semester Credits: 13 Units
                  </div>
                </div>
              </div>

              {/* Official Seal & Signature */}
              <div className="flex items-center justify-between pt-6 border-t-2 border-slate-900 text-xs font-mono">
                <div>
                  <span className="font-bold text-slate-950 block">Dr. Arthur Vance</span>
                  <span className="text-slate-600 text-[10px]">Registrar & Secretary to Senate</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-950 block">Date of Issuance: August 24, 2026</span>
                  <span className="text-emerald-700 font-bold text-[10px]">APEX UNIVERSITY OFFICIAL DIGITAL SEAL</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. FEES, INVOICES & RECEIPTS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'fees' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Bursary Ledger & Fee Payment Hub
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time invoice settlement and verified Bursary receipt issuance.
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-slate-400 block">Total Outstanding</span>
              <span className="text-emerald-400 font-black text-xl">$0.00 (Cleared)</span>
            </div>
          </div>

          <div className="space-y-4">
            {studentInvoices.map(inv => (
              <div key={inv.id} className="p-4 rounded-xl bg-slate-850 border border-slate-700 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{inv.title}</span>
                  <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/20">
                    {inv.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-slate-300">
                  <div>Amount: <strong className="text-white">${inv.amount}</strong></div>
                  <div>Paid: <strong className="text-emerald-400">${inv.paidAmount}</strong></div>
                  <div>Balance: <strong className="text-white">${inv.balance}</strong></div>
                  <div>Due Date: {inv.dueDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. CLEARANCE CHECKLIST TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'clearance' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Multi-Departmental Clearance Checklist
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live clearance status required for exam admission and transcript issuance.
            </p>
          </div>

          <div className="space-y-3">
            {clearanceItems.map(item => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-850 border border-slate-700/70 flex items-start gap-3 text-xs">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{item.department} CLEARANCE</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-300">{item.notes}</p>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Officer: {item.officerName} • Updated: {item.updatedAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. REQUESTS & PETITIONS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'requests' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Submit New Request Form */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" />
              Submit Official Student Request / Petition
            </h2>

            {isSubmitSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Request logged successfully and dispatched to Student Affairs review queue!</span>
              </div>
            )}

            <form onSubmit={handleRequestSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Request Category
                  </label>
                  <select
                    value={reqType}
                    onChange={e => setReqType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="OFFICIAL_TRANSCRIPT">Official Electronic Transcript</option>
                    <option value="COURSE_ADD_DROP">Course Add/Drop Late Waiver</option>
                    <option value="LEAVE_OF_ABSENCE">Leave of Absence Application</option>
                    <option value="HOSTEL_CHANGE">Hostel Room Transfer Request</option>
                    <option value="GRADE_RECHECK">Grade Re-mark / Senate Petition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of the request"
                    value={reqSubject}
                    onChange={e => setReqSubject(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Justification & Supporting Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide complete explanation, dates, and relevant details..."
                  value={reqDetails}
                  onChange={e => setReqDetails(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
                >
                  Submit Official Petition
                </button>
              </div>
            </form>
          </div>

          {/* Request History */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-white">Your Request & Petition History</h3>
            <div className="space-y-3">
              {studentRequests.map(req => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-700/70 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-slate-900 text-blue-300 border border-slate-700">
                        {req.type}
                      </span>
                      <span className="font-bold text-white text-sm">{req.subject}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : req.status === 'UNDER_REVIEW'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{req.details}</p>
                  {req.reviewRemarks && (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
                      <strong className="text-blue-300">Reviewer ({req.reviewedBy}):</strong> {req.reviewRemarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 10. ADMIN / MONITOR VIEW FOR STUDENT PORTAL */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'admin_monitor' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Student Portal Operational Monitor & Administration
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dedicated oversight for Student Portal Administrators and Monitors (e.g. Dr. Sarah Jenkins).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Active Student Logins</span>
              <div className="text-2xl font-black text-white font-mono">1,842</div>
              <span className="text-[10px] text-emerald-400">Live SSO sessions</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Pending Petitions</span>
              <div className="text-2xl font-black text-amber-400 font-mono">{studentRequests.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length}</div>
              <span className="text-[10px] text-slate-400">Queue processing time: 4.2 hrs</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Clearance Pass Rate</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">94.8%</div>
              <span className="text-[10px] text-slate-400">Exam admission ready</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: COURSE REGISTRATION SLIP */}
      {/* ------------------------------------------------------------- */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl p-6 space-y-5 border-4 border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-blue-700">Apex Institute of Technology</span>
                <h3 className="text-lg font-black text-slate-950">OFFICIAL COURSE REGISTRATION SLIP</h3>
                <p className="text-xs text-slate-600 font-mono">First Semester 2026/2027 Academic Session</p>
              </div>
              <QrCode className="w-12 h-12 text-slate-900" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono border-b border-slate-200 pb-3">
              <div>
                <span className="text-slate-500 text-[10px] block">STUDENT</span>
                <span className="font-bold">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">MATRIC NO</span>
                <span className="font-bold">{studentProfile.matricNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">PROGRAMME</span>
                <span className="font-bold">{studentProfile.programme}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">LEVEL</span>
                <span className="font-bold">{studentProfile.currentLevel}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase text-xs block">Enrolled Registered Modules</span>
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 text-[10px] uppercase">
                    <th className="pb-1 pr-4">Code</th>
                    <th className="pb-1 pr-4">Title</th>
                    <th className="pb-1 px-2">Units</th>
                    <th className="pb-1 px-2">Category</th>
                    <th className="pb-1 pl-2">Lecturer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {registeredCoursesList.filter(c => c.status === 'REGISTERED').map(c => (
                    <tr key={c.id}>
                      <td className="py-1 font-bold">{c.code}</td>
                      <td className="py-1">{c.title}</td>
                      <td className="py-1 px-2 font-bold">{c.creditUnits}</td>
                      <td className="py-1 px-2">{c.category}</td>
                      <td className="py-1 pl-2">{c.lecturer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end pt-2 text-xs font-bold text-slate-900 font-mono">
                Total Units Registered: {totalRegisteredCredits} Credit Units
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-2 border-slate-900 text-xs font-mono">
              <div>
                <span className="font-bold block">Advisor Signature: Dr. Marcus Henderson</span>
                <span className="text-emerald-700 font-bold">STATUS: ADVISOR APPROVED</span>
              </div>
              <button
                onClick={() => setShowSlipModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
