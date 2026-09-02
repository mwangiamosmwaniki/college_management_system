'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  CheckCircle2,
  Clock,
  Building,
  User,
  Download,
  Calendar,
  Award,
  FileText,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useERP } from '@/context/erp-context';
import { INITIAL_ATTACHMENT_PLACEMENTS } from '@/lib/kenyan-tvet-data';
import { AttachmentPlacement } from '@/types/erp';

export default function AttachmentPortalView() {
  const { institutionalSettings, openInstitutionalDocument } = useERP();

  const [placements, setPlacements] = useState<AttachmentPlacement[]>(INITIAL_ATTACHMENT_PLACEMENTS);
  const [selectedPlacement, setSelectedPlacement] = useState<AttachmentPlacement>(INITIAL_ATTACHMENT_PLACEMENTS[0]);

  const handleUpdateLogbook = (placementId: string, verifiedWeeks: number, score?: number) => {
    setPlacements(prev =>
      prev.map(p => {
        if (p.id === placementId) {
          const total = p.totalWeeks || 12;
          return {
            ...p,
            verifiedWeeks,
            assessorScore: score !== undefined ? score : p.assessorScore,
            status: verifiedWeeks >= total ? 'COMPLETED' : 'IN_PROGRESS'
          };
        }
        return p;
      })
    );
    alert('Industrial Attachment logbook progress updated successfully.');
  };

  const handlePrintAttachmentLetter = (p: AttachmentPlacement) => {
    openInstitutionalDocument({
      docType: 'CLEARANCE_CERTIFICATE',
      title: 'INDUSTRIAL ATTACHMENT INTRODUCTORY & INSURANCE LETTER',
      subtitle: `Industrial Attachment & Liaison Directorate • Ref: ATT/2026/${p.admissionNumber.replace('/', '-')}`,
      recipientName: p.studentName,
      recipientIdentifier: p.admissionNumber,
      issueDate: new Date().toISOString().split('T')[0],
      contentBody: `TO WHOM IT MAY CONCERN / THE MANAGING DIRECTOR\n\nDear Sir/Madam,\n\nRE: REQUEST FOR INDUSTRIAL ATTACHMENT PLACEMENT - ${p.studentName.toUpperCase()} (ADM NO: ${p.admissionNumber})\n\nThis is to certify that the above named is a bonafide trainee at Kenya Technical & Vocational Training College pursuing ${p.programmeName}.\n\nAs part of the TVETA and KNEC curriculum requirements, the trainee is required to undergo a mandatory 12-week industrial attachment between ${p.startDate} and ${p.endDate}.\n\nThe trainee is fully covered by the institutional group personal accident insurance policy.`,
      tableData: {
        headers: ['Detail', 'Specification'],
        rows: [
          ['Host Company', p.companyName],
          ['Industry Mentor', p.industrySupervisorName],
          ['Assigned Visiting Lecturer', p.facultyAssessorName],
          ['Duration', `${p.totalWeeks} Weeks`]
        ]
      },
      signatoryName: 'Eng. Patrick K. Kiprono',
      signatoryTitle: 'Industrial Liaison Officer'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Banner */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                Industrial Liaison Directorate
              </span>
              <h1 className="text-xl font-bold">Industrial Attachment & Careers Portal</h1>
              <p className="text-xs text-slate-400">
                12-Week Mandatory Industry Placements, Logbooks & Site Assessments
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Placements Directory */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Current Industry Placements (2026 Cycle)</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-y border-slate-200 text-slate-600 font-bold uppercase">
                    <th className="p-3">Trainee</th>
                    <th className="p-3">Host Company</th>
                    <th className="p-3">Logbook Progress</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {placements.map(p => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPlacement(p)}
                      className={`cursor-pointer hover:bg-slate-50 ${
                        selectedPlacement.id === p.id ? 'bg-amber-50/60' : ''
                      }`}
                    >
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{p.studentName}</span>
                        <span className="text-mono text-[11px] text-slate-500">{p.admissionNumber}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-900 block">{p.companyName}</span>
                        <span className="text-[11px] text-slate-500">{p.industrySupervisorName}</span>
                      </td>
                      <td className="p-3 font-semibold text-emerald-700">
                        {p.verifiedWeeks} / {p.totalWeeks} Weeks
                      </td>
                      <td className="p-3 font-bold">{p.assessorScore || 'Pending'}%</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          p.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrintAttachmentLetter(p);
                          }}
                          className="px-2.5 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded font-semibold text-[11px] flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Letter</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Selected Placement Assessment & Logbook Manager */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Placement Details
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {selectedPlacement.studentName}
              </h3>
              <p className="text-xs text-slate-500">{selectedPlacement.admissionNumber} • {selectedPlacement.programmeName}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <div><strong>Host Firm:</strong> {selectedPlacement.companyName}</div>
                <div><strong>Industry Mentor:</strong> {selectedPlacement.industrySupervisorName}</div>
                <div><strong>Visiting Lecturer:</strong> {selectedPlacement.facultyAssessorName}</div>
                <div><strong>Period:</strong> {selectedPlacement.startDate} to {selectedPlacement.endDate}</div>
              </div>

              {/* Logbook Progress Updater */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">Verified Weekly Logbook Entries</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max={selectedPlacement.totalWeeks || 12}
                    value={selectedPlacement.verifiedWeeks || 0}
                    onChange={e => handleUpdateLogbook(selectedPlacement.id, parseInt(e.target.value))}
                    className="flex-1 accent-amber-600"
                  />
                  <span className="font-bold text-amber-900">{selectedPlacement.verifiedWeeks || 0} / {selectedPlacement.totalWeeks || 12} Wks</span>
                </div>
              </div>

              {/* Site Assessment Score */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">Visiting Assessor Score (0-100%)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedPlacement.assessorScore || 85}
                    onChange={e => handleUpdateLogbook(selectedPlacement.id, selectedPlacement.verifiedWeeks || 0, parseInt(e.target.value))}
                    className="p-2 border border-slate-300 rounded-lg w-24 text-xs font-bold"
                  />
                  <button
                    onClick={() => handleUpdateLogbook(selectedPlacement.id, selectedPlacement.verifiedWeeks || 0, selectedPlacement.assessorScore || 85)}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs"
                  >
                    Save Score
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
