'use client';

import React, { useState } from 'react';
import { AcademicDepartment, InstitutionalSettings } from '@/types/erp';
import {
  Layers,
  Plus,
  Search,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Edit2,
  Trash2,
  X,
  Save,
  User,
  AlertCircle
} from 'lucide-react';

interface DepartmentsTabProps {
  settings: InstitutionalSettings;
  onUpdate: (updated: Partial<InstitutionalSettings>, message: string) => void;
}

export function DepartmentsTab({ settings, onUpdate }: DepartmentsTabProps) {
  const departments = settings.departments || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<AcademicDepartment | null>(null);
  const [formData, setFormData] = useState<Partial<AcademicDepartment>>({
    code: '',
    name: '',
    faculty: '',
    hodName: '',
    hodEmail: '',
    phone: '',
    officeLocation: '',
    status: 'ACTIVE',
    programmesCount: 4
  });

  const faculties = Array.from(new Set(departments.map(d => d.faculty))).filter(Boolean);

  const filteredDepts = departments.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.hodName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = facultyFilter === 'ALL' || d.faculty === facultyFilter;
    return matchesSearch && matchesFaculty;
  });

  const totalProgrammes = departments.reduce((sum, d) => sum + (d.programmesCount || 0), 0);
  const activeCount = departments.filter(d => d.status === 'ACTIVE').length;

  const handleOpenAddModal = () => {
    setEditingDept(null);
    setFormError(null);
    setFormData({
      id: `dept_${Date.now().toString().slice(-6)}`,
      code: `DEPT-${(departments.length + 1).toString().padStart(2, '0')}`,
      name: '',
      faculty: faculties[0] || 'Faculty of Engineering & Technology',
      hodName: '',
      hodEmail: '',
      phone: '',
      officeLocation: '',
      status: 'ACTIVE',
      programmesCount: 5
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dept: AcademicDepartment) => {
    setEditingDept(dept);
    setFormError(null);
    setFormData({ ...dept });
    setIsModalOpen(true);
  };

  const handleDeleteDept = (id: string, name: string) => {
    const updated = departments.filter(d => d.id !== id);
    onUpdate({ departments: updated }, `Department "${name}" removed successfully.`);
    setDeleteConfirmId(null);
  };

  const handleToggleStatus = (id: string) => {
    const updated = departments.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        return { ...d, status: nextStatus as 'ACTIVE' | 'INACTIVE' };
      }
      return d;
    });
    onUpdate({ departments: updated }, 'Department status updated.');
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.code?.trim()) {
      setFormError('Please provide a department name and department code.');
      return;
    }

    let updated: AcademicDepartment[];
    if (editingDept) {
      updated = departments.map(d => (d.id === editingDept.id ? ({ ...d, ...formData } as AcademicDepartment) : d));
      onUpdate({ departments: updated }, `Department "${formData.name}" updated successfully.`);
    } else {
      const newDept: AcademicDepartment = {
        id: formData.id || `dept_${Date.now().toString().slice(-6)}`,
        code: formData.code?.toUpperCase() || '',
        name: formData.name || '',
        faculty: formData.faculty || 'Faculty of Engineering & Technology',
        hodName: formData.hodName || '',
        hodEmail: formData.hodEmail || '',
        phone: formData.phone || '',
        officeLocation: formData.officeLocation || '',
        status: formData.status || 'ACTIVE',
        programmesCount: Number(formData.programmesCount) || 3
      };
      updated = [...departments, newDept];
      onUpdate({ departments: updated }, `Department "${newDept.name}" added successfully.`);
    }
    setIsModalOpen(false);
    setFormError(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Academic Departments</div>
            <div className="text-2xl font-black text-white mt-1">{departments.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Across {faculties.length} faculty divisions</div>
          </div>
          <Layers className="w-8 h-8 text-blue-400/50" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Active Units</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">{departments.length - activeCount} suspended or restructuring</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400/50" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Curricular Programmes</div>
            <div className="text-2xl font-black text-purple-400 mt-1">{totalProgrammes}</div>
            <div className="text-xs text-slate-500 mt-0.5">Diploma, Artisan & Certificate offerings</div>
          </div>
          <BookOpen className="w-8 h-8 text-purple-400/50" />
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search departments by code, name or HOD..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={facultyFilter}
            onChange={e => setFacultyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Faculty Divisions</option>
            {faculties.map(fac => (
              <option key={fac} value={fac}>{fac}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDepts.map(dept => (
          <div
            key={dept.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {dept.code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">
                      {dept.faculty}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1.5">{dept.name}</h4>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(dept.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                    dept.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                  title="Click to toggle operational status"
                >
                  {dept.status}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>HOD: <strong className="text-slate-200">{dept.hodName || 'Not Appointed'}</strong></span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Programmes: <strong className="text-slate-200">{dept.programmesCount || 0} active</strong></span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{dept.hodEmail || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{dept.phone || 'N/A'}</span>
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">Office: <strong className="text-slate-300">{dept.officeLocation || 'Registry Complex'}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleOpenEditModal(dept)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                Edit
              </button>

              {deleteConfirmId === dept.id ? (
                <div className="flex items-center gap-1.5 animate-in fade-in">
                  <span className="text-[11px] text-rose-300 font-semibold">Delete?</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteDept(dept.id, dept.name)}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(dept.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredDepts.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-3">
            <Layers className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No departments found</p>
            <p className="text-xs text-slate-500">Refine search criteria or register a new academic department.</p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                {editingDept ? 'Edit Academic Department' : 'Register New Department'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-300">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Electrical & Telecommunications Engineering"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Department Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. DEPT-EEE"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Parent Faculty / School *</label>
                  <input
                    type="text"
                    required
                    value={formData.faculty || ''}
                    onChange={e => setFormData({ ...formData, faculty: e.target.value })}
                    placeholder="e.g. Faculty of Engineering & Technology"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Head of Department (HOD) Name</label>
                  <input
                    type="text"
                    value={formData.hodName || ''}
                    onChange={e => setFormData({ ...formData, hodName: e.target.value })}
                    placeholder="e.g. Eng. Florence Chebet, M.Sc"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">HOD Official Email</label>
                  <input
                    type="email"
                    value={formData.hodEmail || ''}
                    onChange={e => setFormData({ ...formData, hodEmail: e.target.value })}
                    placeholder="e.g. hod.eee@ktvtc.ac.ke"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Department Phone Line</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +254 721 000 111"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Active Programmes Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.programmesCount || 4}
                    onChange={e => setFormData({ ...formData, programmesCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-300">Office / Building Location</label>
                  <input
                    type="text"
                    value={formData.officeLocation || ''}
                    onChange={e => setFormData({ ...formData, officeLocation: e.target.value })}
                    placeholder="e.g. Engineering Complex, Room 204, Second Floor"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Operational Status</label>
                  <select
                    value={formData.status || 'ACTIVE'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
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
                  {editingDept ? 'Save Changes' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
