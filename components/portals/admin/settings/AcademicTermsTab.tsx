'use client';

import React, { useState } from 'react';
import { AcademicTermSession, InstitutionalSettings } from '@/types/erp';
import {
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  X,
  Save,
  Star,
  FileSpreadsheet
} from 'lucide-react';

interface AcademicTermsTabProps {
  settings: InstitutionalSettings;
  onUpdate: (updated: Partial<InstitutionalSettings>, message: string) => void;
}

export function AcademicTermsTab({ settings, onUpdate }: AcademicTermsTabProps) {
  const terms = settings.academicTerms || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<AcademicTermSession | null>(null);
  const [formData, setFormData] = useState<Partial<AcademicTermSession>>({
    academicYear: '2026/2027',
    termName: 'Term 1 (First Semester)',
    intakeName: 'September 2026 Intake',
    startDate: '2026-09-01',
    endDate: '2026-11-28',
    registrationDeadline: '2026-09-20',
    examStartDate: '2026-11-16',
    examEndDate: '2026-11-27',
    isCurrentActive: false,
    status: 'ACTIVE'
  });

  const filteredTerms = terms.filter(t => {
    const matchesSearch =
      t.academicYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.termName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.intakeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeTerm = terms.find(t => t.isCurrentActive);

  const handleOpenAddModal = () => {
    setEditingTerm(null);
    setFormData({
      id: `term_${Date.now().toString().slice(-6)}`,
      academicYear: '2026/2027',
      termName: `Term ${(terms.length % 3) + 1} (${(terms.length % 3) === 0 ? 'First' : (terms.length % 3) === 1 ? 'Second' : 'Third'} Semester)`,
      intakeName: 'Next Cohort Intake',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      registrationDeadline: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
      examStartDate: new Date(Date.now() + 75 * 86400000).toISOString().split('T')[0],
      examEndDate: new Date(Date.now() + 88 * 86400000).toISOString().split('T')[0],
      isCurrentActive: terms.length === 0,
      status: 'UPCOMING'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (term: AcademicTermSession) => {
    setEditingTerm(term);
    setFormData({ ...term });
    setIsModalOpen(true);
  };

  const handleDeleteTerm = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete term session "${name}"? This action cannot be undone.`)) {
      const updated = terms.filter(t => t.id !== id);
      onUpdate({ academicTerms: updated }, `Academic term "${name}" deleted.`);
    }
  };

  const handleSetCurrentActive = (id: string, name: string) => {
    const updated = terms.map(t => ({
      ...t,
      isCurrentActive: t.id === id,
      status: t.id === id ? ('ACTIVE' as const) : t.status
    }));
    onUpdate({ academicTerms: updated }, `Term "${name}" set as the Official Current Active Session.`);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.academicYear?.trim() || !formData.termName?.trim()) {
      alert('Please fill in the academic year and term name.');
      return;
    }

    let updated: AcademicTermSession[];
    if (editingTerm) {
      updated = terms.map(t => {
        if (t.id === editingTerm.id) {
          return { ...t, ...formData } as AcademicTermSession;
        }
        // If this term is made active, deactivate other terms
        if (formData.isCurrentActive) {
          return { ...t, isCurrentActive: false };
        }
        return t;
      });
      onUpdate({ academicTerms: updated }, `Term "${formData.termName}" updated successfully.`);
    } else {
      const newTerm: AcademicTermSession = {
        id: formData.id || `term_${Date.now().toString().slice(-6)}`,
        academicYear: formData.academicYear || '2026/2027',
        termName: formData.termName || 'Term 1',
        intakeName: formData.intakeName || 'Intake Cohort',
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        registrationDeadline: formData.registrationDeadline || '',
        examStartDate: formData.examStartDate || '',
        examEndDate: formData.examEndDate || '',
        isCurrentActive: Boolean(formData.isCurrentActive),
        status: formData.status || 'UPCOMING'
      };

      if (newTerm.isCurrentActive) {
        updated = [...terms.map(t => ({ ...t, isCurrentActive: false })), newTerm];
      } else {
        updated = [...terms, newTerm];
      }
      onUpdate({ academicTerms: updated }, `Academic term session "${newTerm.termName}" created.`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Current Active Session Highlight Banner */}
      {activeTerm && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
                Current Active Session
              </span>
              <span className="text-xs text-slate-400 font-mono">{activeTerm.academicYear}</span>
            </div>
            <h3 className="text-lg font-black text-white">{activeTerm.termName}</h3>
            <p className="text-xs text-slate-300">
              Intake Cohort: <strong className="text-white">{activeTerm.intakeName}</strong> • Term Runs:{' '}
              <strong className="text-blue-300">{activeTerm.startDate}</strong> to{' '}
              <strong className="text-blue-300">{activeTerm.endDate}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right text-xs">
              <div className="text-slate-400 font-mono text-[10px]">REGISTRATION DEADLINE</div>
              <div className="text-amber-400 font-bold">{activeTerm.registrationDeadline}</div>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by year, term or intake cohort..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Session States</option>
            <option value="ACTIVE">Active Session</option>
            <option value="UPCOMING">Upcoming Session</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Academic Term
        </button>
      </div>

      {/* Term List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map(term => (
          <div
            key={term.id}
            className={`p-5 rounded-2xl bg-slate-900 border transition flex flex-col justify-between gap-4 ${
              term.isCurrentActive ? 'border-blue-500/60 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500/30' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {term.academicYear}
                    </span>
                    {term.isCurrentActive && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-blue-400" />
                        Current
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white mt-1.5">{term.termName}</h4>
                  <p className="text-xs text-slate-400">{term.intakeName}</p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    term.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : term.status === 'UPCOMING'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {term.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Start: <strong className="text-slate-200">{term.startDate}</strong></span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>End: <strong className="text-slate-200">{term.endDate}</strong></span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Reg Deadline: <strong className="text-slate-200">{term.registrationDeadline}</strong></span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Exam Window: <strong className="text-slate-200">{term.examStartDate}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div>
                {!term.isCurrentActive && (
                  <button
                    type="button"
                    onClick={() => handleSetCurrentActive(term.id, term.termName)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-semibold transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    Set as Current
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(term)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteTerm(term.id, term.termName)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTerms.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-3">
            <Calendar className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No academic term sessions found</p>
            <p className="text-xs text-slate-500">Add a new academic term and intake session to get started.</p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              Add Term
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                {editingTerm ? 'Edit Academic Term Session' : 'Schedule New Academic Term'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Academic Year *</label>
                  <input
                    type="text"
                    required
                    value={formData.academicYear || ''}
                    onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="e.g. 2026/2027"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Term / Semester Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.termName || ''}
                    onChange={e => setFormData({ ...formData, termName: e.target.value })}
                    placeholder="e.g. Term 1 (First Semester)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-300">Intake Cohort Title</label>
                  <input
                    type="text"
                    value={formData.intakeName || ''}
                    onChange={e => setFormData({ ...formData, intakeName: e.target.value })}
                    placeholder="e.g. September 2026 KUCCPS & Direct Intake"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Term Commencement Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate || ''}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Term Closing Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate || ''}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-300">Course Registration Deadline *</label>
                  <input
                    type="date"
                    required
                    value={formData.registrationDeadline || ''}
                    onChange={e => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Exam Period Start</label>
                  <input
                    type="date"
                    value={formData.examStartDate || ''}
                    onChange={e => setFormData({ ...formData, examStartDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Exam Period End</label>
                  <input
                    type="date"
                    value={formData.examEndDate || ''}
                    onChange={e => setFormData({ ...formData, examEndDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Session Status</label>
                  <select
                    value={formData.status || 'ACTIVE'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="UPCOMING">Upcoming</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isCurrentActive"
                    checked={formData.isCurrentActive || false}
                    onChange={e => setFormData({ ...formData, isCurrentActive: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="isCurrentActive" className="font-semibold text-slate-300 cursor-pointer">
                    Set as Current Active Session
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {editingTerm ? 'Save Session Changes' : 'Schedule Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
