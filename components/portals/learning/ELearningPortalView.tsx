'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalDataLifecycleManager } from '@/components/common/PortalDataLifecycleManager';
import {
  BookOpenCheck,
  GraduationCap,
  Library,
  FileCheck2,
  HelpCircle,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileText,
  Upload,
  Lock,
  ChevronRight,
  User,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';

export function ELearningPortalView() {
  const {
    currentUser,
    activeNavTab,
    lmsCourses,
    activeLmsCourseId,
    setActiveLmsCourseId,
    submitAssignment,
    gradeSubmission,
    submitQuizAttempt,
    navigateToPortal
  } = useERP();

  // Active course
  const currentCourse = lmsCourses.find(c => c.id === activeLmsCourseId) || lmsCourses[0];
  const assignment = currentUser.portalAssignments.find(a => a.portalId === 'ELEARNING');
  const roleName = assignment ? assignment.roleName : 'LMS User';
  const isInstructor = assignment?.roleId === 'ROLE_LMS_INSTRUCTOR' || assignment?.roleId === 'ROLE_LMS_ADMIN';

  // Submission state
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('asg_csc301_01');
  const [uploadFileName, setUploadFileName] = useState('My_AVL_Tree_Solution_v2.zip');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Instructor Grading state
  const [gradingScore, setGradingScore] = useState<number>(95);
  const [gradingFeedback, setGradingFeedback] = useState<string>('Well-structured implementation. Solid Big-O analysis.');
  const [gradingError, setGradingError] = useState<string | null>(null);
  const [gradingSuccess, setGradingSuccess] = useState<string | null>(null);

  // Quiz state
  const [activeQuizId, setActiveQuizId] = useState<string>('qz_csc301_01');
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleUploadAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;
    submitAssignment(currentCourse.id, selectedAssignmentId, uploadFileName.trim());
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleGradeSubmit = (submissionId: string) => {
    setGradingError(null);
    setGradingSuccess(null);
    const success = gradeSubmission(
      currentCourse.id,
      selectedAssignmentId,
      submissionId,
      gradingScore,
      gradingFeedback
    );

    if (success) {
      setGradingSuccess(`Graded submission successfully! Recorded score ${gradingScore}/100.`);
    } else {
      setGradingError(
        `Course-Level RBAC Boundary Violation: You are logged in as '${currentUser.name}', but your instructor assignment scope is limited to assigned courses only. You cannot grade or modify '${currentCourse.code}'.`
      );
    }
  };

  const handleQuizSubmit = (quiz: any) => {
    let earned = 0;
    quiz.questions.forEach((q: any, idx: number) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        earned += q.points;
      }
    });
    setQuizScore(earned);
    setQuizSubmitted(true);
    submitQuizAttempt(currentCourse.id, quiz.id, earned);
  };

  return (
    <div className="space-y-6">
      
      {/* ------------------------------------------------------------- */}
      {/* Course Switcher Bar */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
              Active LMS Course Environment
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white">{currentCourse.code}: {currentCourse.title}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Lead: {currentCourse.leadInstructorName}
              </span>
            </div>
          </div>
        </div>

        {/* Switch active LMS Course */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Switch Course:</span>
          <select
            value={activeLmsCourseId}
            onChange={e => {
              setActiveLmsCourseId(e.target.value);
              setGradingError(null);
              setGradingSuccess(null);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {lmsCourses.map(crs => (
              <option key={crs.id} value={crs.id}>
                {crs.code} — {crs.title} ({crs.enrolledStudentsCount} Learners)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. LMS DASHBOARD */}
      {/* ------------------------------------------------------------- */}
      {(activeNavTab === 'dashboard' || !activeNavTab) && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Welcome Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Separate E-Learning Environment
                </span>
                <span className="text-xs text-slate-400 font-mono">Role: {roleName}</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                E-Learning & Interactive Curriculum Hub
              </h1>
              <p className="text-xs text-slate-300 max-w-xl">
                Dedicated learning environment with isolated course management, assignment dropboxes, online tests, and grading tools.
              </p>
            </div>

            {/* Cross-portal bridges */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigateToPortal('STUDENT')}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition group"
              >
                <GraduationCap className="w-4 h-4 text-white" />
                <span>Return to Student Portal</span>
              </button>

              <button
                onClick={() => navigateToPortal('ELIBRARY')}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition group"
              >
                <Library className="w-4 h-4 text-white" />
                <span>Search E-Library Resources</span>
              </button>
            </div>
          </div>

          {/* Course Modules & Lessons Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  Course Modules & Interactive Lessons ({currentCourse.code})
                </h3>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  {currentCourse.progressPercentage || 65}% Completed
                </span>
              </div>

              <div className="space-y-4">
                {currentCourse.modules.map(mod => (
                  <div key={mod.id} className="p-4 rounded-xl bg-slate-850 border border-slate-700/70 space-y-3">
                    <div className="font-bold text-sm text-slate-100 flex items-center justify-between">
                      <span>{mod.title}</span>
                      <span className="text-[11px] font-mono text-slate-400">{mod.lessons.length} Lessons</span>
                    </div>

                    <div className="space-y-2">
                      {mod.lessons.map(les => (
                        <div
                          key={les.id}
                          className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-200 block">{les.title}</span>
                              <span className="text-[11px] text-slate-400">{les.notesText}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                            <span className="text-slate-400">{les.durationMinutes} min</span>
                            {les.completed ? (
                              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" /> Done
                              </span>
                            ) : (
                              <span className="text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Incomplete</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments & Deadlines */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Active Assignments ({currentCourse.code})
              </h3>

              <div className="space-y-3">
                {currentCourse.assignments.map(asg => (
                  <div key={asg.id} className="p-3.5 rounded-xl bg-slate-850 border border-slate-700/70 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{asg.title}</span>
                      <span className="text-amber-400 font-mono font-bold text-[10px]">Due: {asg.dueDate}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{asg.description}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400">
                      <span>Max Points: <strong className="text-white">{asg.maxPoints}</strong></span>
                      <span>Weight: <strong className="text-emerald-400">{asg.weightPercentage}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ASSIGNMENTS & SUBMISSIONS */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'assignments' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-400" />
                  Assignment Dropbox & Version Locking ({currentCourse.code})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload assignment solutions with automated version tracking and post-submission immutability.
                </p>
              </div>
            </div>

            {uploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Assignment file uploaded and locked successfully! Submission version incremented.</span>
              </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleUploadAssignment} className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Select Assignment Target
                  </label>
                  <select
                    value={selectedAssignmentId}
                    onChange={e => setSelectedAssignmentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {currentCourse.assignments.map(asg => (
                      <option key={asg.id} value={asg.id}>
                        {asg.title} (Max: {asg.maxPoints} pts)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Upload Archive File (.ZIP, .PDF, .TAR.GZ)
                  </label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={e => setUploadFileName(e.target.value)}
                    placeholder="e.g. JohnDoe_STU00124_Solution.zip"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Files are automatically locked against tamper upon submission deadline.
                </span>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Submit & Lock File</span>
                </button>
              </div>
            </form>

            {/* Submissions Roster */}
            <div className="pt-4">
              <h3 className="text-sm font-bold text-white mb-3">Submitted Files in {currentCourse.code}</h3>
              <div className="space-y-2">
                {currentCourse.assignments.flatMap(a => a.submissions).map(sub => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{sub.studentName}</span>
                        <span className="font-mono text-[10px] text-slate-400">({sub.studentIdentifier})</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-emerald-300">
                          Version {sub.version}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-blue-300 flex items-center gap-2">
                        <span>{sub.fileName}</span>
                        <span className="text-slate-500">({sub.fileSize})</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right font-mono text-[11px] space-y-1">
                      {sub.status === 'GRADED' ? (
                        <div className="text-emerald-400 font-bold">
                          Score: {sub.grade} / {sub.maxScore} (Graded by {sub.gradedBy})
                        </div>
                      ) : (
                        <div className="text-amber-400 font-bold">Awaiting Instructor Grade</div>
                      )}
                      <div className="text-slate-500">Submitted: {sub.submittedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. INSTRUCTOR GRADING STUDIO (COURSE-LEVEL RBAC CHECK) */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'grading' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Instructor Grading Studio & Course-Level RBAC Enforcer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Course Instructors may only grade courses assigned in their teaching scope (e.g. Dr. Henderson can grade CSC301, but NOT MAT201).
            </p>
          </div>

          {/* Diagnostic Messages */}
          {gradingError && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/80 text-rose-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>RBAC Security Intercept Triggered</span>
              </div>
              <p className="leading-relaxed font-mono">{gradingError}</p>
            </div>
          )}

          {gradingSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{gradingSuccess}</span>
            </div>
          )}

          {/* Submissions List for Current Course */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Course: <strong className="text-white">{currentCourse.code}</strong></span>
              <span>Lead Instructor: <strong className="text-white">{currentCourse.leadInstructorName}</strong></span>
            </div>

            {currentCourse.assignments.flatMap(a => a.submissions).length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-850 text-center text-xs text-slate-400">
                No submissions currently pending grading in {currentCourse.code}.
              </div>
            ) : (
              currentCourse.assignments.flatMap(a => a.submissions).map(sub => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-2.5 text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">{sub.studentName}</span>
                      <span className="font-mono text-slate-400 ml-2">({sub.studentIdentifier})</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">File: {sub.fileName} ({sub.fileSize})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Awarded Score (Max 100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gradingScore}
                        onChange={e => setGradingScore(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Instructor Feedback & Rubric Remarks
                      </label>
                      <input
                        type="text"
                        value={gradingFeedback}
                        onChange={e => setGradingFeedback(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => handleGradeSubmit(sub.id)}
                        className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        Submit Grade
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. QUIZZES & ASSESSMENTS */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'quizzes' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Interactive LMS Quiz & Question Bank ({currentCourse.code})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Timed self-assessments with instant automated grading and conceptual feedback explanations.
            </p>
          </div>

          {currentCourse.quizzes.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-850 rounded-xl">
              No active quizzes published for {currentCourse.code}.
            </div>
          ) : (
            currentCourse.quizzes.map(qz => (
              <div key={qz.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white">{qz.title}</h3>
                  <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
                    <span>Time Limit: {qz.timeLimitMinutes} min</span>
                    <span>Total Points: {qz.totalPoints}</span>
                  </div>
                </div>

                {quizSubmitted && quizScore !== null && (
                  <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm block">Quiz Completed!</span>
                      <span>Your Score: {quizScore} / {qz.totalPoints} points (100%)</span>
                    </div>
                    <button
                      onClick={() => setQuizSubmitted(false)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs"
                    >
                      Retake Quiz
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {qz.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3 text-xs">
                      <div className="font-bold text-slate-100 flex items-start gap-2">
                        <span className="text-emerald-400 font-mono">Q{idx + 1}.</span>
                        <span>{q.question} ({q.points} pts)</span>
                      </div>

                      <div className="space-y-1.5 pl-5">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = selectedAnswers[q.id] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                if (!quizSubmitted) {
                                  setSelectedAnswers(prev => ({ ...prev, [q.id]: oIdx }));
                                }
                              }}
                              className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${
                                isSelected
                                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200 font-semibold'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                          <strong className="text-emerald-400">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!quizSubmitted && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleQuizSubmit(qz)}
                      className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                    >
                      Submit Quiz for Grading
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4.5. LMS DATA LIFECYCLE & CONTENT MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'data_lifecycle' && (
        <PortalDataLifecycleManager
          portalId="ELEARNING"
          allowedEntityTypes={['ASSIGNMENT', 'QUESTION_BANK', 'COURSE']}
          title="e-Learning Content & Assessment Lifecycle"
          subtitle="Manage drafts, assignments, question bank datasets, and course module lifecycle with versioning and batch exports."
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. LMS MONITOR & TELEMETRY */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'analytics' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              LMS Monitor & Telemetry Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Read-only operational oversight of student engagement, assignment throughput, and active test sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Active Learners in {currentCourse.code}</span>
              <div className="text-2xl font-black text-white font-mono">{currentCourse.enrolledStudentsCount}</div>
              <span className="text-[10px] text-emerald-400">92% completion on Module 1</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Assignment Turn-in Rate</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">90.6%</div>
              <span className="text-[10px] text-slate-400">58 / 64 submitted</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Average Quiz Score</span>
              <div className="text-2xl font-black text-blue-400 font-mono">94.2%</div>
              <span className="text-[10px] text-slate-400">Normal distribution bell curve</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
