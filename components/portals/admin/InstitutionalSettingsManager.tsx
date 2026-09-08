'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { InstitutionalSettings, InstitutionalDocPayload } from '@/types/erp';
import {
  Building2,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Eye,
  FileCheck,
  Award,
  CheckCircle2,
  Sparkles,
  Palette,
  UserCheck,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  MapPin,
  QrCode,
  FileText,
  HelpCircle,
  FileSpreadsheet,
  Receipt,
  GraduationCap,
  Layers,
  CreditCard,
  Calendar
} from 'lucide-react';
import { SchoolProfileTab } from './settings/SchoolProfileTab';
import { CampusesTab } from './settings/CampusesTab';
import { DepartmentsTab } from './settings/DepartmentsTab';
import { AcademicTermsTab } from './settings/AcademicTermsTab';
import { PaymentAccountsTab } from './settings/PaymentAccountsTab';

const PRESET_LOGOS = [
  {
    name: 'Academic Shield Crest',
    url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&h=160&fit=crop&q=80',
    primary: '#1e3a8a',
    accent: '#d97706'
  },
  {
    name: 'Imperial Crimson Crown',
    url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=160&h=160&fit=crop&q=80',
    primary: '#881337',
    accent: '#f59e0b'
  },
  {
    name: 'Emerald Heritage Torch',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=160&h=160&fit=crop&q=80',
    primary: '#064e3b',
    accent: '#10b981'
  },
  {
    name: 'Royal Midnight Gold',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=160&h=160&fit=crop&q=80',
    primary: '#0f172a',
    accent: '#eab308'
  }
];

