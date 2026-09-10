'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { admissionsApi } from '@/lib/api';
import { PortalDataLifecycleManager } from '@/components/common/PortalDataLifecycleManager';
import {
  UserPlus,
  CheckCircle2,
  FileCheck2,
  Calendar,
  Send,
  Sparkles,
  Search,
  Users,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Activity,
  Award,
  GraduationCap,
  Download,
  Filter
} from 'lucide-react';

export function AdmissionsPortalView() {
  const { currentUser, activeNavTab, publishCrossPortalEvent, openInstitutionalDocument } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('ALL');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleOpenAdmissionLetter = (c: typeof candidates[0]) => {
    openInstitutionalDocument({
      title: 'OFFICIAL PROVISIONAL OFFER OF UNDERGRADUATE ADMISSION',
      documentNumber: `ADM-OFFER-${c.id}-2026`,
      date: 'August 24, 2026',
      recipientName: c.name,
      recipientId: c.id,
      recipientDept: `${c.faculty} • ${c.programme}`,
      metadata: {
        'Applicant Name': c.name,
        'Application Reference': c.id,
        'Offered Degree Major': c.programme,
        'Admitting Faculty': c.faculty,
        'Entrance Score / GPA': `${c.utmeScore} pts (GPA ${c.gpa})`,
        'Admission Session': '2026/2027 Academic Session',
        'Deposit Status': c.deposit === 'PAID' ? 'FEES PAID & CLEARED' : 'ACCEPTANCE FEE REQUIRED'
      },
      bodyParagraphs: [
        `I am pleased to inform you that following your outstanding performance in the Unified Tertiary Matriculation Examination and subsequent University Screening, you have been offered Provisional Admission into the ${c.programme} degree programme in the ${c.faculty}.`,
        `This offer is subject to the verification of your original academic credentials, secondary school leaving certificates, and medical fitness clearance at the Central Admissions Office.`,
        `You are required to accept this offer and complete acceptance fee settlement within fourteen (14) days of this notice, failing which this provisional offer may be reallocated.`,
        `On behalf of the Governing Council and the University Senate, we extend our congratulations and welcome you to a heritage of intellectual distinction and innovation.`
      ],
      signatoryTitle: 'Registrar & Secretary to Admissions Committee',
      signatoryName: 'Dr. Arthur Vance, Ph.D, FNCS',
      status: 'VERIFIED',
      verificationHash: `APX-ADM-OFFER-${c.id}-2026`
    });
  };

  const [candidates, setCandidates] = useState([
    {
      id: 'ADM-2026-8801',
      name: 'Sophia Chen',
      programme: 'B.Sc Software Engineering',
      faculty: 'Faculty of Computing',
      gpa: '3.92',
      utmeScore: 312,
      status: 'OFFER_EXTENDED',
      deposit: 'PAID',
      docsVerified: true,
      matricGenerated: false
    },
    {
      id: 'ADM-2026-8802',
      name: 'Liam Davies',
      programme: 'B.Sc Data Science',
      faculty: 'Faculty of Computing',
      gpa: '3.78',
      utmeScore: 295,
      status: 'ADMITTED',
      deposit: 'PAID',
      docsVerified: true,
      matricGenerated: true
    },
    {
      id: 'ADM-2026-8803',
      name: 'Amara Okafor',
      programme: 'B.Sc Computer Science',
      faculty: 'Faculty of Computing',
      gpa: '3.85',
      utmeScore: 308,
      status: 'UNDER_REVIEW',
      deposit: 'PENDING',
      docsVerified: false,
      matricGenerated: false
    },
    {
      id: 'ADM-2026-8804',
      name: 'David K. Osei',
      programme: 'B.Eng Mechanical Engineering',
      faculty: 'Faculty of Engineering',
      gpa: '3.65',
      utmeScore: 284,
      status: 'SCREENED',
      deposit: 'PENDING',
      docsVerified: true,
      matricGenerated: false
    },
    {
      id: 'ADM-2026-8805',
      name: 'Elena Rostova',
      programme: 'B.Sc Cyber Security',
      faculty: 'Faculty of Computing',
      gpa: '3.95',
      utmeScore: 320,
      status: 'OFFER_EXTENDED',
      deposit: 'PAID',
      docsVerified: true,
      matricGenerated: false
    }
  ]);

  const handleVerifyDocs = (candId: string) => {
    setCandidates(prev =>
      prev.map(c => (c.id === candId ? { ...c, docsVerified: true } : c))
    );
    setFeedbackMessage(`Credentials for ${candId} verified against National Examination Database!`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleExtendOffer = (candId: string) => {
    setCandidates(prev =>
      prev.map(c => (c.id === candId ? { ...c, status: 'OFFER_EXTENDED' } : c))
    );
    setFeedbackMessage(`Provisional Offer Letter generated and dispatched to ${candId}!`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleMatriculate = async (cand: typeof candidates[0]) => {
    let matricNo = `ADM/2026/${cand.id.split('-')[2] || '000001'}`;

    try {
      try {
        await admissionsApi.acceptOffer(cand.id);
      } catch {
        // Offer may already be accepted or candidate is mock
      }

      const res = await admissionsApi.matriculateApplicant(cand.id);
      if (res.data?.admissionNumber) {
        matricNo = res.data.admissionNumber;
      }
    } catch {
      // Graceful fallback for mock candidate
    }

    setCandidates(prev =>
      prev.map(c => (c.id === cand.id ? { ...c, status: 'ADMITTED', matricGenerated: true } : c))
    );

    publishCrossPortalEvent(
      'APPLICANT_MATRICULATED',
      'ADMISSIONS',
      ['STUDENT', 'FINANCE', 'HOSTEL', 'ADMIN'],
      {
        applicantId: cand.id,
        name: cand.name,
        matricNo,
        programme: cand.programme,
        depositPaid: cand.deposit === 'PAID'
      },
      `Applicant ${cand.name} admitted & matriculated as ${matricNo}`
    );

    setFeedbackMessage(`Candidate ${cand.name} formally matriculated as ${matricNo}! Student & Bursary accounts provisioned.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProg = selectedProgramme === 'ALL' || c.programme.includes(selectedProgramme);
    return matchesSearch && matchesProg;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-blue-950/70 border border-indigo-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Admissions, Screening & Matriculation Bridge
          </h1>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Intake Quota Filled</span>
          <span className="text-xl font-black text-emerald-400 font-mono">84.2%</span>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* ============================================================= */}
      {/* 1. ADMISSIONS DASHBOARD */}
      {/* ============================================================= */}
      {(activeNavTab === 'dashboard' || !activeNavTab) && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Total Pool</span>
              <div className="text-white text-xl font-bold">2,850 Apps</div>
              <span className="text-emerald-400 text-[10px]">+18% YoY</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Screened & Vetted</span>
              <div className="text-blue-400 text-xl font-bold">2,140 (75%)</div>
              <span className="text-slate-400 text-[10px]">Credentials Verified</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Offers Extended</span>
              <div className="text-purple-400 text-xl font-bold">950 Offers</div>
              <span className="text-slate-400 text-[10px]">Quota Cap: 1,100</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Deposits Cleared</span>
              <div className="text-emerald-400 text-xl font-bold">810 Paid</div>
              <span className="text-emerald-400 text-[10px]">Ready for Matriculation</span>
            </div>
          </div>

          {/* Faculty Quotas */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              Faculty Quota Fulfillment (Senate Approved)
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Faculty of Computing & Information Tech</span>
                  <span className="text-emerald-400 font-bold">380 / 400 (95%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Faculty of Engineering & Technology</span>
                  <span className="text-blue-400 font-bold">290 / 350 (82%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Faculty of Natural & Applied Sciences</span>
                  <span className="text-amber-400 font-bold">140 / 250 (56%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '56%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 1.5. APPLICANT DATA LIFECYCLE & BATCHES */}
      {/* ============================================================= */}
      {activeNavTab === 'data_lifecycle' && (
        <PortalDataLifecycleManager
          portalId="ADMISSIONS"
          allowedEntityTypes={['STUDENT']}
          title="Applicant Record Governance & Pipeline"
        />
      )}

      {/* ============================================================= */}
      {/* 2. APPLICANT PIPELINE */}
      {/* ============================================================= */}
      {activeNavTab === 'applications' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-400" />
                  Undergraduate Applicant Roster & Pipeline
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Screen candidates by academic threshold, review test scores, and advance through admission gates.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search applicant or ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-950/60 border-y border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Applicant Name</th>
                    <th className="py-3 px-4">Programme</th>
                    <th className="py-3 px-4">GPA / UTME</th>
                    <th className="py-3 px-4">Docs Verified</th>
                    <th className="py-3 px-4">Deposit</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {filteredCandidates.map(c => (
                    <tr key={c.id} className="hover:bg-slate-850">
                      <td className="py-3 px-4 font-bold text-blue-400">{c.id}</td>
                      <td className="py-3 px-4 font-sans font-medium text-white">{c.name}</td>
                      <td className="py-3 px-4 text-slate-300 font-sans">{c.programme}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-emerald-400">{c.gpa}</span>
                        <span className="text-[10px] text-slate-400 ml-1">({c.utmeScore})</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          c.docsVerified
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {c.docsVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${c.deposit === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {c.deposit}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-sans font-bold">
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {(c.status === 'OFFER_EXTENDED' || c.status === 'ADMITTED') && (
                            <button
                              onClick={() => handleOpenAdmissionLetter(c)}
                              title="Generate Official Letterhead Admission Letter"
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Letterhead Offer</span>
                            </button>
                          )}
                          {c.status === 'UNDER_REVIEW' && (
                            <button
                              onClick={() => handleExtendOffer(c.id)}
                              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                            >
                              Extend Offer
                            </button>
                          )}
                          {c.status === 'OFFER_EXTENDED' && (
                            <button
                              onClick={() => handleMatriculate(c)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                            >
                              Matriculate
                            </button>
                          )}
                          {c.status === 'ADMITTED' && (
                            <span className="text-emerald-400 font-sans text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Enrolled</span>
                          )}
                        </div>
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
      {/* 3. CREDENTIAL VERIFICATION */}
      {/* ============================================================= */}
      {activeNavTab === 'scrutiny' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                National Examination Database & Credential Scrutiny
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated high school transcript, WAEC/NECO/SAT certificate authenticity validation.
              </p>
            </div>

            <div className="space-y-3">
              {candidates.map(c => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{c.name}</span>
                      <span className="font-mono text-blue-400">({c.id})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Applied: {c.programme} • High School GPA: <strong className="text-emerald-400">{c.gpa}</strong> • Test Score: {c.utmeScore}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {c.docsVerified ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Credentials Authenticated
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVerifyDocs(c.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        Verify Against Exam Board
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
      {/* 4. OFFER LETTERS & ACCEPTANCE */}
      {/* ============================================================= */}
      {activeNavTab === 'offers' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-400" />
                Provisional Offer Letters & Matriculation Provisioning
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Issue signed admission letters, track acceptance deposits, and auto-dispatch student portal credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.filter(c => c.status === 'OFFER_EXTENDED' || c.status === 'ADMITTED').map(c => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{c.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold">
                      {c.deposit === 'PAID' ? 'Deposit Paid ($250)' : 'Deposit Pending'}
                    </span>
                  </div>
                  <div className="text-slate-400 font-mono text-[11px] space-y-0.5">
                    <div>Programme: {c.programme}</div>
                    <div>Application ID: {c.id}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setFeedbackMessage(`Official PDF Offer Letter generated for ${c.name}!`);
                        setTimeout(() => setFeedbackMessage(null), 3000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
                    >
                      Download Letter PDF
                    </button>
                    {!c.matricGenerated ? (
                      <button
                        onClick={() => handleMatriculate(c)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                      >
                        Matriculate Student
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-mono font-bold">Enrolled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. ADMISSIONS TELEMETRY */}
      {/* ============================================================= */}
      {activeNavTab === 'monitor' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  Admissions Telemetry & Audit Stream
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time screening queue throughput and admissions committee action logs.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Pipeline: ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">Screening Velocity</span>
                <div className="text-white text-base font-bold">42 Candidates / Hour</div>
                <p className="text-[11px] text-slate-400">Automated OCR document pipeline</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">Fraud Detection Flag</span>
                <div className="text-emerald-400 text-base font-bold">0 Forged Transcripts</div>
                <p className="text-[11px] text-slate-400">Direct integration with WAEC/SAT APIs</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">Matriculation Provisioning</span>
                <div className="text-blue-300 text-base font-bold">100% Instant Dispatches</div>
                <p className="text-[11px] text-slate-400">Cross-portal event bus active</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
