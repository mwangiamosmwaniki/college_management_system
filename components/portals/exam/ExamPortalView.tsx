'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalDataLifecycleManager } from '@/components/common/PortalDataLifecycleManager';
import {
  Award,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  ChevronRight,
  ShieldCheck,
  Download,
  Activity,
  UserCheck,
  FileCheck2,
  Users,
  Eye,
  Sliders,
  AlertCircle,
  Clock,
  Printer,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export function ExamPortalView() {
  const {
    currentUser,
    activeNavTab,
    studentCourses,
    studentProfile,
    publishCrossPortalEvent,
    publishRegistrar,
    moderateCourseMarks,
    openInstitutionalDocument
  } = useERP();

  const assignment = currentUser.portalAssignments.find(a => a.portalId === 'EXAMINATIONS');
  const roleName = assignment ? assignment.roleName : 'Examinations Officer';

  const [selectedCourse, setSelectedCourse] = useState('CSC301');
  const [gazetteSuccess, setGazetteSuccess] = useState(false);
  const [moderationApproved, setModerationApproved] = useState(false);
  const [marksSubmitted, setMarksSubmitted] = useState(false);
  const [malpracticeReported, setMalpracticeReported] = useState<string | null>(null);

  const handleOpenSenateBroadsheet = () => {
    openInstitutionalDocument({
      title: `OFFICIAL SENATE EXAMINATION BROADSHEET — ${selectedCourse}`,
      documentNumber: `SEN-BDS-${selectedCourse}-2026`,
      date: 'August 24, 2026',
      recipientName: 'Senate Committee on Academic Standards & Examination Gazette',
      recipientId: 'SENATE-COMM-2026',
      recipientDept: 'Faculty of Computing & Mathematical Sciences',
      metadata: {
        'Course Code & Title': `${selectedCourse} (Academic Session 2026/2027)`,
        'Chief Examiner': 'Prof. Walter Sterling (Chair, Department of Computing)',
        'External Assessor': 'Prof. E. A. Balogun, Ph.D (Univ. of Cambridge)',
        'Statistical Dispersion': 'Normal Bell Distribution (σ = 8.42, Optimal)',
        'Moderation Status': 'APPROVED BY EXTERNAL EXAMINERS',
        'Senate Ratification': 'PASSED & SEALED IN SENATE RECORD'
      },
      bodyParagraphs: [
        `The Chief Examiner and Examination Board hereby present the verified and moderated continuous assessment and terminal examination results for course ${selectedCourse}.`,
        `All scripts, question moderations, continuous assessments (30%), midterms (20%), and final examinations (50%) have been vetted in strict adherence to Academic Quality Assurance standards.`
      ],
      tableData: {
        headers: ['Matric No', 'Candidate Name', 'CA (30)', 'Midterm (20)', 'Exam (50)', 'Total', 'Grade', 'Status'],
        rows: marksRecords.map(r => {
          const total = Number(r.ca) + Number(r.midterm) + Number(r.exam);
          const g = calculateGrade(total);
          return [
            r.matric,
            r.name,
            r.ca.toFixed(1),
            r.midterm.toFixed(1),
            r.exam.toFixed(1),
            total.toFixed(1),
            g.grade,
            r.cleared ? 'CLEARED' : 'FEE HOLD'
          ];
        })
      },
      signatoryTitle: 'Chairman of Senate & Vice Chancellor',
      signatoryName: 'Prof. Evelyn Reed, Ph.D, FNAS',
      status: 'VERIFIED',
      verificationHash: `APX-SENATE-BDS-${selectedCourse}-2026-SEALED`
    });
  };

  // Student marks state for interactive entry
  const [marksRecords, setMarksRecords] = useState([
    { id: 'STU-2026-00124', name: 'Prof. Walter Sterling', matric: 'MAT/2026/0124', ca: 28.5, midterm: 18.0, exam: 46.5, cleared: true },
    { id: 'STU-2026-00125', name: 'Sophia Chen', matric: 'MAT/2026/0125', ca: 27.0, midterm: 16.5, exam: 44.0, cleared: true },
    { id: 'STU-2026-00126', name: 'Liam Davies', matric: 'MAT/2026/0126', ca: 24.0, midterm: 14.0, exam: 39.5, cleared: true },
    { id: 'STU-2026-00127', name: 'Amara Okafor', matric: 'MAT/2026/0127', ca: 29.0, midterm: 19.5, exam: 48.0, cleared: true },
    { id: 'STU-2026-00128', name: 'David K. Osei', matric: 'MAT/2026/0128', ca: 21.0, midterm: 12.0, exam: 32.0, cleared: false },
  ]);

  const calculateGrade = (total: number) => {
    if (total >= 70) return { grade: 'A', gpa: 5.0, status: 'First Class / Distinction' };
    if (total >= 60) return { grade: 'B', gpa: 4.0, status: 'Very Good' };
    if (total >= 50) return { grade: 'C', gpa: 3.0, status: 'Credit' };
    if (total >= 45) return { grade: 'D', gpa: 2.0, status: 'Pass' };
    return { grade: 'F', gpa: 0.0, status: 'Fail / Resit' };
  };

  const handleUpdateMark = (id: string, field: 'ca' | 'midterm' | 'exam', value: number) => {
    setMarksRecords(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const updated = { ...r, [field]: value };
        return updated;
      })
    );
  };

  const handleGazette = () => {
    setGazetteSuccess(true);
    publishRegistrar('WF_CSC301');
    publishCrossPortalEvent(
      'SENATE_MARKS_GAZETTED',
      'EXAMINATIONS',
      ['STUDENT', 'LECTURER', 'ADMIN'],
      { course: selectedCourse, status: 'GAZETTED_AND_SEALED' },
      `Senate officially gazetted results for ${selectedCourse}`
    );
    setTimeout(() => setGazetteSuccess(false), 4000);
  };

  const handleApproveModeration = () => {
    setModerationApproved(true);
    moderateCourseMarks('WF_CSC301', 'Marking guides and sample scripts moderated with high objectivity.');
    setTimeout(() => setModerationApproved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-red-950/70 border border-rose-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Examinations, Marks & Senate Gazetting
          </h1>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Senate Moderation State</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">APPROVED & SEALED</span>
        </div>
      </div>

      {gazetteSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Course broadsheet verified and signed off for Senate publication! Students can now view their official results.</span>
        </div>
      )}

      {moderationApproved && (
        <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>External moderation review signed off! Mark sheets forwarded to Registrar Secretariat.</span>
        </div>
      )}

      {/* ============================================================= */}
      {/* 1. EXAM BOARD DASHBOARD */}
      {/* ============================================================= */}
      {(activeNavTab === 'dashboard' || !activeNavTab) && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Registered Candidates</span>
              <div className="text-white text-xl font-bold">1,420</div>
              <span className="text-emerald-400 text-[10px]">100% Biometrics Enrolled</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Course Marksheets In</span>
              <div className="text-white text-xl font-bold">48 / 50 Courses</div>
              <span className="text-amber-400 text-[10px]">96% Completed</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Moderation Pass Rate</span>
              <div className="text-emerald-400 text-xl font-bold">92.4%</div>
              <span className="text-slate-400 text-[10px]">Within Senate Bounds</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Senate Gazette Hash</span>
              <div className="text-blue-400 text-xs font-bold truncate">0x9F4B...72A1</div>
              <span className="text-emerald-400 text-[10px]">Cryptographically Sealed</span>
            </div>
          </div>

          {/* Quick Shortcuts & Pipeline Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-rose-400" />
                Examinations Governance Lifecycle
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex items-center justify-between text-emerald-300">
                  <span>1. Lecturer Marks Submission</span>
                  <strong className="text-emerald-400">DONE (48/50)</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex items-center justify-between text-emerald-300">
                  <span>2. Departmental Moderation</span>
                  <strong className="text-emerald-400">PASSED</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 flex items-center justify-between text-emerald-300">
                  <span>3. External Examiner Vetting</span>
                  <strong className="text-emerald-400">SEALED</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-800/40 flex items-center justify-between text-blue-300">
                  <span>4. Senate Broadsheet Gazetting</span>
                  <strong className="text-blue-400">READY</strong>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3 md:col-span-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Academic Performance Curve & Grade Distribution
              </h3>
              <div className="grid grid-cols-5 gap-2 pt-2 text-center text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-bold text-base">32%</span>
                  <div className="text-slate-400 text-[10px]">Grade A (70-100)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                  <span className="text-blue-400 font-bold text-base">41%</span>
                  <div className="text-slate-400 text-[10px]">Grade B (60-69)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold text-base">18%</span>
                  <div className="text-slate-400 text-[10px]">Grade C (50-59)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                  <span className="text-orange-400 font-bold text-base">6%</span>
                  <div className="text-slate-400 text-[10px]">Grade D (45-49)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                  <span className="text-rose-400 font-bold text-base">3%</span>
                  <div className="text-slate-400 text-[10px]">Grade F (&lt;45)</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Curvature adheres to standard university Gaussian distribution guidelines with 97% overall course pass rate.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* 2. LECTURER MARKS ENTRY */}
      {/* ============================================================= */}
      {activeNavTab === 'marks_entry' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-rose-400" />
                  Continuous Assessment & Examination Marks Entry Studio
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Input scores for Continuous Assessment (30%), Mid-term (20%), and Final Examination (50%). Live grade computation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedCourse}
                  onChange={e => setSelectedCourse(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none"
                >
                  <option value="CSC301">CSC301 — Data Structures</option>
                  <option value="CSC305">CSC305 — Operating Systems</option>
                  <option value="MAT201">MAT201 — Linear Algebra</option>
                </select>

                <button
                  onClick={() => {
                    setMarksSubmitted(true);
                    setTimeout(() => setMarksSubmitted(false), 3000);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-sm"
                >
                  Lock & Submit Marks
                </button>
              </div>
            </div>

            {marksSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Mark sheet for {selectedCourse} saved and locked for Moderation Review!</span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-950/60 border-y border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Student ID & Matric</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">CA Score (30)</th>
                    <th className="py-3 px-4">Midterm (20)</th>
                    <th className="py-3 px-4">Final Exam (50)</th>
                    <th className="py-3 px-4">Total (100)</th>
                    <th className="py-3 px-4">Grade / GPA</th>
                    <th className="py-3 px-4">Exam Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {marksRecords.map(r => {
                    const total = Math.min(100, Math.max(0, Number(r.ca) + Number(r.midterm) + Number(r.exam)));
                    const gradeInfo = calculateGrade(total);
                    return (
                      <tr key={r.id} className="hover:bg-slate-850">
                        <td className="py-3 px-4">
                          <div className="font-bold text-blue-400">{r.matric}</div>
                          <div className="text-[10px] text-slate-500">{r.id}</div>
                        </td>
                        <td className="py-3 px-4 font-sans font-medium text-white">{r.name}</td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            max="30"
                            step="0.5"
                            value={r.ca}
                            onChange={e => handleUpdateMark(r.id, 'ca', parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-xs text-center focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={r.midterm}
                            onChange={e => handleUpdateMark(r.id, 'midterm', parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-xs text-center focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            step="0.5"
                            value={r.exam}
                            onChange={e => handleUpdateMark(r.id, 'exam', parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-xs text-center focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                        </td>
                        <td className="py-3 px-4 font-bold text-white text-sm">
                          {total.toFixed(1)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                            gradeInfo.grade === 'A'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : gradeInfo.grade === 'B'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : gradeInfo.grade === 'C'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {gradeInfo.grade} ({gradeInfo.gpa.toFixed(1)})
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                            r.cleared
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}>
                            {r.cleared ? 'Cleared' : 'Fee Hold'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 3. MODERATION REVIEW */}
      {/* ============================================================= */}
      {activeNavTab === 'moderation' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  Departmental & External Examiner Moderation
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review statistical dispersion, anomalous high/low score flags, and sign off external examiner vetting.
                </p>
              </div>

              <button
                onClick={handleApproveModeration}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign Off Moderation Approval</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">External Examiner</span>
                <div className="text-white text-sm font-bold">Prof. E. A. Balogun, Ph.D</div>
                <p className="text-[11px] text-slate-400">External Assessor, University of Cambridge</p>
                <span className="text-emerald-400 font-bold block">Status: Verified & Vetted</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">Standard Deviation</span>
                <div className="text-white text-sm font-bold">σ = 8.42 (Optimal)</div>
                <p className="text-[11px] text-slate-400">Normal distribution bell curve observed</p>
                <span className="text-emerald-400 font-bold block">No Grade Inflation Detected</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">Outlier Analysis</span>
                <div className="text-white text-sm font-bold">0 Statistical Anomalies</div>
                <p className="text-[11px] text-slate-400">All student papers cross-marked</p>
                <span className="text-blue-400 font-bold block">Ready for Senate Broadsheet</span>
              </div>
            </div>

            {/* Moderation Notes & Signatures */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-white block">External Examiner Formal Report:</span>
              <p className="text-slate-300 leading-relaxed">
                &ldquo;The examination questions for {selectedCourse} comprehensively covered the syllabus outcomes. Marking guides and sample scripts were properly moderated and marked with commendable objectivity. I recommend full approval by Senate.&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800">
                <span>Vetted on: 24th August 2026</span>
                <span className="text-emerald-400 font-semibold">Digital Certificate ID: EXT-EXAM-MOD-8821</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 4.5. EXAM RESULTS & SENATE LIFECYCLE */}
      {/* ============================================================= */}
      {activeNavTab === 'data_lifecycle' && (
        <PortalDataLifecycleManager
          portalId="EXAMINATIONS"
          allowedEntityTypes={['EXAM_RESULT', 'GRADE_CHANGE_REQUEST', 'COURSE']}
          title="Examination Broadsheets & Grade Governance"
        />
      )}

      {/* ============================================================= */}
      {/* 4. SENATE APPROVAL & GAZETTE */}
      {/* ============================================================= */}
      {(activeNavTab === 'approvals' || activeNavTab === 'senate') && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-rose-400" />
                  Senate Master Broadsheet ({selectedCourse})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified scores breakdown across Continuous Assessment (CA 30%), Midterms (20%), and Final Examination (50%).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedCourse}
                  onChange={e => setSelectedCourse(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none"
                >
                  <option value="CSC301">CSC301 — Data Structures</option>
                  <option value="CSC305">CSC305 — Operating Systems</option>
                  <option value="MAT201">MAT201 — Linear Algebra</option>
                </select>

                <button
                  onClick={handleOpenSenateBroadsheet}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Letterhead Broadsheet</span>
                </button>

                <button
                  onClick={handleGazette}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Sign Off Broadsheet
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-950/60 border-y border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">CA (30)</th>
                    <th className="py-3 px-4">Midterm (20)</th>
                    <th className="py-3 px-4">Final Exam (50)</th>
                    <th className="py-3 px-4">Total (100)</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Exam Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {marksRecords.map(r => {
                    const total = Number(r.ca) + Number(r.midterm) + Number(r.exam);
                    const gradeInfo = calculateGrade(total);
                    return (
                      <tr key={r.id} className="hover:bg-slate-850">
                        <td className="py-3 px-4 font-bold text-blue-400">{r.matric}</td>
                        <td className="py-3 px-4 font-sans font-medium text-white">{r.name}</td>
                        <td className="py-3 px-4 text-slate-300">{r.ca.toFixed(1)}</td>
                        <td className="py-3 px-4 text-slate-300">{r.midterm.toFixed(1)}</td>
                        <td className="py-3 px-4 text-slate-300">{r.exam.toFixed(1)}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400 text-sm">{total.toFixed(1)}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400 text-sm">{gradeInfo.grade}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                            r.cleared
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}>
                            {r.cleared ? 'Cleared' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. EXAMINATION MONITOR */}
      {/* ============================================================= */}
      {activeNavTab === 'monitor' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-400" />
                  Live Exam Hall Biometric Telemetry & Security Stream
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time invigilation telemetry, biometrics verification throughput, and malpractice audit logs.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                12 Exam Halls Live
              </span>
            </div>

            {malpracticeReported && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{malpracticeReported}</span>
              </div>
            )}

            {/* Live Hall Feeds */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Central Hall A (Computing)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-slate-400">Chief Invigilator: Dr. O. K. Johnson</div>
                <div className="text-white">Candidates Seated: <strong className="text-emerald-400">180 / 180</strong></div>
                <div className="text-[11px] text-slate-400">CCTV Stream: ACTIVE • Biometric: OK</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Auditorium B (Sciences)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-slate-400">Chief Invigilator: Prof. H. Adeleke</div>
                <div className="text-white">Candidates Seated: <strong className="text-emerald-400">320 / 320</strong></div>
                <div className="text-[11px] text-slate-400">CCTV Stream: ACTIVE • Biometric: OK</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Engineering Lab 3 (CBT)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-slate-400">Chief Invigilator: Engr. M. Bello</div>
                <div className="text-white">Active CBT Sessions: <strong className="text-blue-400">95 Terminals</strong></div>
                <div className="text-[11px] text-slate-400">Network Latency: 4ms • Lockdown Browser: ON</div>
              </div>
            </div>

            {/* Quick Action Incident Logger */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white block">Rapid Malpractice & Anomaly Dispatch</span>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter Student Matric No or Hall Seat (e.g. MAT/2026/0128 - Hall A Seat 42)"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setMalpracticeReported('Incident logged. Chief Security Officer & Senate Disciplinary Committee alerted.');
                    setTimeout(() => setMalpracticeReported(null), 4000);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shrink-0"
                >
                  Flag Malpractice Incident
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
