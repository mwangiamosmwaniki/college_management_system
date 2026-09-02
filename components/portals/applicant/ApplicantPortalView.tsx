'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  Upload,
  CreditCard,
  Download,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { useERP } from '@/context/erp-context';
import { ApplicantMasterRecord, KenyanQualificationLevel } from '@/types/erp';
import { KENYAN_PUBLIC_PROGRAMMES, INITIAL_APPLICANTS_DATA } from '@/lib/kenyan-tvet-data';

export default function ApplicantPortalView() {
  const { institutionalSettings, openInstitutionalDocument, navigateToPortal } = useERP();

  const [activeTab, setActiveTab] = useState<'NEW_APPLICATION' | 'TRACK_STATUS'>('NEW_APPLICATION');

  // Application Step Wizard
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Program
    programmeId: KENYAN_PUBLIC_PROGRAMMES[0].id,
    programmeName: KENYAN_PUBLIC_PROGRAMMES[0].name,
    programmeCode: KENYAN_PUBLIC_PROGRAMMES[0].code,
    qualificationLevel: KENYAN_PUBLIC_PROGRAMMES[0].qualificationLevel,
    examiningBody: KENYAN_PUBLIC_PROGRAMMES[0].examiningBody,
    intakePeriod: 'MAY_2026',
    studyMode: 'FULL_TIME',
    campus: 'Nairobi Main Campus',

    // Step 2: Personal Bio
    fullName: '',
    email: '',
    phone: '',
    gender: 'MALE',
    dateOfBirth: '2005-06-15',
    nationalIdNumber: '',
    county: 'Nairobi',
    subCounty: 'Westlands',
    kcseIndexNumber: '',
    kcseYear: '2025',
    kcseMeanGrade: 'C-',

    // Step 3: Guardian
    guardianName: '',
    guardianPhone: '',
    guardianRelationship: 'Parent',
    fundingSource: 'SELF_SPONSORED',

    // Step 4: Documents
    kcseCertUploaded: true,
    nationalIdUploaded: true,
    passportPhotoUploaded: true,

    // Step 5: M-Pesa Fee
    mpesaPhoneNumber: '',
    mpesaTransactionCode: '',
    applicationFeePaid: false
  });

  // Tracking State
  const [searchRef, setSearchRef] = useState('');
  const [trackedApplication, setTrackedApplication] = useState<ApplicantMasterRecord | null>(INITIAL_APPLICANTS_DATA[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<ApplicantMasterRecord | null>(null);

  const selectedProgramme = KENYAN_PUBLIC_PROGRAMMES.find(p => p.id === formData.programmeId) || KENYAN_PUBLIC_PROGRAMMES[0];

  const handleProgramSelect = (progId: string) => {
    const prog = KENYAN_PUBLIC_PROGRAMMES.find(p => p.id === progId);
    if (!prog) return;
    setFormData(prev => ({
      ...prev,
      programmeId: prog.id,
      programmeName: prog.name,
      programmeCode: prog.code,
      qualificationLevel: prog.qualificationLevel,
      examiningBody: prog.examiningBody
    }));
  };

  const handleSimulateMpesaPayment = () => {
    const randomCode = 'QKH' + Math.floor(1000000 + Math.random() * 9000000);
    setFormData(prev => ({
      ...prev,
      mpesaTransactionCode: randomCode,
      applicationFeePaid: true
    }));
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newRef = 'APP-2026-' + Math.floor(1000 + Math.random() * 9000);
      const newRecord: ApplicantMasterRecord = {
        id: 'app_' + Date.now(),
        applicationNumber: newRef,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'SUBMITTED',
        programmeId: formData.programmeId,
        programmeCode: formData.programmeCode,
        programmeName: formData.programmeName,
        qualificationLevel: formData.qualificationLevel as KenyanQualificationLevel,
        examiningBody: formData.examiningBody as any,
        intakePeriod: formData.intakePeriod,
        campus: formData.campus,
        fullName: formData.fullName || 'Applicant Trainee',
        email: formData.email || 'applicant@example.com',
        phone: formData.phone || '+254 700 000 000',
        gender: formData.gender as any,
        dateOfBirth: formData.dateOfBirth,
        nationalIdNumber: formData.nationalIdNumber || '39102938',
        county: formData.county,
        subCounty: formData.subCounty,
        kcseIndexNumber: formData.kcseIndexNumber || '20401102049',
        kcseYear: parseInt(formData.kcseYear) || 2025,
        kcseMeanGrade: formData.kcseMeanGrade,
        guardianName: formData.guardianName || 'Guardian',
        guardianPhone: formData.guardianPhone || '+254 711 000 000',
        guardianRelationship: formData.guardianRelationship,
        fundingSource: formData.fundingSource as any,
        applicationFeePaid: formData.applicationFeePaid,
        mpesaReceiptNumber: formData.mpesaTransactionCode || 'QKH8492019',
        kcseResultSlipUrl: 'uploaded_kcse_cert.pdf',
        nationalIdUrl: 'uploaded_id_card.pdf',
        passportPhotoUrl: 'uploaded_passport.jpg'
      };

      setSubmissionSuccess(newRecord);
      setTrackedApplication(newRecord);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleDownloadOfferLetter = (app: ApplicantMasterRecord) => {
    openInstitutionalDocument({
      docType: 'ADMISSION_LETTER',
      title: 'LETTER OF PROVISIONAL ADMISSION',
      subtitle: `${app.programmeName || 'Programme'} (${app.programmeCode || 'TVET'}) • Intake: ${(app.intakePeriod || 'MAY_2026').replace('_', ' ')}`,
      recipientName: app.fullName,
      recipientIdentifier: app.applicationNumber,
      issueDate: new Date().toISOString().split('T')[0],
      academicSession: '2026/2027 Academic Year',
      contentBody: `Dear ${app.fullName},\n\nI am pleased to inform you that following your application reference ${app.applicationNumber}, you have been provisionally admitted to Kenya Technical & Vocational Training College for the programme ${app.programmeName || 'Programme'} (${(app.qualificationLevel || 'DIPLOMA').replace('_', ' ')}).\n\nExamining Body: ${app.examiningBody || 'KNEC'}\nCampus: ${app.campus || 'Main Campus'}\n\nPlease report on 4th May 2026 at the Main Campus Registry with your original KCSE Certificate, National ID, and term fee payment receipt.`,
      tableData: {
        headers: ['Fee Item', 'Frequency', 'Amount (KES)'],
        rows: [
          ['Tuition & Workshop Materials', 'Per Term', '22,500.00'],
          ['KNEC / CDACC Assessment Registration', 'Annual', '5,000.00'],
          ['Library & ICT Laboratory Levy', 'Annual', '2,000.00'],
          ['Student Identity Card & Medical Cover', 'Once', '1,500.00'],
          ['Total Payable for Term 1', 'Term 1', '31,000.00']
        ]
      },
      signatoryName: institutionalSettings.registrarName,
      signatoryTitle: institutionalSettings.registrarTitle
    });
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchRef.trim().toLowerCase();
    const found = INITIAL_APPLICANTS_DATA.find(
      a => a.applicationNumber.toLowerCase() === query ||
           (a.kcseIndexNumber && a.kcseIndexNumber.toLowerCase() === query) ||
           (a.nationalIdNumber && a.nationalIdNumber.toLowerCase() === query)
    );
    if (found) {
      setTrackedApplication(found);
    } else {
      alert(`No application found for '${searchRef}'. Try searching with sample reference 'APP-2026-0819' or 'APP-2026-0820'.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Top Header */}
      <div className="bg-emerald-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white text-emerald-900 flex items-center justify-center font-bold text-xl shadow">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                Admissions Directorate
              </span>
              <h1 className="text-2xl font-bold">Online Application & Admissions Portal</h1>
              <p className="text-xs text-emerald-200">
                Kenya Technical & Vocational Training College • 2026/2027 Intakes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('NEW_APPLICATION')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'NEW_APPLICATION'
                  ? 'bg-white text-emerald-900 shadow'
                  : 'bg-emerald-800 text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              New Application
            </button>
            <button
              onClick={() => setActiveTab('TRACK_STATUS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'TRACK_STATUS'
                  ? 'bg-white text-emerald-900 shadow'
                  : 'bg-emerald-800 text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              Track Application Status
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* TAB 1: NEW APPLICATION WIZARD */}
        {activeTab === 'NEW_APPLICATION' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
            {submissionSuccess ? (
              /* Success Confirmation View */
              <div className="text-center py-10 space-y-6 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Application Submitted Successfully
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Congratulations, {submissionSuccess.fullName}!
                  </h2>
                  <p className="text-sm text-slate-600">
                    Your application for <strong>{submissionSuccess.programmeName}</strong> has been registered under reference:
                  </p>
                  <div className="inline-block px-4 py-2 bg-slate-100 border border-slate-300 rounded-xl font-mono text-lg font-bold text-emerald-800">
                    {submissionSuccess.applicationNumber}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">M-Pesa Receipt:</span>
                    <span className="font-semibold text-slate-800">{submissionSuccess.mpesaReceiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Intake:</span>
                    <span className="font-semibold text-slate-800">{(submissionSuccess.intakePeriod || 'MAY_2026').replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Review Status:</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">SUBMITTED (Under Verification)</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <button
                    onClick={() => handleDownloadOfferLetter(submissionSuccess)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Provisional Acknowledgment</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setCurrentStep(1);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Step Progress Indicators */}
                <div className="border-b border-slate-200 pb-6">
                  <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
                    <div className={currentStep >= 1 ? 'text-emerald-700' : 'text-slate-400'}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 ${
                        currentStep >= 1 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        1
                      </div>
                      <span className="hidden sm:inline">Programme</span>
                    </div>

                    <div className={currentStep >= 2 ? 'text-emerald-700' : 'text-slate-400'}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 ${
                        currentStep >= 2 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        2
                      </div>
                      <span className="hidden sm:inline">Bio-Data</span>
                    </div>

                    <div className={currentStep >= 3 ? 'text-emerald-700' : 'text-slate-400'}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 ${
                        currentStep >= 3 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        3
                      </div>
                      <span className="hidden sm:inline">Guardian</span>
                    </div>

                    <div className={currentStep >= 4 ? 'text-emerald-700' : 'text-slate-400'}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 ${
                        currentStep >= 4 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        4
                      </div>
                      <span className="hidden sm:inline">Documents</span>
                    </div>

                    <div className={currentStep >= 5 ? 'text-emerald-700' : 'text-slate-400'}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 ${
                        currentStep >= 5 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        5
                      </div>
                      <span className="hidden sm:inline">M-Pesa Fee</span>
                    </div>
                  </div>
                </div>

                {/* Form Steps */}
                <form onSubmit={handleSubmitApplication} className="space-y-6">
                  {/* STEP 1: PROGRAMME SELECTION */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Step 1: Choose Your Programme of Study</h3>
                        <p className="text-xs text-slate-500">Select qualification level, course, and preferred intake period.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Course / Programme</label>
                          <select
                            value={formData.programmeId}
                            onChange={e => handleProgramSelect(e.target.value)}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                          >
                            {KENYAN_PUBLIC_PROGRAMMES.map(p => (
                              <option key={p.id} value={p.id}>
                                [{p.code}] {p.name} ({p.qualificationLevel})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Intake Period</label>
                          <select
                            value={formData.intakePeriod}
                            onChange={e => setFormData({ ...formData, intakePeriod: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          >
                            <option value="MAY_2026">May 2026 Intake (Ongoing)</option>
                            <option value="SEPTEMBER_2026">September 2026 Intake</option>
                            <option value="JANUARY_2027">January 2027 Intake</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Study Mode</label>
                          <select
                            value={formData.studyMode}
                            onChange={e => setFormData({ ...formData, studyMode: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          >
                            <option value="FULL_TIME">Full Time (Regular Day)</option>
                            <option value="PART_TIME">Part Time / Evening</option>
                            <option value="WEEKEND">Weekend Intensive</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Campus</label>
                          <select
                            value={formData.campus}
                            onChange={e => setFormData({ ...formData, campus: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          >
                            <option value="Nairobi Main Campus">Nairobi Main Campus (Ngong Road)</option>
                            <option value="CBD Town Campus">CBD Town Campus (Pension Towers)</option>
                            <option value="Nakuru Western Campus">Nakuru Western Campus</option>
                          </select>
                        </div>
                      </div>

                      {/* Selected Program Details Card */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-2 text-emerald-950">
                        <div className="font-bold text-sm text-emerald-900">
                          {selectedProgramme.name} ({selectedProgramme.code})
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <div><strong>Examining Body:</strong> {selectedProgramme.examiningBody}</div>
                          <div><strong>Min. Entry:</strong> {selectedProgramme.kcseRequirement}</div>
                          <div><strong>Tuition Fee:</strong> KES {selectedProgramme.tuitionFeePerTerm.toLocaleString()} / Term</div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2"
                        >
                          <span>Next: Personal Bio-Data</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PERSONAL BIO-DATA */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Step 2: Personal & Academic Bio-Data</h3>
                        <p className="text-xs text-slate-500">Provide personal credentials as shown on your KCSE result slip and National ID.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Brian Kipchumba Koech"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="brian.koech@gmail.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                          <input
                            type="tel"
                            required
                            placeholder="0712345678"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">National ID / Birth Cert No. *</label>
                          <input
                            type="text"
                            required
                            placeholder="38910294"
                            value={formData.nationalIdNumber}
                            onChange={e => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">KCSE Index Number *</label>
                          <input
                            type="text"
                            required
                            placeholder="20401102049"
                            value={formData.kcseIndexNumber}
                            onChange={e => setFormData({ ...formData, kcseIndexNumber: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">KCSE Year</label>
                            <select
                              value={formData.kcseYear}
                              onChange={e => setFormData({ ...formData, kcseYear: e.target.value })}
                              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                            >
                              <option value="2025">2025</option>
                              <option value="2024">2024</option>
                              <option value="2023">2023</option>
                              <option value="2022">2022</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Mean Grade</label>
                            <select
                              value={formData.kcseMeanGrade}
                              onChange={e => setFormData({ ...formData, kcseMeanGrade: e.target.value })}
                              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                            >
                              <option value="A">A</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B">B</option>
                              <option value="B-">B-</option>
                              <option value="C+">C+</option>
                              <option value="C">C (Plain)</option>
                              <option value="C-">C-</option>
                              <option value="D+">D+</option>
                              <option value="D">D (Plain)</option>
                              <option value="D-">D-</option>
                              <option value="E">E</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">County of Origin</label>
                          <input
                            type="text"
                            placeholder="e.g. Uasin Gishu / Kiambu"
                            value={formData.county}
                            onChange={e => setFormData({ ...formData, county: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Sub-County</label>
                          <input
                            type="text"
                            placeholder="e.g. Eldoret West / Ruiru"
                            value={formData.subCounty}
                            onChange={e => setFormData({ ...formData, subCounty: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2"
                        >
                          <span>Next: Guardian Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: GUARDIAN & SPONSOR DETAILS */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Step 3: Guardian & Financial Sponsorship</h3>
                        <p className="text-xs text-slate-500">Provide next-of-kin emergency contact and tuition funding plan.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Parent / Guardian Full Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Mary Jepkosgei Koech"
                            value={formData.guardianName}
                            onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Phone Number *</label>
                          <input
                            type="tel"
                            placeholder="0722000000"
                            value={formData.guardianPhone}
                            onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                          <select
                            value={formData.guardianRelationship}
                            onChange={e => setFormData({ ...formData, guardianRelationship: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          >
                            <option value="Parent">Parent (Mother / Father)</option>
                            <option value="Guardian">Legal Guardian</option>
                            <option value="Sibling">Brother / Sister</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Self">Self (Independent)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Funding / Sponsorship Model</label>
                          <select
                            value={formData.fundingSource}
                            onChange={e => setFormData({ ...formData, fundingSource: e.target.value })}
                            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                          >
                            <option value="SELF_SPONSORED">Self-Sponsored (Private Funding)</option>
                            <option value="GOVERNMENT_HELB">Government Capitation & HELB Loan</option>
                            <option value="COUNTY_BURSARY">County Government Bursary / CDF</option>
                            <option value="CORPORATE_SPONSOR">Corporate Sponsor / Employer</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2"
                        >
                          <span>Next: Document Uploads</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: DOCUMENT UPLOADS */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Step 4: Academic Documents & Scans</h3>
                        <p className="text-xs text-slate-500">Upload clear scanned copies in PDF, JPG, or PNG format (Max 5MB each).</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-emerald-700" />
                            <div>
                              <div className="text-xs font-bold text-slate-800">KCSE Result Slip / Leaving Certificate</div>
                              <div className="text-[11px] text-slate-500">Official KNEC document confirming grades</div>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Attached
                          </span>
                        </div>

                        <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-emerald-700" />
                            <div>
                              <div className="text-xs font-bold text-slate-800">National ID Card / Birth Certificate</div>
                              <div className="text-[11px] text-slate-500">Government identity document</div>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Attached
                          </span>
                        </div>

                        <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <User className="w-8 h-8 text-emerald-700" />
                            <div>
                              <div className="text-xs font-bold text-slate-800">Passport-Sized Photograph</div>
                              <div className="text-[11px] text-slate-500">Clear color photo against white background</div>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Attached
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(5)}
                          className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2"
                        >
                          <span>Next: M-Pesa Application Fee</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: M-PESA APPLICATION FEE PAYMENT */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Step 5: Application Processing Fee (KES 1,000)</h3>
                        <p className="text-xs text-slate-500">Pay the non-refundable institutional processing fee via Lipa na M-Pesa.</p>
                      </div>

                      <div className="bg-emerald-950 text-white p-6 rounded-2xl space-y-4 shadow-lg">
                        <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-emerald-400" />
                            <span className="font-bold text-sm">Lipa na M-Pesa PayBill</span>
                          </div>
                          <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-800 text-emerald-200">
                            Instant Verification
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <div className="text-emerald-300 text-[11px]">PayBill Business No:</div>
                            <div className="text-lg font-mono font-bold text-white">247247</div>
                          </div>
                          <div>
                            <div className="text-emerald-300 text-[11px]">Account Number:</div>
                            <div className="text-sm font-mono font-bold text-white">
                              {formData.kcseIndexNumber || '20401102049'}
                            </div>
                          </div>
                          <div>
                            <div className="text-emerald-300 text-[11px]">Amount Payable:</div>
                            <div className="text-lg font-bold text-amber-400">KES 1,000.00</div>
                          </div>
                        </div>

                        {formData.applicationFeePaid ? (
                          <div className="bg-emerald-800/80 border border-emerald-600 rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                              <div>
                                <div className="text-xs font-bold text-white">M-Pesa Payment Confirmed!</div>
                                <div className="text-[11px] font-mono text-emerald-200">
                                  Ref Code: {formData.mpesaTransactionCode}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-300">KES 1,000.00</span>
                          </div>
                        ) : (
                          <div className="space-y-3 pt-2">
                            <button
                              type="button"
                              onClick={handleSimulateMpesaPayment}
                              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>Simulate Instant M-Pesa STK Push Confirmation</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={!formData.applicationFeePaid || isSubmitting}
                          className="px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold shadow-lg flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <span>Submitting Application...</span>
                          ) : (
                            <>
                              <span>Submit Formal Application</span>
                              <FileCheck className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        )}

        {/* TAB 2: TRACK APPLICATION STATUS */}
        {activeTab === 'TRACK_STATUS' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Track Your Application Review & Offer Letter</h3>
                <p className="text-xs text-slate-500">
                  Enter your Application Reference (e.g. <code>APP-2026-0819</code>), KCSE Index No, or National ID.
                </p>
              </div>

              <form onSubmit={handleTrackSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter Application Ref No. (e.g. APP-2026-0819)"
                    value={searchRef}
                    onChange={e => setSearchRef(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {trackedApplication && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Application Reference: {trackedApplication.applicationNumber}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                      {trackedApplication.fullName}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Applied on {trackedApplication.appliedDate} • KCSE Grade: {trackedApplication.kcseMeanGrade}
                    </p>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      trackedApplication.status === 'ADMITTED' || trackedApplication.status === 'OFFERED' || trackedApplication.status === 'OFFER_ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : trackedApplication.status === 'SUBMITTED'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      STATUS: {trackedApplication.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">Programme Admitted:</span>
                    <span className="font-bold text-slate-900">{trackedApplication.programmeName}</span>
                    <span className="text-[11px] text-slate-500 block">[{trackedApplication.programmeCode}] • {trackedApplication.examiningBody}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">Campus & Intake:</span>
                    <span className="font-bold text-slate-900">{trackedApplication.campus}</span>
                    <span className="text-[11px] text-emerald-700 font-semibold block">{(trackedApplication.intakePeriod || 'MAY_2026').replace('_', ' ')}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">M-Pesa Verification:</span>
                    <span className="font-bold text-emerald-700">PAID & VERIFIED</span>
                    <span className="text-[11px] font-mono text-slate-500 block">Ref: {trackedApplication.mpesaReceiptNumber}</span>
                  </div>
                </div>

                {/* Offer Letter Action */}
                {(trackedApplication.status === 'ADMITTED' || trackedApplication.status === 'OFFERED' || trackedApplication.status === 'OFFER_ACCEPTED') && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950 text-sm">Provisional Admission Letter Available</h4>
                        <p className="text-xs text-emerald-800">
                          Your admission has been approved by the Registrar (Academic Affairs).
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadOfferLetter(trackedApplication)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Admission Letter</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
