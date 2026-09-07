'use client';

import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  FileText,
  Download,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useERP } from '@/context/erp-context';
import { KENYAN_COLLEGE_INFO } from '@/lib/kenyan-tvet-data';

interface OfficialNoticeItem {
  id: string;
  circularNo: string;
  title: string;
  category: 'EXAMINATIONS' | 'ADMISSIONS' | 'FEES' | 'ATTACHMENT' | 'GENERAL';
  urgency: 'HIGH' | 'MEDIUM' | 'NORMAL';
  effectiveDate: string;
  deadlineDate?: string;
  issuingOffice: string;
  signatory: string;
  summary: string;
  fullText: string;
}

const OFFICIAL_NOTICES_SEED: OfficialNoticeItem[] = [
  {
    id: 'not_01',
    circularNo: 'KTVTC/EXAM/2026/04',
    title: 'KNEC & TVET CDACC July 2026 Series — Candidate Nominal Roll Verification',
    category: 'EXAMINATIONS',
    urgency: 'HIGH',
    effectiveDate: '2026-03-01',
    deadlineDate: '2026-04-15',
    issuingOffice: 'Directorate of Examinations',
    signatory: 'Senior Examinations Officer',
    summary: 'All modular and institutional candidates sitting for the July 2026 KNEC and CDACC national examinations must confirm their unit codes and spelling of names against their National ID/Birth Certificate.',
    fullText: 'The Directorate of Examinations hereby informs all candidates registered for the July 2026 KNEC and TVET CDACC National Series that nominal roll verification is active. Trainees are required to visit the examinations office or log in to the Student Portal under Exam Modules to verify personal biodata, national ID numbers, and registered exam papers.\n\nAny discrepancies must be reported in writing before the deadline date of 15th April 2026. Late amendments will incur a surcharge.'
  },
  {
    id: 'not_02',
    circularNo: 'KTVTC/ADM/2026/12',
    title: 'May 2026 (Term 2) Reporting Dates & Joining Instructions for New Trainees',
    category: 'ADMISSIONS',
    urgency: 'HIGH',
    effectiveDate: '2026-02-28',
    deadlineDate: '2026-05-05',
    issuingOffice: 'Office of the Academic Registrar',
    signatory: 'Mrs. Grace W. Mwangi, Registrar',
    summary: 'Provisional offer holders and KUCCPS placed candidates are required to download their joining instructions and report to their respective campuses on Tuesday, 5th May 2026.',
    fullText: 'All candidates offered admission for the May 2026 Intake are notified that campus reporting begins on 5th May 2026 at 8:00 AM. Trainees must present their original KCSE result slip, 2 photocopies, original National ID/Birth Certificate, 4 passport photos, and medical clearance certificate.\n\nOrientation runs from 5th to 8th May 2026. Official lectures commence on Monday, 11th May 2026.'
  },
  {
    id: 'not_03',
    circularNo: 'KTVTC/FIN/2026/08',
    title: 'Term 2 Fee Clearance Schedule & Lipa na M-Pesa Automated Reconciliation',
    category: 'FEES',
    urgency: 'MEDIUM',
    effectiveDate: '2026-02-20',
    deadlineDate: '2026-05-22',
    issuingOffice: 'Office of the Bursar',
    signatory: 'Mr. David O. Omondi, CPA-K',
    summary: 'All returning students must clear at least 60% of Term 2 tuition fees prior to exam card issuance. Use official PayBill 247247 with trainee Admission Number.',
    fullText: 'The Bursar reminds all trainees and sponsors that fees must strictly be remitted via Lipa na M-Pesa PayBill 247247 using your unique Admission Number as the Account. Automated instant receipts are posted to your Student Portal ledger within 30 seconds.\n\nStudents receiving HELB or County Government Bursaries should submit allotment letters to the Finance Office.'
  },
  {
    id: 'not_04',
    circularNo: 'KTVTC/ATT/2026/02',
    title: 'Mandatory 12-Week Industrial Attachment Logbook & Insurance Cover Submission',
    category: 'ATTACHMENT',
    urgency: 'MEDIUM',
    effectiveDate: '2026-02-15',
    deadlineDate: '2026-04-30',
    issuingOffice: 'Industrial Liaison Directorate',
    signatory: 'Eng. Patrick K. Kiprono',
    summary: 'Second and third-year trainees proceeding on May–August 2026 industrial attachment must submit host organization acceptance letters for assessor assignment.',
    fullText: 'All candidates going for industrial attachment during Term 2 must collect their official NITA insurance cover and assessment logbooks from the Industrial Liaison Office. Ensure your host organization supervisor signs and stamps the monthly progress log.'
  }
];

