'use client';

import React, { useState } from 'react';
import { CampusBranch, InstitutionalSettings } from '@/types/erp';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  X,
  Save,
  Compass,
  AlertCircle
} from 'lucide-react';

interface CampusesTabProps {
  settings: InstitutionalSettings;
  onUpdate: (updated: Partial<InstitutionalSettings>, message: string) => void;
}

export function CampusesTab({ settings, onUpdate }: CampusesTabProps) {
  const campuses = settings.campuses || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<CampusBranch | null>(null);
  const [formData, setFormData] = useState<Partial<CampusBranch>>({
    name: '',
    code: '',
    type: 'MAIN_CAMPUS',
    county: '',
    address: '',
    directorName: '',
    phone: '',
    email: '',
    studentCapacity: 1000,
    status: 'ACTIVE'
  });

  const filteredCampuses = campuses.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.county.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalCapacity = campuses.reduce((sum, c) => sum + (c.studentCapacity || 0), 0);
  const activeCount = campuses.filter(c => c.status === 'ACTIVE').length;

  const handleOpenAddModal = () => {
    setEditingCampus(null);
    setFormError(null);
    setFormData({
      id: `camp_${Date.now().toString().slice(-6)}`,
      name: '',
      code: `CAMP-${(campuses.length + 1).toString().padStart(2, '0')}`,
      type: 'MAIN_CAMPUS',
      county: '',
      address: '',
      directorName: '',
      phone: '',
      email: '',
      studentCapacity: 1500,
      status: 'ACTIVE',
      establishedDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (campus: CampusBranch) => {
    setEditingCampus(campus);
    setFormError(null);
    setFormData({ ...campus });
    setIsModalOpen(true);
  };

  const handleDeleteCampus = (id: string, name: string) => {
    const updated = campuses.filter(c => c.id !== id);
    onUpdate({ campuses: updated }, `Campus "${name}" removed successfully.`);
    setDeleteConfirmId(null);
  };

  const handleToggleStatus = (id: string) => {
    const updated = campuses.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        return { ...c, status: nextStatus as 'ACTIVE' | 'INACTIVE' };
      }
      return c;
    });
    onUpdate({ campuses: updated }, 'Campus operational status updated.');
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.code?.trim()) {
      setFormError('Please provide a campus name and campus code.');
      return;
    }

    let updated: CampusBranch[];
    if (editingCampus) {
      updated = campuses.map(c => (c.id === editingCampus.id ? ({ ...c, ...formData } as CampusBranch) : c));
      onUpdate({ campuses: updated }, `Campus "${formData.name}" updated successfully.`);
    } else {
      const newCampus: CampusBranch = {
        id: formData.id || `camp_${Date.now().toString().slice(-6)}`,
        name: formData.name || '',
        code: formData.code?.toUpperCase() || '',
        type: formData.type || 'MAIN_CAMPUS',
        county: formData.county || 'Nairobi',
        address: formData.address || '',
        directorName: formData.directorName || '',
        phone: formData.phone || '',
        email: formData.email || '',
        studentCapacity: Number(formData.studentCapacity) || 500,
        status: formData.status || 'ACTIVE',
        establishedDate: formData.establishedDate || new Date().toISOString().split('T')[0]
      };
      updated = [...campuses, newCampus];
      onUpdate({ campuses: updated }, `Campus "${newCampus.name}" added successfully.`);
    }
    setIsModalOpen(false);
    setFormError(null);
  };

  const getTypeBadge = (type: CampusBranch['type']) => {
    switch (type) {
      case 'MAIN_CAMPUS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">Main Campus</span>;
      case 'SATELLITE_CAMPUS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">Satellite</span>;
      case 'TOWN_CENTER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">Town Center</span>;
      case 'ANNEX_WORKSHOP':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Industrial Annex</span>;
      case 'VIRTUAL_ODEL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Virtual / ODeL</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">{type}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Campuses</div>
            <div className="text-2xl font-black text-white mt-1">{campuses.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Physical & Virtual Branches</div>
          </div>
          <Building2 className="w-8 h-8 text-blue-400/50" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Active Campuses</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">{campuses.length - activeCount} inactive/under development</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400/50" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Student Capacity</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{totalCapacity.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-0.5">Combined institutional intake capacity</div>
          </div>
          <Users className="w-8 h-8 text-amber-400/50" />
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
              placeholder="Search campuses by name, code or county..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Campus Types</option>
            <option value="MAIN_CAMPUS">Main Campus</option>
            <option value="SATELLITE_CAMPUS">Satellite Campus</option>
            <option value="TOWN_CENTER">Town Center</option>
            <option value="ANNEX_WORKSHOP">Industrial Annex</option>
            <option value="VIRTUAL_ODEL">Virtual / ODeL</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Campus
        </button>
      </div>

      {/* Campuses List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCampuses.map(campus => (
          <div
            key={campus.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {campus.code}
                    </span>
                    {getTypeBadge(campus.type)}
                  </div>
                  <h4 className="text-base font-bold text-white mt-1.5">{campus.name}</h4>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(campus.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                    campus.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                  title="Click to toggle status"
                >
                  {campus.status}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{campus.address || campus.county}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>County: <strong className="text-slate-200">{campus.county}</strong></span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Director: <strong className="text-slate-200">{campus.directorName || 'Not Assigned'}</strong></span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{campus.phone || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{campus.email || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Capacity: <strong className="text-slate-200">{campus.studentCapacity?.toLocaleString()}</strong> trainees</span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleOpenEditModal(campus)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                Edit
              </button>

              {deleteConfirmId === campus.id ? (
                <div className="flex items-center gap-1.5 animate-in fade-in">
                  <span className="text-[11px] text-rose-300 font-semibold">Delete?</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCampus(campus.id, campus.name)}
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
                  onClick={() => setDeleteConfirmId(campus.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredCampuses.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-3">
            <Building2 className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No campuses found matching the criteria</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or add a new campus branch.</p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              Add First Campus
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
                <Building2 className="w-5 h-5 text-blue-400" />
                {editingCampus ? 'Edit Campus Branch' : 'Add New Campus Branch'}
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
                  <label className="font-semibold text-slate-300">Campus Official Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mombasa Coastal Polytechnic Annex"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Campus Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. CAMP-COAST"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Campus Classification *</label>
                  <select
                    value={formData.type || 'MAIN_CAMPUS'}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="MAIN_CAMPUS">Main Campus</option>
                    <option value="SATELLITE_CAMPUS">Satellite Campus</option>
                    <option value="TOWN_CENTER">Town Center</option>
                    <option value="ANNEX_WORKSHOP">Industrial / Workshop Annex</option>
                    <option value="VIRTUAL_ODEL">Virtual / ODeL</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">County / Region *</label>
                  <input
                    type="text"
                    required
                    value={formData.county || ''}
                    onChange={e => setFormData({ ...formData, county: e.target.value })}
                    placeholder="e.g. Mombasa County"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Trainee / Student Capacity</label>
                  <input
                    type="number"
                    min="10"
                    value={formData.studentCapacity || 1000}
                    onChange={e => setFormData({ ...formData, studentCapacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-300">Physical Address & Directions</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Archbishop Makarios Road, Ganjoni, Mombasa"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Campus Director / Principal</label>
                  <input
                    type="text"
                    value={formData.directorName || ''}
                    onChange={e => setFormData({ ...formData, directorName: e.target.value })}
                    placeholder="e.g. Dr. Hassan Omar, Ph.D"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Official Contact Telephone</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +254 700 123 456"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Campus Email Address</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. coast@ktvtc.ac.ke"
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
                    <option value="ACTIVE">Active & Admitting</option>
                    <option value="INACTIVE">Inactive / Maintenance</option>
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
                  {editingCampus ? 'Save Campus Changes' : 'Register Campus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
