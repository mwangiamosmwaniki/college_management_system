'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  CheckCircle2,
  Calendar,
  DollarSign,
  FileText,
  Download,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { KENYAN_COLLEGE_INFO } from '@/lib/kenyan-tvet-data';

interface PublicAdmissionsSectionProps {
  onApplyClick: () => void;
  onDownloadProspectus: () => void;
  onDownloadFeeStructure: () => void;
}

export function PublicAdmissionsSection({
  onApplyClick,
  onDownloadProspectus,
  onDownloadFeeStructure
}: PublicAdmissionsSectionProps) {
  const [activeTab, setActiveTab] = useState<'process' | 'requirements' | 'fees' | 'calendar'>('process');

  return (
    <div className="bg-slate-50 text-slate-800 space-y-16 py-12 sm:py-16">
      
      {/* 1. Admissions Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider font-mono">
            <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
            <span>Admissions Directorate • 2026/2027 Academic Year</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Join Kenya&apos;s Premier Technical College
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Whether placed through government placement (KUCCPS) or applying directly as a self-sponsored trainee, your technical career journey starts here.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onApplyClick}
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Start Online Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onDownloadFeeStructure}
              className="px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Download Fee Structure</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs for Admissions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('process')}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'process'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. How to Apply (5 Steps)
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'requirements'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Entry Requirements Matrix
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'fees'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Fees, Capitation & HELB
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'calendar'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Intakes & Reporting Calendar
          </button>
        </div>
      </div>

      {/* 3. Tab Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TAB 1: 5-STEP PROCESS */}
        {activeTab === 'process' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900">The 5-Step Application Journey</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                From initial selection to receiving your official provisional admission letter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center">
                  1
                </div>
                <h4 className="font-bold text-base text-slate-900">Choose Programme</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse our accredited courses across Computing, Engineering, Business, or Hospitality. Verify you meet the minimum grade requirements.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center">
                  2
                </div>
                <h4 className="font-bold text-base text-slate-900">Apply Online</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fill in your bio-data, academic qualifications, and preferred study campus in the online application wizard. Takes less than 10 minutes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center">
                  3
                </div>
                <h4 className="font-bold text-base text-slate-900">Upload Documents</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload your KCSE result slip/certificate, national ID or birth certificate, and passport photo in PDF or clear image format.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center">
                  4
                </div>
                <h4 className="font-bold text-base text-slate-900">Instant Verification</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pay the KES 500 application fee via Lipa na M-Pesa PayBill 247247. The admissions registrar reviews submissions within 24–48 hours.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center">
                  5
                </div>
                <h4 className="font-bold text-base text-slate-900">Receive Offer</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Download your official provisional offer letter, joining instructions, medical examination form, and fee schedule to report to campus!
                </p>
              </div>
            </div>

            {/* Application Checklist Callout */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-base sm:text-lg text-slate-900">
                Mandatory Documentation Checklist for Reporting
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Original KNEC KCSE result slip & 2 photocopies</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>National ID card or Birth Certificate (under 18)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>4 recent passport-size color photographs</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Completed Institutional Medical Form by Doctor</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REQUIREMENTS MATRIX */}
        {activeTab === 'requirements' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900">Minimum Entry Requirements Matrix</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Standardized minimum entry criteria established under the TVET Act and KNEC regulations.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Qualification Level</th>
                      <th className="p-4">Minimum Mean Grade</th>
                      <th className="p-4">Subject Specifics</th>
                      <th className="p-4">Alternative Pathway</th>
                      <th className="p-4">Course Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">Diploma (Level 6)</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800">KCSE C- (Minus)</span></td>
                      <td className="p-4">At least C- in relevant clusters (e.g. Math/Physics for Engineering)</td>
                      <td className="p-4">Relevant Craft Certificate (Level 5) from TVETA institution</td>
                      <td className="p-4 font-medium">9 Terms (3 Years)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">Craft Certificate (Level 5)</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-800">KCSE D (Plain)</span></td>
                      <td className="p-4">Pass in English/Kiswahili and relevant technical subject</td>
                      <td className="p-4">Relevant Artisan Certificate (Level 4) or NITA Grade III</td>
                      <td className="p-4 font-medium">6 Terms (2 Years)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">Artisan (Level 4)</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-800">KCSE D- / KCPE</span></td>
                      <td className="p-4">Open to all candidates with basic literacy and numeracy</td>
                      <td className="p-4">KCPE Certificate or direct trade experience</td>
                      <td className="p-4 font-medium">3-4 Terms (1 Year)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">KASNEB (CPA / ATD)</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded font-mono font-bold bg-purple-100 text-purple-800">KCSE C+ (Plus)</span></td>
                      <td className="p-4">C+ in Mathematics and English</td>
                      <td className="p-4">KASNEB Accounting Technician Diploma (ATD)</td>
                      <td className="p-4 font-medium">Modular Semesters</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FEES & FINANCIAL AID */}
        {activeTab === 'fees' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900">Transparent Fees, Capitation & HELB Loans</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Affordable technical education subsidized by the Government of Kenya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Govt Capitation */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-slate-900">Government Capitation</h4>
                <div className="text-2xl font-extrabold text-emerald-800 font-mono">
                  KES 30,000 / Year
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every student placed through KUCCPS receives an automatic government tuition subsidy disbursed directly to the college account, significantly reducing out-of-pocket tuition fees.
                </p>
              </div>

              {/* Card 2: HELB Loans & Bursaries */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-slate-900">HELB TVET Loan & Upkeep</h4>
                <div className="text-2xl font-extrabold text-blue-800 font-mono">
                  Up to KES 40,000
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Trainees in accredited TVET institutions qualify for Higher Education Loans Board (HELB) funding for tuition and personal upkeep. The Dean&apos;s office assists students with bulk verification.
                </p>
              </div>

              {/* Card 3: Lipa na M-Pesa Official Account */}
              <div className="p-6 rounded-2xl bg-emerald-950 text-white shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Official Payment</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-800 text-emerald-200">Verified</span>
                </div>
                <div className="text-sm font-semibold text-slate-300">Lipa na M-Pesa PayBill</div>
                <div className="text-3xl font-extrabold text-white font-mono tracking-wider">
                  247247
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div><strong>Account Number:</strong> Trainee Admission No (e.g. <code>CIT/2026/049</code>) or Application ID.</div>
                  <div className="text-[11px] text-slate-400">Do NOT pay cash to any individual. Instant receipts generated via SMS.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTAKES & CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900">2026 Intakes & Academic Deadlines</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Three intake cycles every academic year: January, May, and September.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800">Term 2</span>
                  <span className="text-xs text-slate-400 font-mono">Intake 2</span>
                </div>
                <h4 className="font-bold text-lg text-slate-900">May 2026 Intake</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div><strong>Application Closes:</strong> 25th April 2026</div>
                  <div><strong>Reporting Date:</strong> 5th May 2026</div>
                  <div><strong>Orientation Week:</strong> 5th - 8th May 2026</div>
                  <div><strong>Lectures Commence:</strong> 11th May 2026</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800">Term 3</span>
                  <span className="text-xs text-slate-400 font-mono">Main Intake</span>
                </div>
                <h4 className="font-bold text-lg text-slate-900">September 2026 Intake</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div><strong>KUCCPS Placement Reporting:</strong> 1st Sept 2026</div>
                  <div><strong>Self-Sponsored Deadline:</strong> 20th August 2026</div>
                  <div><strong>Orientation Week:</strong> 1st - 4th Sept 2026</div>
                  <div><strong>Lectures Commence:</strong> 7th Sept 2026</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800">Term 1</span>
                  <span className="text-xs text-slate-400 font-mono">Intake 1</span>
                </div>
                <h4 className="font-bold text-lg text-slate-900">January 2027 Intake</h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div><strong>Early Applications Open:</strong> 1st Nov 2026</div>
                  <div><strong>Application Closes:</strong> 2nd Jan 2027</div>
                  <div><strong>Reporting Date:</strong> 8th Jan 2027</div>
                  <div><strong>Lectures Commence:</strong> 11th Jan 2027</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
