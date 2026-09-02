'use client';

import React, { useState } from 'react';
import {
  Building,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Calendar,
  Layers,
  Award,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { useERP } from '@/context/erp-context';
import {
  INITIAL_DEPARTMENT_CURRICULA,
  INITIAL_LECTURER_ALLOCATIONS,
  INITIAL_STUDENT_MASTER_RECORDS
} from '@/lib/kenyan-tvet-data';
import { DepartmentCurriculum, LecturerUnitAllocation } from '@/types/erp';

export default function HODPortalView() {
  const { institutionalSettings, openInstitutionalDocument, currentUser } = useERP();

  const [activeTab, setActiveTab] = useState<'CURRICULUM' | 'ALLOCATION' | 'MODERATION' | 'TIMETABLE'>('CURRICULUM');
  const [selectedCurriculum, setSelectedCurriculum] = useState<DepartmentCurriculum>(INITIAL_DEPARTMENT_CURRICULA[0]);
  const [allocations, setAllocations] = useState<LecturerUnitAllocation[]>(INITIAL_LECTURER_ALLOCATIONS);

  // New allocation modal state
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [newAlloc, setNewAlloc] = useState({
    unitCode: 'DICT 101',
    unitName: 'Computer Programming with C++',
    lecturerName: 'Dr. Marcus Henderson',
    term: 'Term 1 2026',
    weeklyHours: 4
  });

  const handleCreateAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    const created: LecturerUnitAllocation = {
      id: 'alloc_' + Date.now(),
      lecturerId: 'usr_dr_henderson',
      lecturerName: newAlloc.lecturerName,
      unitCode: newAlloc.unitCode,
      unitName: newAlloc.unitName,
      departmentId: selectedCurriculum.departmentId,
      academicYear: '2026/2027',
      term: newAlloc.term,
      weeklyHours: newAlloc.weeklyHours,
      assignedByHodId: currentUser.id,
      assignedAt: new Date().toISOString().split('T')[0]
    };
    setAllocations(prev => [created, ...prev]);
    setIsAllocateModalOpen(false);
  };

  const handlePrintCurriculum = (curr: DepartmentCurriculum) => {
    openInstitutionalDocument({
      docType: 'CURRICULUM_STRUCTURE',
      title: `${curr.programmeName} — Department Syllabus Structure`,
      subtitle: `Examining Body: ${curr.examiningBody} • Qualification Level: ${curr.qualificationLevel}`,
      recipientName: `Department of ${curr.departmentName}`,
      issueDate: new Date().toISOString().split('T')[0],
      academicSession: '2026/2027 Session',
      contentBody: `Official curricular unit breakdown for ${curr.programmeName} (${curr.programmeCode}). Includes core technical units, practical workshop laboratories, and industrial attachment prerequisites approved by the Academic Board.`,
      tableData: {
        headers: ['Unit Code', 'Unit Title', 'Term', 'Type', 'Hours / Wk', 'Examining Body'],
        rows: curr.units.map(u => [
          u.code,
          u.title,
          `Term ${u.termNumber}`,
          u.isPractical ? 'Practical Lab' : 'Theory Core',
          `${u.weeklyHours} Hrs`,
          curr.examiningBody
        ])
      },
      signatoryName: institutionalSettings.registrarName,
      signatoryTitle: institutionalSettings.registrarTitle
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                Academic Leadership Console
              </span>
              <h1 className="text-xl font-bold">HOD & Departmental Portal</h1>
              <p className="text-xs text-slate-400">
                Department of Computing & Applied Sciences • Head: Prof. Tunde Adeyemi
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('CURRICULUM')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'CURRICULUM' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Curricula & Syllabus
            </button>
            <button
              onClick={() => setActiveTab('ALLOCATION')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'ALLOCATION' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Lecturer Allocations
            </button>
            <button
              onClick={() => setActiveTab('MODERATION')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'MODERATION' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Marks Moderation
            </button>
            <button
              onClick={() => setActiveTab('TIMETABLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'TIMETABLE' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Timetable & Rooms
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* TAB 1: CURRICULUM & SYLLABUS BREAKDOWN */}
        {activeTab === 'CURRICULUM' && (
          <div className="space-y-6">
            {/* Top Curricula Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INITIAL_DEPARTMENT_CURRICULA.map(curr => (
                <div
                  key={curr.id}
                  onClick={() => setSelectedCurriculum(curr)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedCurriculum.id === curr.id
                      ? 'bg-indigo-50 border-indigo-400 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800">
                      {curr.programmeCode}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {curr.examiningBody} • {curr.qualificationLevel}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{curr.programmeName}</h3>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>{curr.totalTerms} Academic Terms</span>
                    <span>{curr.units.length} Core Units</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Curriculum Unit Breakdown Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    Syllabus Units Breakdown
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedCurriculum.programmeName} ({selectedCurriculum.programmeCode})
                  </h2>
                </div>

                <button
                  onClick={() => handlePrintCurriculum(selectedCurriculum)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Official Syllabus PDF</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-y border-slate-200 text-slate-600 font-bold uppercase">
                      <th className="p-3">Unit Code</th>
                      <th className="p-3">Unit Title</th>
                      <th className="p-3">Term</th>
                      <th className="p-3">Contact Hours/Wk</th>
                      <th className="p-3">Practical / Lab</th>
                      <th className="p-3">Prerequisites</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedCurriculum.units.map(unit => (
                      <tr key={unit.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-indigo-900">{unit.code}</td>
                        <td className="p-3 font-semibold text-slate-900">{unit.title}</td>
                        <td className="p-3">Term {unit.termNumber}</td>
                        <td className="p-3 font-semibold">{unit.weeklyHours} Hrs</td>
                        <td className="p-3">
                          {unit.isPractical ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                              Workshop / Lab
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[11px]">
                              Lecture Theory
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500">{unit.prerequisites?.join(', ') || 'None'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LECTURER UNIT ALLOCATION MATRIX */}
        {activeTab === 'ALLOCATION' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Faculty Unit Allocation & Workload Matrix</h2>
                  <p className="text-xs text-slate-500">Assign course units to department lecturers for Term 1 & Term 2 2026.</p>
                </div>

                <button
                  onClick={() => setIsAllocateModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Allocate Unit to Lecturer</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-y border-slate-200 text-slate-600 font-bold uppercase">
                      <th className="p-3">Unit Code & Name</th>
                      <th className="p-3">Assigned Faculty</th>
                      <th className="p-3">Term & Session</th>
                      <th className="p-3">Hours/Wk</th>
                      <th className="p-3">Assigned Date</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {allocations.map(alloc => (
                      <tr key={alloc.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <span className="font-mono font-bold text-indigo-900 block">{alloc.unitCode}</span>
                          <span className="text-slate-900 font-medium">{alloc.unitName}</span>
                        </td>
                        <td className="p-3 font-semibold text-slate-900">{alloc.lecturerName}</td>
                        <td className="p-3">{alloc.term} ({alloc.academicYear})</td>
                        <td className="p-3 font-semibold text-emerald-700">{alloc.weeklyHours} Hrs/Wk</td>
                        <td className="p-3 text-slate-500">{alloc.assignedAt}</td>
                        <td className="p-3">
                          <button
                            onClick={() => setAllocations(prev => prev.filter(a => a.id !== alloc.id))}
                            className="text-xs text-rose-600 hover:underline font-semibold"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MARKS MODERATION */}
        {activeTab === 'MODERATION' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Departmental Marks Moderation Queue</h2>
              <p className="text-xs text-slate-500">
                Review and moderate coursework assessments (30%) and practical project marks submitted by faculty.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                <span><strong>Pending Review:</strong> DICT 101 Computer Programming (34 Trainees Submitted by Dr. Marcus Henderson)</span>
              </div>
              <button
                onClick={() => alert('Marks for DICT 101 successfully moderated and forwarded to Registrar / Examinations Board.')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
              >
                Approve & Endorse Moderation
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: TIMETABLE & ROOM ALLOCATION */}
        {activeTab === 'TIMETABLE' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Department Timetable & Workshop Lab Utilization</h2>
              <p className="text-xs text-slate-500">
                Weekly scheduling matrix for Main Campus Computer Labs 1-4 and Electrical Workshops.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">ICT Lab 1 (Software Dev)</div>
                <div className="text-slate-600">Capacity: 45 Workstations</div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Occupied: Mon-Wed 8AM-4PM</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">Cisco Networking Lab 2</div>
                <div className="text-slate-600">Capacity: 30 Trainees with Routers/Switches</div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Occupied: Tue-Thu 9AM-5PM</span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">Electrical Power Test Bench</div>
                <div className="text-slate-600">Capacity: 25 Trainees</div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Available: Fridays</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ALLOCATION MODAL */}
      {isAllocateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Allocate Unit to Faculty Member</h3>
            <form onSubmit={handleCreateAllocation} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit Code</label>
                <input
                  type="text"
                  required
                  value={newAlloc.unitCode}
                  onChange={e => setNewAlloc({ ...newAlloc, unitCode: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit Title</label>
                <input
                  type="text"
                  required
                  value={newAlloc.unitName}
                  onChange={e => setNewAlloc({ ...newAlloc, unitName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lecturer</label>
                <select
                  value={newAlloc.lecturerName}
                  onChange={e => setNewAlloc({ ...newAlloc, lecturerName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Dr. Marcus Henderson">Dr. Marcus Henderson (Senior Lecturer)</option>
                  <option value="Prof. Tunde Adeyemi">Prof. Tunde Adeyemi (HOD)</option>
                  <option value="Eng. Patrick K. Kiprono">Eng. Patrick K. Kiprono</option>
                  <option value="Mrs. Catherine N. Njeri">Mrs. Catherine N. Njeri</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Term</label>
                  <input
                    type="text"
                    value={newAlloc.term}
                    onChange={e => setNewAlloc({ ...newAlloc, term: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Weekly Hours</label>
                  <input
                    type="number"
                    value={newAlloc.weeklyHours}
                    onChange={e => setNewAlloc({ ...newAlloc, weeklyHours: parseInt(e.target.value) || 4 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