export function PublicNoticesSection() {
  const { openInstitutionalDocument, institutionalSettings } = useERP();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredNotices = useMemo(() => {
    if (selectedCategory === 'ALL') return OFFICIAL_NOTICES_SEED;
    return OFFICIAL_NOTICES_SEED.filter(n => n.category === selectedCategory);
  }, [selectedCategory]);

  const handleOpenNoticeDoc = (notice: OfficialNoticeItem) => {
    openInstitutionalDocument({
      docType: 'CIRCULAR',
      title: `${institutionalSettings.name} — Official Notice`,
      subtitle: `Ref: ${notice.circularNo} • Issued by ${notice.issuingOffice}`,
      recipientName: 'All Trainees, Faculty, Staff & General Public',
      issueDate: notice.effectiveDate,
      contentBody: `${notice.title}\n\n${notice.fullText}\n\nDeadline for Compliance: ${notice.deadlineDate || 'Immediate'}\n\nBy Order of the College Council & Management Board.`,
      signatoryName: notice.signatory,
      signatoryTitle: notice.issuingOffice
    });
  };

  return (
    <div className="bg-slate-50 text-slate-800 space-y-12 py-12 sm:py-16">
      
      {/* 1. Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Official Institutional Gazette & Trainee Notices</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Official Notices & Directives
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Formal circulars, regulatory announcements, examination registration schedules, and academic deadlines gazetted by the College Registrar.
          </p>
        </div>
      </div>

      {/* 2. Priority Alerts Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="uppercase tracking-wider font-mono">Critical Academic Deadlines — Term 2 (2026)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-amber-400 font-mono text-[11px] block">May Intake</span>
              <div className="font-bold text-white text-sm">Admission Deadline</div>
              <div className="text-slate-400 text-xs">25th April 2026</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-blue-400 font-mono text-[11px] block">KNEC July 2026</span>
              <div className="font-bold text-white text-sm">Nominal Roll Verification</div>
              <div className="text-slate-400 text-xs">Closes 15th April 2026</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-emerald-400 font-mono text-[11px] block">Reporting</span>
              <div className="font-bold text-white text-sm">Term 2 Campus Arrival</div>
              <div className="text-slate-400 text-xs">5th May 2026 (8:00 AM)</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-purple-400 font-mono text-[11px] block">Attachment</span>
              <div className="font-bold text-white text-sm">Logbook Clearance</div>
              <div className="text-slate-400 text-xs">30th April 2026</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['ALL', 'EXAMINATIONS', 'ADMISSIONS', 'FEES', 'ATTACHMENT'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'ALL' ? 'All Notices' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Gazetted Notices List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {filteredNotices.map(notice => (
          <div
            key={notice.id}
            className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm space-y-4 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {notice.circularNo}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                  notice.urgency === 'HIGH'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {notice.urgency} Priority
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>Gazetted: {notice.effectiveDate}</span>
                {notice.deadlineDate && (
                  <span className="text-amber-600 font-semibold">Deadline: {notice.deadlineDate}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 leading-snug">
                {notice.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {notice.summary}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="text-slate-500 font-medium">
                Issued by: <strong className="text-slate-800">{notice.issuingOffice}</strong> ({notice.signatory})
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenNoticeDoc(notice)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Official Gazette PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
