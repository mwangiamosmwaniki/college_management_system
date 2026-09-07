'use client';

import React, { useState } from 'react';
import { InstitutionalSettings } from '@/types/erp';
import {
  Building2,
  Sparkles,
  Save,
  Plus,
  X,
  FileCheck,
  Award,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SchoolProfileTabProps {
  settings: InstitutionalSettings;
  onUpdate: (updated: Partial<InstitutionalSettings>, message: string) => void;
  presetLogos: Array<{
    name: string;
    url: string;
    primary: string;
    accent: string;
  }>;
  onApplyPreset: (preset: any) => void;
}

export function SchoolProfileTab({
  settings,
  onUpdate,
  presetLogos,
  onApplyPreset
}: SchoolProfileTabProps) {
  const [formData, setFormData] = useState<InstitutionalSettings>(settings);
  const [newValueInput, setNewValueInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof InstitutionalSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCoreValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValueInput.trim()) return;
    const currentValues = formData.coreValues || [];
    if (currentValues.includes(newValueInput.trim())) return;

    const updated = [...currentValues, newValueInput.trim()];
    setFormData(prev => ({ ...prev, coreValues: updated }));
    setNewValueInput('');
  };

  const handleRemoveCoreValue = (valToRemove: string) => {
    const currentValues = formData.coreValues || [];
    const updated = currentValues.filter(v => v !== valToRemove);
    setFormData(prev => ({ ...prev, coreValues: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData, 'Institutional Profile and Statutory Charters saved successfully!');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
      {/* Preset Heraldic Themes */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Preset Themes & Institutional Crests
          </label>
          <span className="text-[11px] text-slate-500">Applies vetted crest logos & colors</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {presetLogos.map(preset => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className="p-3 rounded-xl bg-slate-850 border border-slate-700 hover:border-blue-500 transition text-left flex items-center gap-3 cursor-pointer group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preset.url}
                alt={preset.name}
                className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-slate-600"
              />
              <div className="text-xs">
                <p className="font-semibold text-white group-hover:text-blue-400 transition">{preset.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.accent }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Details */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Institutional Identity & Legal Classification
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Core names, institutional tier and accreditation details rendered on letterheads, transcripts and diplomas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Full Institutional Legal Name *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. Kenya Technical & Vocational Training College"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Short Name / Acronym *</label>
            <input
              type="text"
              required
              value={formData.shortName || ''}
              onChange={e => handleChange('shortName', e.target.value)}
              placeholder="e.g. KTVTC"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-slate-300">Institutional Motto / Slogan</label>
            <input
              type="text"
              value={formData.motto || ''}
              onChange={e => handleChange('motto', e.target.value)}
              placeholder="e.g. Skills for Industrial Transformation & Self Reliance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Institutional Classification / Tier</label>
            <select
              value={formData.institutionCategory || 'NATIONAL_POLYTECHNIC'}
              onChange={e => handleChange('institutionCategory', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="NATIONAL_POLYTECHNIC">National Polytechnic</option>
              <option value="TVET_COLLEGE">Technical & Vocational College (TVET)</option>
              <option value="TECHNICAL_VOCATIONAL_CENTER">Technical Vocational Center (TVC)</option>
              <option value="VOCATIONAL_TRAINING_CENTER">Vocational Training Center (VTC)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Institution Code</label>
            <input
              type="text"
              value={formData.institutionCode || ''}
              onChange={e => handleChange('institutionCode', e.target.value.toUpperCase())}
              placeholder="e.g. TVET-K-0924"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">TVETA License Registration #</label>
            <input
              type="text"
              value={formData.tvetaLicenseNumber || ''}
              onChange={e => handleChange('tvetaLicenseNumber', e.target.value)}
              placeholder="e.g. TVETA/PUBLIC/0082/2021"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">KNEC Examination Center Code #</label>
            <input
              type="text"
              value={formData.knecCenterNumber || ''}
              onChange={e => handleChange('knecCenterNumber', e.target.value)}
              placeholder="e.g. KNEC-C-501029"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">KRA Tax PIN #</label>
            <input
              type="text"
              value={formData.kraPinNumber || ''}
              onChange={e => handleChange('kraPinNumber', e.target.value)}
              placeholder="e.g. P051239847Z"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Year Established</label>
            <input
              type="number"
              value={formData.establishedYear || 1994}
              onChange={e => handleChange('establishedYear', parseInt(e.target.value) || 2000)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Accreditation Body</label>
            <input
              type="text"
              value={formData.accreditationBody || ''}
              onChange={e => handleChange('accreditationBody', e.target.value)}
              placeholder="e.g. TVETA Kenya • CDACC • KNEC Certified"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Gazetted Charter / Legal Order #</label>
            <input
              type="text"
              value={formData.charterNumber || ''}
              onChange={e => handleChange('charterNumber', e.target.value)}
              placeholder="e.g. Legal Notice No. 89 of 1994"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Vision, Mission & Core Values */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Institutional Strategic Foundations
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mission, Vision and Core Values published on college prospectuses and official brochures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Vision Statement</label>
            <textarea
              rows={3}
              value={formData.visionStatement || ''}
              onChange={e => handleChange('visionStatement', e.target.value)}
              placeholder="Enter institutional vision..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Mission Statement</label>
            <textarea
              rows={3}
              value={formData.missionStatement || ''}
              onChange={e => handleChange('missionStatement', e.target.value)}
              placeholder="Enter institutional mission..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Core Values Tag Input */}
        <div className="space-y-2 pt-2 text-xs">
          <label className="font-semibold text-slate-300">Institutional Core Values</label>
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-800 border border-slate-700 min-h-[50px]">
            {(formData.coreValues || []).map((val, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold"
              >
                <span>{val}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCoreValue(val)}
                  className="hover:text-white transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
              <input
                type="text"
                value={newValueInput}
                onChange={e => setNewValueInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newValueInput.trim()) {
                      const current = formData.coreValues || [];
                      if (!current.includes(newValueInput.trim())) {
                        setFormData(prev => ({ ...prev, coreValues: [...current, newValueInput.trim()] }));
                      }
                      setNewValueInput('');
                    }
                  }
                }}
                placeholder="Type new value & press Enter..."
                className="bg-transparent text-white text-xs placeholder-slate-500 focus:outline-none flex-1 px-1"
              />
              <button
                type="button"
                onClick={handleAddCoreValue}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold cursor-pointer"
              >
                Add Value
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Profile and regulatory changes automatically sync across all document generators.</span>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save Institutional Profile
        </button>
      </div>
    </form>
  );
}
