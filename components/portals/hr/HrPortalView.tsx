'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalDataLifecycleManager } from '@/components/common/PortalDataLifecycleManager';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Calendar,
  DollarSign,
  FileText,
  Building,
  Search,
  Plus,
  Filter,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Award,
  Clock,
  Send,
  Check
} from 'lucide-react';

export function HrPortalView() {
  const { currentUser, activeNavTab, publishCrossPortalEvent } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const [staffList, setStaffList] = useState([
    { id: 'STF-001', name: 'Dr. Marcus Henderson', title: 'Associate Professor & HOD', dept: 'School of Computing', grade: 'CONUASS 6/4', status: 'Active', tenure: '6 Years', leaveBalance: 24 },
    { id: 'STF-002', name: 'Karen Vance', title: 'Senior Circulation Librarian', dept: 'University Library Services', grade: 'CONTISS 11/2', status: 'Active', tenure: '4 Years', leaveBalance: 30 },
    { id: 'STF-003', name: 'Prof. Julian Sterling', title: 'Chair of Senate Examination Board', dept: 'Academic Affairs', grade: 'CONUASS 7/8', status: 'Active', tenure: '12 Years', leaveBalance: 15 },
    { id: 'STF-004', name: 'Dr. Sarah Jenkins', title: 'Dean of Student Affairs', dept: 'Student Services', grade: 'CONUASS 6/7', status: 'Active', tenure: '8 Years', leaveBalance: 18 },
    { id: 'STF-005', name: 'Engr. Michael Bello', title: 'Senior Lecturer, Hardware Systems', dept: 'Electrical Engineering', grade: 'CONUASS 5/3', status: 'Active', tenure: '5 Years', leaveBalance: 22 },
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LEV-2026-091', staffName: 'Dr. Marcus Henderson', type: 'Sabbatical Research Leave', duration: '6 Months', startDate: '2026-10-01', status: 'PENDING_APPROVAL', destination: 'MIT CSAIL Lab' },
    { id: 'LEV-2026-092', staffName: 'Karen Vance', type: 'Annual Vacation Leave', duration: '14 Days', startDate: '2026-09-15', status: 'APPROVED', destination: 'Local' },
    { id: 'LEV-2026-093', staffName: 'Engr. Michael Bello', type: 'Conference & Study Leave', duration: '5 Days', startDate: '2026-09-02', status: 'PENDING_APPROVAL', destination: 'IEEE Robotics Tokyo' },
  ]);

  const [payrollBatches, setPayrollBatches] = useState([
    { id: 'PAY-2026-08', month: 'August 2026', totalStaff: 420, grossTotal: 1480000, deductions: 296000, netTotal: 1184000, status: 'DISPATCHED_TO_TREASURY' },
    { id: 'PAY-2026-09', month: 'September 2026 (Upcoming)', totalStaff: 420, grossTotal: 1480000, deductions: 296000, netTotal: 1184000, status: 'PREPARING_BATCH' },
  ]);

  const handleApproveLeave = (levId: string) => {
    setLeaveRequests(prev =>
      prev.map(l => (l.id === levId ? { ...l, status: 'APPROVED' } : l))
    );
    setFeedbackMessage(`Leave request ${levId} approved by HR Directorate! Notice dispatched.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleDispatchPayroll = (batchId: string) => {
    setPayrollBatches(prev =>
      prev.map(b => (b.id === batchId ? { ...b, status: 'DISPATCHED_TO_TREASURY' } : b))
    );

    publishCrossPortalEvent(
      'PAYROLL_BATCH_DISPATCHED',
      'HR',
      ['FINANCE', 'ADMIN'],
      { batchId, amount: 1184000 },
      `Monthly payroll batch ${batchId} computed and dispatched to Bursary Treasury`
    );

    setFeedbackMessage(`Payroll batch ${batchId} computed and dispatched to Bursary Treasury!`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const filteredStaff = staffList.filter(s => {
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDeptFilter === 'ALL' || s.dept.includes(selectedDeptFilter);
    return matchesQuery && matchesDept;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/70 via-slate-900 to-cyan-950/70 border border-teal-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Staff & Faculty
            </span>
            <span className="text-xs text-slate-400 font-mono">HR Domain Isolation</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Human Resources & Faculty Appointments
          </h1>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Total Staff Headcount</span>
          <span className="text-xl font-black text-teal-400 font-mono">420 Faculty & Staff</span>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* ============================================================= */}
      {/* 1. HR DASHBOARD */}
      {/* ============================================================= */}
      {(activeNavTab === 'dashboard' || !activeNavTab) && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Academic Faculty</span>
              <div className="text-white text-xl font-bold">260 Staff</div>
              <span className="text-teal-400 text-[10px]">Professors & Lecturers</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Non-Academic Staff</span>
              <div className="text-white text-xl font-bold">160 Staff</div>
              <span className="text-blue-400 text-[10px]">Administrative & Tech</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Active On Leave</span>
              <div className="text-amber-400 text-xl font-bold">
                {leaveRequests.filter(l => l.status === 'APPROVED').length} Approved
              </div>
              <span className="text-slate-400 text-[10px]">Sabbatical & Vacation</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Monthly Net Payroll</span>
              <div className="text-emerald-400 text-xl font-bold">$1.18M</div>
              <span className="text-slate-400 text-[10px]">Automated Treasury Link</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-400" />
                Departmental Faculty Distribution
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-300">School of Computing & Data Science</span>
                    <span className="text-teal-400 font-bold">84 Professors & Lecturers</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-300">School of Engineering</span>
                    <span className="text-blue-400 font-bold">92 Engineering Faculty</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-300">University Library Services</span>
                    <span className="text-purple-400 font-bold">28 Professional Librarians</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Tenure & Promotion Pipeline
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Appraisal dossiers reviewed by University Appointments and Promotions Committee (A&PC).
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 flex justify-between text-teal-300">
                  <span>Professorial Chairs</span>
                  <strong>38 Chairs</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 flex justify-between text-blue-300">
                  <span>Associate Professors</span>
                  <strong>46 Staff</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 flex justify-between text-slate-300">
                  <span>Senior Lecturers</span>
                  <strong>82 Staff</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 1.5. HR STAFF DATA & APPOINTMENT LIFECYCLE */}
      {/* ============================================================= */}
      {activeNavTab === 'data_lifecycle' && (
        <PortalDataLifecycleManager
          portalId="HR"
          allowedEntityTypes={['LECTURER']}
          title="HR Staff Directory & Contract Lifecycle"
        />
      )}

      {/* ============================================================= */}
      {/* 2. ACADEMIC & ADMIN STAFF */}
      {/* ============================================================= */}
      {activeNavTab === 'staff' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  Academic & Administrative Staff Directory
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspect faculty rank titles, tenure tracking, salary scales, and departmental allocations.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search staff name or department..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-950/60 border-y border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Staff ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Appointment Title</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Salary Scale</th>
                    <th className="py-3 px-4">Tenure</th>
                    <th className="py-3 px-4">Leave Balance</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {filteredStaff.map(s => (
                    <tr key={s.id} className="hover:bg-slate-850">
                      <td className="py-3 px-4 font-bold text-blue-400">{s.id}</td>
                      <td className="py-3 px-4 font-sans font-medium text-white">{s.name}</td>
                      <td className="py-3 px-4 text-slate-300 font-sans">{s.title}</td>
                      <td className="py-3 px-4 text-slate-400 font-sans">{s.dept}</td>
                      <td className="py-3 px-4 text-teal-400 font-bold">{s.grade}</td>
                      <td className="py-3 px-4 text-slate-400">{s.tenure}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{s.leaveBalance} Days</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-sans font-bold">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 3. LEAVE APPLICATIONS */}
      {/* ============================================================= */}
      {activeNavTab === 'leaves' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  Faculty Leave Administration & Sabbatical Workflow
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Approve sabbatical research, annual vacations, study leaves, and track duty relief coverage.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {leaveRequests.filter(l => l.status === 'PENDING_APPROVAL').length} Pending Approvals
              </span>
            </div>

            <div className="space-y-3">
              {leaveRequests.map(l => (
                <div
                  key={l.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{l.staffName}</span>
                      <span className="font-mono text-[10px] text-blue-400">({l.id})</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        l.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {l.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Type: <strong className="text-slate-300">{l.type}</strong> • Duration: {l.duration} • Starts: {l.startDate} • Location: {l.destination}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {l.status !== 'APPROVED' ? (
                      <button
                        onClick={() => handleApproveLeave(l.id)}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        Approve Leave & Relief
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Approved & Recorded
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 4. PAYROLL PROCESSING BATCHES */}
      {/* ============================================================= */}
      {activeNavTab === 'payroll' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-teal-400" />
                  Monthly Payroll Computation & Treasury Dispatch
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated computation of consolidated salary grades, tax withholdings, pensions, and Bursary treasury schedules.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PITA & Pension Compliant
              </span>
            </div>

            <div className="space-y-4">
              {payrollBatches.map(b => (
                <div
                  key={b.id}
                  className="p-5 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                    <div>
                      <span className="font-bold text-white text-sm">{b.month}</span>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Batch: <strong className="text-blue-300">{b.id}</strong> • Enrolled Staff: {b.totalStaff}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
                      b.status === 'DISPATCHED_TO_TREASURY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 font-mono">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Gross Earnings</span>
                      <div className="text-white font-bold text-sm">${b.grossTotal.toLocaleString()}.00</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Statutory Deductions</span>
                      <div className="text-rose-400 font-bold text-sm">-${b.deductions.toLocaleString()}.00</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Net Pay Disbursed</span>
                      <div className="text-emerald-400 font-bold text-sm">${b.netTotal.toLocaleString()}.00</div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">Bank direct-debit batch XML generated</span>
                    {b.status !== 'DISPATCHED_TO_TREASURY' && (
                      <button
                        onClick={() => handleDispatchPayroll(b.id)}
                        className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        Compute & Dispatch to Bursary
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. HR OPERATIONAL MONITOR */}
      {/* ============================================================= */}
      {activeNavTab === 'monitor' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-400" />
                  HR Operations & Faculty Telemetry
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time clock-in biometric telemetry, faculty attendance ratios, and compliance audit trail.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Clock-in System: ONLINE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">Biometric Presence</span>
                <div className="text-emerald-400 text-base font-bold">96.8% Present Today</div>
                <p className="text-[11px] text-slate-400">407 / 420 Staff Clocked In</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">Retirement Forecast</span>
                <div className="text-white text-base font-bold">8 Staff Due in 2026/27</div>
                <p className="text-[11px] text-slate-400">Succession planning active</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">Cross-Portal HR Events</span>
                <div className="text-teal-300 text-base font-bold">100% Broadcast Sync</div>
                <p className="text-[11px] text-slate-400">Payroll to Finance pipeline active</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