export function InstitutionalSettingsManager() {
  const {
    institutionalSettings,
    updateInstitutionalSettings,
    resetInstitutionalSettings,
    openInstitutionalDocument
  } = useERP();

  const [formData, setFormData] = useState<InstitutionalSettings>(institutionalSettings);
  const [activeSection, setActiveSection] = useState<
    'PROFILE' | 'CAMPUSES' | 'DEPARTMENTS' | 'ACADEMIC_CALENDAR' | 'PAYMENT_ACCOUNTS' | 'SIGNATORIES' | 'CONTACT' | 'LETTERHEAD' | 'PREVIEW'
  >('PROFILE');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const [previewDocType, setPreviewDocType] = useState<'TRANSCRIPT' | 'RECEIPT' | 'ADMISSION_LETTER' | 'BROADSHEET' | 'CLEARANCE_CERTIFICATE'>('TRANSCRIPT');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleDirectUpdate = (updatedPartial: Partial<InstitutionalSettings>, message: string) => {
    const next = { ...formData, ...updatedPartial };
    setFormData(next);
    updateInstitutionalSettings(next);
    setSavedFeedback(message);
    setTimeout(() => setSavedFeedback(null), 4000);
  };

  const handleChange = (field: keyof InstitutionalSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyPreset = (preset: typeof PRESET_LOGOS[0]) => {
    setFormData(prev => ({
      ...prev,
      logoUrl: preset.url,
      primaryColor: preset.primary,
      accentColor: preset.accent
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitutionalSettings(formData);
    setSavedFeedback('Institutional identity and letterhead configurations updated across all portals!');
    setTimeout(() => setSavedFeedback(null), 4000);
  };

  const handleConfirmReset = () => {
    resetInstitutionalSettings();
    setTimeout(() => {
      setFormData(institutionalSettings);
    }, 50);
    setShowResetConfirm(false);
    setSavedFeedback('Restored default university heraldry and letterhead branding.');
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  const handleTestGenerateSampleDoc = (type: 'TRANSCRIPT' | 'RECEIPT' | 'ADMISSION_LETTER' | 'BROADSHEET' | 'CLEARANCE_CERTIFICATE') => {
    // Commit current form settings first so the modal previews current edits
    updateInstitutionalSettings(formData);

    let samplePayload: InstitutionalDocPayload;

    if (type === 'TRANSCRIPT') {
      samplePayload = {
        docType: 'TRANSCRIPT',
        docNumber: `TRN-${new Date().getFullYear()}-00892`,
        issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        title: 'OFFICIAL ACADEMIC TRANSCRIPT OF ACADEMIC RECORD',
        subtitle: 'CONFIDENTIAL • ISSUED UNDER SENATE SEAL',
        recipientName: 'Johnathan Alexander Doe',
        recipientIdentifier: 'STU-2026-00124',
        recipientDepartment: 'Department of Computer Science',
        recipientFaculty: 'Faculty of Computing & Information Systems',
        recipientProgram: 'Bachelor of Science (Hons) Software Engineering',
        recipientLevel: 'Graduating Class of 2026',
        issuingAuthority: 'Office of the University Registrar & Senate Committee',
        docVerificationCode: 'AIT-TRN-8849-AUTH',
        contentBody: 'This is to officially certify that the student named herein has completed the prescribed courses of study and passed the requisite examinations under the approved University curriculum.',
        tableData: {
          headers: ['Course Code', 'Course Title', 'Credit Units', 'Score', 'Grade', 'Grade Point'],
          rows: [
            ['CSC 301', 'Advanced Software Engineering', '3.0', '88', 'A', '15.0'],
            ['CSC 303', 'Database Systems & Architecture', '3.0', '92', 'A', '15.0'],
            ['CSC 305', 'Operating Systems & Concurrency', '3.0', '79', 'B', '12.0'],
            ['CSC 307', 'Computer Networks & Security', '3.0', '84', 'A', '15.0'],
            ['MTH 311', 'Numerical Analysis & Computation', '3.0', '74', 'B', '12.0'],
            ['ENG 301', 'Technical Report Writing & Ethics', '2.0', '81', 'A', '10.0']
          ],
          summaryRow: ['TOTAL', 'Current Semester Summary', '17.0 Units', 'Avg: 83.0%', 'GPA: 3.82', 'CGPA: 3.84']
        },
        metadata: {
          degreeConferred: 'B.Sc. Software Engineering',
          classOfDegree: 'First Class Honours (Distinction)',
          cumulativeGPA: '3.84 / 4.00',
          totalCreditsAccumulated: '136 Units',
          academicStanding: 'Senate Approved & Good Standing',
          dateOfSenateApproval: 'May 14, 2026'
        }
      };
    } else if (type === 'RECEIPT') {
      samplePayload = {
        docType: 'RECEIPT',
        docNumber: `REC-BUR-${Date.now().toString().slice(-6)}`,
        issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        title: 'OFFICIAL BURSARY PAYMENT RECEIPT',
        subtitle: 'FINANCIAL DIRECTORATE • ELECTRONIC REVENUE CONFIRMATION',
        recipientName: 'Johnathan Alexander Doe',
        recipientIdentifier: 'STU-2026-00124',
        recipientDepartment: 'Department of Computer Science',
        recipientFaculty: 'Faculty of Computing & Information Systems',
        recipientProgram: 'B.Sc. Software Engineering',
        recipientLevel: '300 Level (Year 3)',
        issuingAuthority: 'Directorate of Finance & University Bursary',
        docVerificationCode: 'BUR-REC-9014-VAL',
        contentBody: 'Received from the above named candidate the sum specified below in payment of statutory academic tuition fees for the 2026/2027 Academic Session.',
        tableData: {
          headers: ['Item #', 'Fee Classification', 'Academic Term', 'Payment Gateway', 'Amount Paid'],
          rows: [
            ['1', 'Tuition Fee (First Semester)', '2026/2027 Session', 'Direct Debit / Card', '$1,800.00'],
            ['2', 'Computing & Laboratory Levy', '2026/2027 Session', 'Online Portal', '$250.00'],
            ['3', 'Library & Digital Resource Access', '2026/2027 Session', 'Online Portal', '$150.00'],
            ['4', 'Medical Health & Insurance Scheme', '2026/2027 Session', 'Online Portal', '$100.00']
          ],
          summaryRow: ['TOTAL', 'All Statutory Fees Cleared', 'Status: PAID', 'Ref: TXN-89301', '$2,300.00']
        },
        metadata: {
          transactionId: 'TXN-BUR-2026-098124',
          paymentMethod: 'Online Payment Gateway',
          bursaryLedgerAccount: 'ACC-TUITION-GEN-4010',
          cashierOfficer: 'Robert Thorne (Bursar Authorized)',
          balanceRemaining: '$0.00 (Fully Paid)'
        }
      };
    } else if (type === 'ADMISSION_LETTER') {
      samplePayload = {
        docType: 'ADMISSION_LETTER',
        docNumber: `ADM-OFFER-2026-${Date.now().toString().slice(-4)}`,
        issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        title: 'PROVISIONAL OFFER OF ADMISSION',
        subtitle: 'UNDERGRADUATE ADMISSIONS BOARD • 2026/2027 ACADEMIC SESSION',
        recipientName: 'Sarah Rebecca Jenkins',
        recipientIdentifier: 'APP-2026-88192',
        recipientDepartment: 'Department of Computer Science',
        recipientFaculty: 'Faculty of Computing & Information Systems',
        recipientProgram: 'Bachelor of Science in Software Engineering',
        recipientLevel: '100 Level (Freshman)',
        issuingAuthority: 'Office of the Admissions Board & University Registrar',
        docVerificationCode: 'ADM-OFFER-7712-SEC',
        contentBody: `Dear Sarah Rebecca Jenkins,\n\nI am pleased to inform you that following your outstanding performance in the Unified Tertiary Matriculation Examination and Post-UTME screening, the Admissions Board of ${formData.name} has offered you Provisional Admission into the 2026/2027 Academic Session for the course stated above.\n\nThis offer is subject to the verification of your original academic credentials, certificates of origin, and payment of the non-refundable acceptance fee within fourteen (14) days of this notice. You are required to report to the Admissions Directorate on Monday, October 12, 2026 for formal matriculation registration.\n\nCongratulations on your well-deserved admission.`,
        tableData: {
          headers: ['Requirement Item', 'Required Document', 'Verification Status', 'Deadline'],
          rows: [
            ['1. Academic O\'Level Results', 'Original WAEC/NECO Certificate (5 Credits)', 'Verified & Approved', 'October 12, 2026'],
            ['2. Birth Certificate / Age Declaration', 'National Population Commission', 'Verified & Approved', 'October 12, 2026'],
            ['3. Medical Fitness Certificate', 'University Health Center Screening', 'Pending Physical Test', 'October 19, 2026'],
            ['4. Acceptance Fee Receipt', 'Official Bursary Payment Slip', 'Paid & Reconciled', 'Immediate']
          ],
          summaryRow: ['SUMMARY', 'Provisional Admission Status', 'ELIGIBLE FOR MATRICULATION', 'Session 2026/2027']
        },
        metadata: {
          facultyDean: 'Prof. Amara Diallo',
          durationOfProgramme: '4 Academic Sessions (8 Semesters)',
          matriculationDate: 'November 05, 2026',
          hostelEligibility: 'Guaranteed Freshman Accommodation Available'
        }
      };
    } else if (type === 'BROADSHEET') {
      samplePayload = {
        docType: 'BROADSHEET',
        docNumber: `EXAM-BRD-CSC301-2026`,
        issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        title: 'DEPARTMENTAL SENATE EXAMINATION RESULTS BROADSHEET',
        subtitle: 'COURSE CODE: CSC 301 • ADVANCED SOFTWARE ENGINEERING (3.0 UNITS)',
        recipientName: 'Departmental Board of Examiners',
        recipientIdentifier: 'CSC-DEPT-MOD-2026',
        recipientDepartment: 'Department of Computer Science',
        recipientFaculty: 'Faculty of Computing & Information Systems',
        recipientProgram: 'B.Sc. Software Engineering',
        recipientLevel: '300 Level',
        issuingAuthority: 'Senate Committee on Academic Standards & Examinations Board',
        docVerificationCode: 'SENATE-EXAM-CSC301-OFFICIAL',
        contentBody: 'Official examination score master sheet showing continuous assessment, end-of-semester examination score, cumulative grade point and final classification for the First Semester 2026/2027 Academic Session.',
        tableData: {
          headers: ['S/N', 'Matric Number', 'Student Name', 'CA (30)', 'Exam (70)', 'Total (100)', 'Grade', 'Status'],
          rows: [
            ['1', 'STU-2026-00124', 'Johnathan Doe', '27.0', '61.0', '88.0', 'A', 'PASSED'],
            ['2', 'STU-2026-00125', 'Sarah Jenkins', '28.5', '63.5', '92.0', 'A', 'PASSED'],
            ['3', 'STU-2026-00126', 'Marcus Sterling', '22.0', '52.0', '74.0', 'B', 'PASSED'],
            ['4', 'STU-2026-00127', 'Elena Rostova', '25.0', '56.0', '81.0', 'A', 'PASSED'],
            ['5', 'STU-2026-00128', 'Tariq Al-Mansoor', '20.0', '48.0', '68.0', 'C', 'PASSED'],
            ['6', 'STU-2026-00129', 'Chloe Zhao', '24.0', '55.0', '79.0', 'B', 'PASSED']
          ],
          summaryRow: ['STATISTICS', 'Total Candidates: 6', 'Passed: 6 (100%)', 'Avg: 80.3', 'High: 92.0', 'Low: 68.0', 'Senate: APPROVED', 'VALID']
        },
        metadata: {
          courseLecturer: 'Dr. Arthur Vance, Ph.D',
          externalModerator: 'Prof. Amara Diallo',
          dateOfModeration: 'May 02, 2026',
          senateApprovalStatus: 'Officially Gazetted by Registrar'
        }
      };
    } else {
      samplePayload = {
        docType: 'CLEARANCE_CERTIFICATE',
        docNumber: `CLR-GRAD-${Date.now().toString().slice(-5)}`,
        issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        title: 'FINAL UNIVERSITY GRADUATION & STATUTORY CLEARANCE CERTIFICATE',
        subtitle: 'ISSUED BY SENATE CONVOCATION & CLEARANCE COMMITTEE',
        recipientName: 'Johnathan Alexander Doe',
        recipientIdentifier: 'STU-2026-00124',
        recipientDepartment: 'Department of Computer Science',
        recipientFaculty: 'Faculty of Computing & Information Systems',
        recipientProgram: 'B.Sc. (Hons) Software Engineering',
        recipientLevel: 'Graduating Finalist',
        issuingAuthority: 'Central University Clearance Board',
        docVerificationCode: 'CLR-FINAL-2026-9042',
        contentBody: 'This document certifies that the aforementioned student has fulfilled all academic, financial, residential, sports, library, and statutory obligations to the University and is hereby fully cleared for convocation, issuance of degree certificate, and NYSC/National Service mobilization.',
        tableData: {
          headers: ['Clearance Department / Division', 'Signing Authority', 'Verification Date', 'Status'],
          rows: [
            ['1. University Library', 'Dr. Evelyn Reed (Chief Librarian)', '2026-05-10', 'CLEARED (No Overdue Books)'],
            ['2. University Bursary', 'Dr. Robert Thorne (Bursar)', '2026-05-11', 'CLEARED (Zero Outstanding Balance)'],
            ['3. Student Residential Services', 'Alhaji Hassan Bello (Hall Warden)', '2026-05-11', 'CLEARED (Room Inspected & Key Returned)'],
            ['4. Department of Computer Science', 'Dr. Arthur Vance (Head of Department)', '2026-05-12', 'CLEARED (Project Hardbound Submitted)'],
            ['5. Faculty of Computing', 'Prof. Amara Diallo (Faculty Dean)', '2026-05-12', 'CLEARED (Faculty Senate Approval)'],
            ['6. Directorate of Security Services', 'James O’Connor (Chief Security Officer)', '2026-05-13', 'CLEARED (No Disciplinary Records)']
          ],
          summaryRow: ['FINAL VERDICT', 'All 6 Statutory Divisions Cleared', 'Clearance Code: PASS-2026', 'ELIGIBLE FOR GRADUATION']
        },
        metadata: {
          degreeToConfer: 'Bachelor of Science (First Class Honours)',
          convocationBatch: '42nd Annual University Convocation (Class of 2026)',
          originalCertificateReady: 'Yes (Registry Vault 4B)'
        }
      };
    }

    openInstitutionalDocument(samplePayload);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/80 to-slate-900 border border-blue-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Administrative Control Center
            </span>
            <span className="text-xs text-slate-400 font-mono">Dynamic Brand & Letterhead Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-blue-400" />
            Institutional Identity & Document Letterhead Settings
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Configure institutional heraldry, crest logo, legal name, signatories, and statutory details. All official downloads (transcripts, bursary receipts, offer letters, broadsheets, and clearance certificates) dynamically reflect these settings.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {showResetConfirm ? (
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-rose-500/40 animate-in fade-in">
              <span className="text-xs text-rose-300 font-semibold px-1">Reset all settings to default?</span>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Defaults
            </button>
          )}
          <button
            type="button"
            onClick={() => handleTestGenerateSampleDoc('TRANSCRIPT')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Preview Official Letterhead
          </button>
        </div>
      </div>

      {savedFeedback && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{savedFeedback}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setActiveSection('PROFILE')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition cursor-pointer ${
            activeSection === 'PROFILE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. School Profile & Charters</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('CAMPUSES')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition cursor-pointer ${
            activeSection === 'CAMPUSES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>2. Campuses & Branches</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('DEPARTMENTS')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition cursor-pointer ${
            activeSection === 'DEPARTMENTS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Academic Departments</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('ACADEMIC_CALENDAR')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition cursor-pointer ${
            activeSection === 'ACADEMIC_CALENDAR'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>4. Calendar & Terms</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('PAYMENT_ACCOUNTS')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition cursor-pointer ${
            activeSection === 'PAYMENT_ACCOUNTS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>5. Bank & Paybill A/Cs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('SIGNATORIES')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition cursor-pointer ${
            activeSection === 'SIGNATORIES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>6. Executive Signatories</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('CONTACT')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition cursor-pointer ${
            activeSection === 'CONTACT'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>7. Location & Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('LETTERHEAD')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition cursor-pointer ${
            activeSection === 'LETTERHEAD'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>8. Letterhead Styling</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('PREVIEW')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition cursor-pointer ${
            activeSection === 'PREVIEW'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>9. Live Document Sampler</span>
        </button>
      </div>

      {/* 1. Profile & Charters Section */}
      {activeSection === 'PROFILE' && (
        <SchoolProfileTab
          settings={formData}
          onUpdate={handleDirectUpdate}
          presetLogos={PRESET_LOGOS}
          onApplyPreset={handleApplyPreset}
        />
      )}

      {/* 2. Campuses & Branches CRUD Section */}
      {activeSection === 'CAMPUSES' && (
        <CampusesTab
          settings={formData}
          onUpdate={handleDirectUpdate}
        />
      )}

      {/* 3. Academic Departments CRUD Section */}
      {activeSection === 'DEPARTMENTS' && (
        <DepartmentsTab
          settings={formData}
          onUpdate={handleDirectUpdate}
        />
      )}

      {/* 4. Academic Calendar & Sessions CRUD Section */}
      {activeSection === 'ACADEMIC_CALENDAR' && (
        <AcademicTermsTab
          settings={formData}
          onUpdate={handleDirectUpdate}
        />
      )}

      {/* 5. Bank & Payment Accounts CRUD Section */}
      {activeSection === 'PAYMENT_ACCOUNTS' && (
        <PaymentAccountsTab
          settings={formData}
          onUpdate={handleDirectUpdate}
        />
      )}

      {/* Main Form Content for CONTACT, SIGNATORIES, LETTERHEAD, PREVIEW */}
      {['CONTACT', 'SIGNATORIES', 'LETTERHEAD', 'PREVIEW'].includes(activeSection) && (
        <form onSubmit={handleSave} className="space-y-6">

        {/* =========================================================================
            SECTION 2: LOCATION & CONTACT INFO
            ========================================================================= */}
        {activeSection === 'CONTACT' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Physical Campus Location & Contact Channels
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Official postal addresses and electronic contact lines displayed in the letterhead sub-header.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-slate-300">Campus Address (Line 1) *</label>
                <input
                  type="text"
                  required
                  value={formData.addressLine1}
                  onChange={e => handleChange('addressLine1', e.target.value)}
                  placeholder="e.g. 100 Innovation Boulevard, University Science Park"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-slate-300">Campus Address (Line 2 / Senate Building)</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={e => handleChange('addressLine2', e.target.value)}
                  placeholder="e.g. Senate Building, Academic Complex"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">City / Municipality</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                  placeholder="e.g. Tech City"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">State / Province / Country</label>
                <input
                  type="text"
                  value={formData.stateCountry}
                  onChange={e => handleChange('stateCountry', e.target.value)}
                  placeholder="e.g. California, USA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Postal / ZIP Code</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={e => handleChange('postalCode', e.target.value)}
                  placeholder="e.g. 94043"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Official General Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="e.g. +1 (800) 555-APEX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Main Institutional Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="e.g. info@apex.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Admissions Office Email</label>
                <input
                  type="email"
                  value={formData.admissionEmail}
                  onChange={e => handleChange('admissionEmail', e.target.value)}
                  placeholder="e.g. admissions@apex.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Official Web Portal URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={e => handleChange('website', e.target.value)}
                  placeholder="e.g. https://www.apex.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Public Document Verification Portal</label>
                <input
                  type="url"
                  value={formData.securityVerificationUrl}
                  onChange={e => handleChange('securityVerificationUrl', e.target.value)}
                  placeholder="e.g. https://apex.edu/verify/sec-doc"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 3: EXECUTIVE SIGNATORIES
            ========================================================================= */}
        {activeSection === 'SIGNATORIES' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-400" />
                Authorized Executive Signatories & Seal Bearers
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure names, formal titles, and digitized signatures for the University Registrar, Vice Chancellor, and Bursar appearing in the document letterhead footer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              
              {/* Registrar */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    University Registrar (Senate Authority)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    Primary Signatory
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="font-semibold text-slate-300">Registrar Full Name & Post-Nominals</label>
                    <input
                      type="text"
                      value={formData.registrarName}
                      onChange={e => handleChange('registrarName', e.target.value)}
                      placeholder="e.g. Prof. Walter Sterling, Ph.D"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300">Official Title</label>
                    <input
                      type="text"
                      value={formData.registrarTitle}
                      onChange={e => handleChange('registrarTitle', e.target.value)}
                      placeholder="e.g. Registrar & Secretary to Senate"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300">Digitized Signature Image URL</label>
                    <input
                      type="url"
                      value={formData.registrarSignatureUrl}
                      onChange={e => handleChange('registrarSignatureUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bursar */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    University Bursar (Financial Officer)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Bursary Signatory
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="font-semibold text-slate-300">Bursar Full Name & Honors</label>
                    <input
                      type="text"
                      value={formData.bursarName}
                      onChange={e => handleChange('bursarName', e.target.value)}
                      placeholder="e.g. Dr. Robert Thorne, FCA, ACTI"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300">Official Title</label>
                    <input
                      type="text"
                      value={formData.bursarTitle}
                      onChange={e => handleChange('bursarTitle', e.target.value)}
                      placeholder="e.g. University Bursar & Chief Financial Officer"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300">Digitized Signature Image URL</label>
                    <input
                      type="url"
                      value={formData.bursarSignatureUrl}
                      onChange={e => handleChange('bursarSignatureUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vice Chancellor */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Vice Chancellor / President (Executive Head)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Chief Academic Officer
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-300">Vice Chancellor Full Name</label>
                    <input
                      type="text"
                      value={formData.viceChancellorName}
                      onChange={e => handleChange('viceChancellorName', e.target.value)}
                      placeholder="e.g. Prof. Arthur Vance, Ph.D, FNAS"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-300">Executive Title</label>
                    <input
                      type="text"
                      value={formData.viceChancellorTitle}
                      onChange={e => handleChange('viceChancellorTitle', e.target.value)}
                      placeholder="e.g. Vice Chancellor & President"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 4: LETTERHEAD STYLING & SECURITY
            ========================================================================= */}
        {activeSection === 'LETTERHEAD' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                Document Letterhead Geometry, Palettes & Anti-Fraud Features
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize colors, header styles, background watermark opacity, and security verification footer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Primary Brand Accent (Letterhead Title)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primaryColor || '#1e3a8a'}
                    onChange={e => handleChange('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor || '#1e3a8a'}
                    onChange={e => handleChange('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Secondary Accent (Ribbons & Borders)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.accentColor || '#d97706'}
                    onChange={e => handleChange('accentColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.accentColor || '#d97706'}
                    onChange={e => handleChange('accentColor', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Letterhead Header Layout Style</label>
                <select
                  value={formData.letterheadHeaderStyle || 'CLASSIC_CREST'}
                  onChange={e => handleChange('letterheadHeaderStyle', e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                >
                  <option value="CLASSIC_CREST">Classic Academic Shield Crest</option>
                  <option value="MODERN_BANNER">Modern Minimalist Corporate Banner</option>
                  <option value="MINIMAL_ACADEMIC">Formal Senate Academic Standard</option>
                  <option value="EMBOSSED_SEAL">Royal Embossed Stamp Header</option>
                </select>
              </div>

              <div className="sm:col-span-3 space-y-2 p-4 rounded-xl bg-slate-850 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300">Background Watermark Crest Opacity</label>
                  <span className="font-mono text-blue-400 font-bold">
                    {Math.round((formData.watermarkOpacity || 0.05) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.25"
                  step="0.01"
                  value={formData.watermarkOpacity || 0.05}
                  onChange={e => handleChange('watermarkOpacity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-[11px] text-slate-500">
                  Subtle institutional crest watermark rendered in the background of printed documents to prevent photocopying fraud.
                </p>
              </div>

              <div className="sm:col-span-3 space-y-3 p-4 rounded-xl bg-slate-850 border border-slate-800">
                <span className="font-semibold text-white block">Document Security & Anti-Tampering Features</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableQrValidation !== false}
                      onChange={e => handleChange('enableQrValidation', e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-white block">Live QR Verification</span>
                      <span className="text-[10px] text-slate-400">Embed security QR code</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableDigitalSignatures !== false}
                      onChange={e => handleChange('enableDigitalSignatures', e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-white block">Digital Signatures</span>
                      <span className="text-[10px] text-slate-400">Render digitized signatures</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableEmbossedSeal !== false}
                      onChange={e => handleChange('enableEmbossedSeal', e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-white block">Embossed University Seal</span>
                      <span className="text-[10px] text-slate-400">Display official rosette seal</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="sm:col-span-3 space-y-1.5">
                <label className="font-semibold text-slate-300">Letterhead Legal Disclaimer & Statutory Footer</label>
                <textarea
                  rows={3}
                  value={formData.footerLegalText}
                  onChange={e => handleChange('footerLegalText', e.target.value)}
                  placeholder="Official computer generated document legal disclaimer..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed font-mono"
                />
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 5: LIVE DOCUMENT SAMPLER
            ========================================================================= */}
        {activeSection === 'PREVIEW' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-purple-400" />
                  Live Official Document Generator & Letterhead Sampler
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Test and generate all institutional document formats with the active letterhead, crest, and footer signatures.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={previewDocType}
                  onChange={e => setPreviewDocType(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                >
                  <option value="TRANSCRIPT">Official Academic Transcript</option>
                  <option value="RECEIPT">Bursary Payment Receipt</option>
                  <option value="ADMISSION_LETTER">Admission Offer Letter</option>
                  <option value="BROADSHEET">Senate Examination Broadsheet</option>
                  <option value="CLEARANCE_CERTIFICATE">Graduation Clearance Certificate</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleTestGenerateSampleDoc(previewDocType)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  Generate Document
                </button>
              </div>
            </div>

            {/* Document Gallery Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                    Academic Transcript
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    Student Portal
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Full semester course breakdown, grades, credit units, GPA calculations, and Senate honors classification under official crest.
                </p>
                <button
                  type="button"
                  onClick={() => handleTestGenerateSampleDoc('TRANSCRIPT')}
                  className="w-full py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition cursor-pointer"
                >
                  Open Sample Transcript
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    Bursary Fee Receipt
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Finance Portal
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Financial ledger receipt with transaction reference, statutory fee schedule breakdown, and verified Bursar signature.
                </p>
                <button
                  type="button"
                  onClick={() => handleTestGenerateSampleDoc('RECEIPT')}
                  className="w-full py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition cursor-pointer"
                >
                  Open Sample Receipt
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Admission Offer Letter
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Admissions Portal
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Provisional admission offer with candidate details, matriculation guidelines, and Registrar statutory seal.
                </p>
                <button
                  type="button"
                  onClick={() => handleTestGenerateSampleDoc('ADMISSION_LETTER')}
                  className="w-full py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition cursor-pointer"
                >
                  Open Sample Offer Letter
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                    Senate Broadsheet
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    Exams Portal
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Official departmental examination results master sheet with CA/Exam score distribution and moderation sign-offs.
                </p>
                <button
                  type="button"
                  onClick={() => handleTestGenerateSampleDoc('BROADSHEET')}
                  className="w-full py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition cursor-pointer"
                >
                  Open Sample Broadsheet
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    Graduation Clearance
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Registry & Senate
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Multi-unit clearance certificate verifying zero financial, library, hostel, or disciplinary encumbrances.
                </p>
                <button
                  type="button"
                  onClick={() => handleTestGenerateSampleDoc('CLEARANCE_CERTIFICATE')}
                  className="w-full py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
                >
                  Open Sample Clearance
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Changes take effect immediately across all micro-portal document exports.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Institutional Configuration
            </button>
          </div>
        </div>

      </form>
      )}
    </div>
  );
}
