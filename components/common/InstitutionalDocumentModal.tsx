'use client';

import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Building2,
  QrCode,
  Award,
  Calendar,
  UserCheck,
  CheckCircle2,
  FileCheck,
  ExternalLink,
  Lock,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { useERP } from '@/context/erp-context';
import { InstitutionalDocPayload } from '@/types/erp';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payload: InstitutionalDocPayload | null;
}

export function InstitutionalDocumentModal({ isOpen, onClose, payload }: Props) {
  const { institutionalSettings } = useERP();
  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !payload) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCopy = () => {
    const docName = (payload.docType || 'doc').toLowerCase();
    const docNum = (payload.docNumber || payload.documentNumber || 'export').replace(/[^a-zA-Z0-9_-]/g, '_');
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      institution: institutionalSettings,
      document: payload,
      generatedAt: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${docName}_${docNum}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getDocTypeBadge = (type: string) => {
    switch (type) {
      case 'TRANSCRIPT':
        return { label: 'Official Academic Transcript', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'RECEIPT':
        return { label: 'Official Bursary Payment Receipt', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'ADMISSION_LETTER':
        return { label: 'Provisional Admission Offer Letter', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'BROADSHEET':
        return { label: 'Senate Official Examination Broadsheet', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'CLEARANCE_CERTIFICATE':
        return { label: 'Final Institutional Clearance Certificate', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'STAFF_APPOINTMENT':
        return { label: 'Staff Appointment & Governance Brief', color: 'bg-slate-50 text-slate-800 border-slate-200' };
      case 'COURSE_REGISTRATION':
        return { label: 'Official Course Registration Slip', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' };
      default:
        return { label: 'Official University Document', color: 'bg-slate-50 text-slate-800 border-slate-200' };
    }
  };

  const docNumber = payload.docNumber || payload.documentNumber || 'DOC-2026-001';
  const issueDate = payload.issueDate || payload.date || 'August 24, 2026';
  const docType = payload.docType || 'CUSTOM_REPORT';
  const docVerificationCode = payload.docVerificationCode || payload.verificationHash || docNumber.replace(/[^a-zA-Z0-9]/g, '').slice(-8);
  const recipientIdentifier = payload.recipientIdentifier || payload.recipientId;
  const recipientDepartment = payload.recipientDepartment || payload.recipientDept;
  const subtitle = payload.subtitle || payload.subTitle;

  const badgeInfo = getDocTypeBadge(String(docType));

  return (
    <div
      id="institutional-doc-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-100 rounded-2xl shadow-2xl overflow-hidden border border-slate-300">
        
        {/* Top Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white">{badgeInfo.label}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {docNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Issued by {institutionalSettings.name} • {issueDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="doc-print-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              id="doc-download-json-btn"
              onClick={handleDownloadCopy}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Download Data Manifest"
            >
              <Download className="w-4 h-4" />
              Export Manifest
            </button>
            <button
              id="doc-close-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Canvas Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/70">
          <div
            ref={printContainerRef}
            id="institutional-letterhead-document"
            className="relative mx-auto bg-white rounded-lg shadow-lg border border-slate-300 max-w-[210mm] min-h-[297mm] p-8 sm:p-12 text-slate-800 flex flex-col justify-between overflow-hidden print:p-8 print:shadow-none print:border-none print:max-w-none print:w-full print:m-0"
            style={{
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            {/* Watermark Crest */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center select-none"
              style={{ opacity: institutionalSettings.watermarkOpacity || 0.05 }}
            >
              {institutionalSettings.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={institutionalSettings.logoUrl}
                  alt="Watermark Crest"
                  className="w-96 h-96 object-contain grayscale"
                />
              ) : (
                <Building2 className="w-96 h-96 text-slate-900" />
              )}
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col h-full justify-between">
              
              {/* =========================================================================
                  LETTERHEAD HEADER (DYNAMICALLY SET FROM ADMIN SIDE)
                  ========================================================================= */}
              <header className="border-b-2 pb-6 mb-6" style={{ borderColor: institutionalSettings.primaryColor || '#1e3a8a' }}>
                <div className="flex items-start justify-between gap-6">
                  
                  {/* Left: Crest Logo */}
                  <div className="shrink-0 flex flex-col items-center">
                    {institutionalSettings.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={institutionalSettings.logoUrl}
                        alt="Institutional Crest"
                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-lg border border-slate-200 p-1 bg-white shadow-xs"
                      />
                    ) : (
                      <div
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg flex items-center justify-center text-white font-serif text-3xl font-bold shadow-xs"
                        style={{ backgroundColor: institutionalSettings.primaryColor || '#1e3a8a' }}
                      >
                        {institutionalSettings.shortName || 'AIT'}
                      </div>
                    )}
                    {institutionalSettings.establishedYear && (
                      <span className="text-[10px] text-slate-500 font-sans mt-1 font-semibold">
                        EST. {institutionalSettings.establishedYear}
                      </span>
                    )}
                  </div>

                  {/* Center: University Title & Details */}
                  <div className="flex-1 text-center font-serif">
                    <h1
                      className="text-xl sm:text-2xl font-bold tracking-wide uppercase leading-tight"
                      style={{ color: institutionalSettings.primaryColor || '#1e3a8a' }}
                    >
                      {institutionalSettings.name}
                    </h1>
                    
                    {institutionalSettings.motto && (
                      <p className="text-xs italic text-slate-600 my-1 font-serif">
                        &ldquo;{institutionalSettings.motto}&rdquo;
                      </p>
                    )}

                    {institutionalSettings.accreditationBody && (
                      <p className="text-[11px] font-sans text-slate-500 uppercase tracking-wider font-semibold">
                        {institutionalSettings.accreditationBody}
                      </p>
                    )}

                    <div className="mt-2 text-xs font-sans text-slate-600 space-y-0.5">
                      <p>
                        {institutionalSettings.addressLine1}
                        {institutionalSettings.addressLine2 ? `, ${institutionalSettings.addressLine2}` : ''}
                      </p>
                      <p>
                        {institutionalSettings.city}, {institutionalSettings.stateCountry} • Postal Code: {institutionalSettings.postalCode}
                      </p>
                      <p className="flex items-center justify-center gap-3 text-[11px] pt-1">
                        <span>Tel: {institutionalSettings.phone}</span>
                        <span>•</span>
                        <span>Email: {institutionalSettings.email}</span>
                        <span>•</span>
                        <span>Web: {institutionalSettings.website}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Security & QR Code Validation */}
                  <div className="shrink-0 flex flex-col items-center justify-center text-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="p-1.5 bg-white rounded border border-slate-300 shadow-2xs">
                      <QrCode className="w-14 h-14 text-slate-800" />
                    </div>
                    <span className="text-[9px] font-sans font-bold text-slate-700 mt-1 uppercase tracking-wider">
                      VERIFIED DOC
                    </span>
                    <span className="text-[8px] font-mono text-slate-500">
                      {docVerificationCode}
                    </span>
                  </div>

                </div>

                {/* Sub-Header Accent Ribbon */}
                <div
                  className="mt-4 pt-2 border-t flex flex-wrap items-center justify-between text-xs font-sans font-medium text-slate-700"
                  style={{ borderTopColor: institutionalSettings.accentColor || '#d97706' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">Issuing Authority:</span>
                    <span>{payload.issuingAuthority || 'Office of the University Registrar & Senate'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span><strong>Date:</strong> {issueDate}</span>
                    <span><strong>Ref:</strong> <span className="font-mono">{docNumber}</span></span>
                  </div>
                </div>
              </header>

              {/* =========================================================================
                  DOCUMENT BODY (WELL-DESIGNED FOR EACH SPECIFIC DOCUMENT TYPE)
                  ========================================================================= */}
              <main className="flex-1 font-sans text-slate-800 text-sm space-y-6">
                
                {/* Document Title Banner */}
                <div className="text-center py-2 border-y border-slate-200 bg-slate-50/80">
                  <h2 className="text-base sm:text-lg font-bold font-serif uppercase tracking-wider text-slate-900">
                    {payload.title}
                  </h2>
                  {subtitle && (
                    <p className="text-xs font-medium text-slate-600 mt-0.5">{subtitle}</p>
                  )}
                </div>

                {/* Recipient Details & Meta Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50/60 border border-slate-200/80 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex">
                      <span className="w-32 font-semibold text-slate-600">Recipient / Subject:</span>
                      <span className="font-bold text-slate-900">{payload.recipientName}</span>
                    </div>
                    {recipientIdentifier && (
                      <div className="flex">
                        <span className="w-32 font-semibold text-slate-600">Registration / ID:</span>
                        <span className="font-mono font-bold text-slate-900">{recipientIdentifier}</span>
                      </div>
                    )}
                    {payload.recipientFaculty && (
                      <div className="flex">
                        <span className="w-32 font-semibold text-slate-600">Faculty / Division:</span>
                        <span className="text-slate-800">{payload.recipientFaculty}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {recipientDepartment && (
                      <div className="flex">
                        <span className="w-32 font-semibold text-slate-600">Department / Unit:</span>
                        <span className="text-slate-800">{recipientDepartment}</span>
                      </div>
                    )}
                    {payload.recipientProgram && (
                      <div className="flex">
                        <span className="w-32 font-semibold text-slate-600">Degree / Program:</span>
                        <span className="font-semibold text-slate-900">{payload.recipientProgram}</span>
                      </div>
                    )}
                    {payload.recipientLevel && (
                      <div className="flex">
                        <span className="w-32 font-semibold text-slate-600">Academic Level:</span>
                        <span className="text-slate-800">{payload.recipientLevel}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Narrative / Salutation Text */}
                {payload.contentBody && (
                  <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-line font-serif text-justify px-1">
                    {payload.contentBody}
                  </div>
                )}

                {/* Paragraphs if provided */}
                {payload.bodyParagraphs && payload.bodyParagraphs.length > 0 && (
                  <div className="space-y-3 text-xs leading-relaxed text-slate-700 font-serif text-justify px-1">
                    {payload.bodyParagraphs.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                )}

                {/* Structured Table (Transcripts, Receipts, Broadsheets, Clearance) */}
                {payload.tableData && payload.tableData.rows && payload.tableData.rows.length > 0 && (
                  <div className="overflow-x-auto rounded border border-slate-300">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 border-b border-slate-300">
                          {payload.tableData.headers.map((header, idx) => (
                            <th key={idx} className="p-2.5 font-bold uppercase tracking-wider text-[11px]">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {payload.tableData.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2 text-slate-700 font-mono text-[11px]">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                      {payload.tableData.summaryRow && (
                        <tfoot>
                          <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                            {payload.tableData.summaryRow.map((sumCell, sIdx) => (
                              <td key={sIdx} className="p-2.5 font-mono text-xs">
                                {sumCell}
                              </td>
                            ))}
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                )}

                {/* Additional Key-Value Badges or Metadata */}
                {payload.metadata && Object.keys(payload.metadata).length > 0 && (
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                    <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] mb-2">
                      Official Validation Notes & Classifications
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(payload.metadata).map(([key, val]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-[10px] text-slate-500 font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span className="font-semibold text-slate-900">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </main>

              {/* =========================================================================
                  LETTERHEAD FOOTER (DYNAMICALLY SET FROM ADMIN SIDE)
                  ========================================================================= */}
              <footer className="mt-8 pt-6 border-t border-slate-300 font-sans text-xs">
                
                {/* Signatories & Embossed Seal */}
                <div className="grid grid-cols-3 gap-4 items-end mb-6">
                  
                  {/* Signatory 1 (Registrar / Approver) */}
                  <div className="text-center">
                    {institutionalSettings.enableDigitalSignatures && institutionalSettings.registrarSignatureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={institutionalSettings.registrarSignatureUrl}
                        alt="Registrar Signature"
                        className="h-10 mx-auto object-contain mb-1 filter grayscale"
                      />
                    ) : (
                      <div className="h-10 flex items-center justify-center italic font-serif text-slate-500">
                        [Digitally Signed via Token]
                      </div>
                    )}
                    <div className="border-t border-slate-400 pt-1 font-serif">
                      <p className="font-bold text-slate-900 text-xs">
                        {payload.signatoryName || institutionalSettings.registrarName}
                      </p>
                      <p className="text-[10px] text-slate-600">
                        {payload.signatoryTitle || institutionalSettings.registrarTitle}
                      </p>
                    </div>
                  </div>

                  {/* Center: Official Embossed Stamp */}
                  <div className="text-center flex flex-col items-center justify-center">
                    {institutionalSettings.enableEmbossedSeal ? (
                      <div
                        className="w-16 h-16 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-1 shadow-xs"
                        style={{ borderColor: institutionalSettings.accentColor || '#d97706' }}
                      >
                        <Award className="w-6 h-6" style={{ color: institutionalSettings.accentColor || '#d97706' }} />
                        <span className="text-[7px] font-bold uppercase tracking-tighter text-slate-700 mt-0.5">
                          OFFICIAL SEAL
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Signatory 2 (Bursar / VC / Dean) */}
                  <div className="text-center">
                    {institutionalSettings.enableDigitalSignatures && institutionalSettings.bursarSignatureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={institutionalSettings.bursarSignatureUrl}
                        alt="Bursar Signature"
                        className="h-10 mx-auto object-contain mb-1 filter grayscale"
                      />
                    ) : (
                      <div className="h-10 flex items-center justify-center italic font-serif text-slate-500">
                        [Digitally Signed via Token]
                      </div>
                    )}
                    <div className="border-t border-slate-400 pt-1 font-serif">
                      <p className="font-bold text-slate-900 text-xs">{institutionalSettings.bursarName}</p>
                      <p className="text-[10px] text-slate-600">{institutionalSettings.bursarTitle}</p>
                    </div>
                  </div>

                </div>

                {/* Footer Legal & Security Verification Text */}
                <div className="text-[10px] text-slate-500 text-center leading-tight space-y-1 border-t border-slate-200 pt-3">
                  <p>{institutionalSettings.footerLegalText}</p>
                  <p className="font-mono text-[9px] text-slate-400">
                    Security Token: {docVerificationCode} • Generated on {new Date().toLocaleString()} • Page 1 of 1
                  </p>
                </div>

              </footer>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
