'use client';

import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  UserCheck,
  GraduationCap,
  Users,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Layers,
  Calendar,
  Building,
  UserPlus
} from 'lucide-react';
import { useERP } from '@/context/erp-context';
import {
  INITIAL_STUDENT_MASTER_RECORDS,
  INITIAL_APPLICANTS_DATA,
  KENYAN_PUBLIC_PROGRAMMES
} from '@/lib/kenyan-tvet-data';
import { StudentMasterRecord, ApplicantMasterRecord } from '@/types/erp';

export default function RegistrarPortalView() {
  const { institutionalSettings, openInstitutionalDocument, currentUser } = useERP();

  const [activeTab, setActiveTab] = useState<'STUDENT_REGISTRY' | 'ADMISSION_HANDOVER' | 'ACADEMIC_CALENDAR' | 'TRANSCRIPTS'>('STUDENT_REGISTRY');

  const [students, setStudents] = useState<StudentMasterRecord[]>(INITIAL_STUDENT_MASTER_RECORDS);
  const [applicants, setApplicants] = useState<ApplicantMasterRecord[]>(INITIAL_APPLICANTS_DATA);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDept, setFilterDept] = useState<string>('ALL');

  const filteredStudents = students.filter(stu => {
    const matchSearch =
      stu.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stu.nationalIdNumber && stu.nationalIdNumber.includes(searchQuery)) ||
      (stu.programmeCode && stu.programmeCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = filterStatus === 'ALL' || stu.academicStatus === filterStatus;
    const matchDept = filterDept === 'ALL' || stu.departmentId === filterDept;

    return matchSearch && matchStatus && matchDept;
  });

  // Matriculate / Admit an applicant to registered student
  const handleMatriculateApplicant = (app: ApplicantMasterRecord) => {
    const nextIndex = students.length + 1;
    const newAdmNo = `CIT/2026/0${String(nextIndex).padStart(2, '0')}`;
    const newStudent: StudentMasterRecord = {
      id: `stu_${app.id}_enrolled`,
      admissionNumber: newAdmNo,
      nationalIdNumber: app.nationalIdNumber || '39102938',
      kcseIndexNumber: app.kcseIndexNumber || '20401102049',
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      gender: app.gender || 'MALE',
      programmeId: app.programmeId || 'prog_dict_01',
      programmeCode: app.programmeCode || 'DICT',
      programmeName: app.programmeName || 'Diploma in Information Communication Technology',
      departmentId: 'dept_computing',
      departmentName: 'Department of Computing & Applied Sciences',
      qualificationLevel: app.qualificationLevel || 'DIPLOMA',
      examiningBody: app.examiningBody || 'KNEC',
      cohortYear: '2026',
      intakePeriod: app.intakePeriod || 'MAY_2026',
      academicStatus: 'ACTIVE',
      currentTerm: 1,
      totalTerms: 6,
      feeBalance: 0,
      industrialAttachmentCompleted: false,
      dateAdmitted: new Date().toISOString().split('T')[0]
    };

    setStudents(prev => [newStudent, ...prev]);
    setApplicants(prev => prev.map(a => a.id === app.id ? { ...a, status: 'ADMITTED' } : a));

    alert(`Applicant ${app.fullName} matriculated successfully with Admission Number: ${newAdmNo}`);
  };

  const handleUpdateStudentStatus = (studentId: string, newStatus: StudentMasterRecord['academicStatus']) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, academicStatus: newStatus } : s));
  };

  const handlePrintStudentTranscript = (stu: StudentMasterRecord) => {
    openInstitutionalDocument({
      docType: 'OFFICIAL_TRANSCRIPT',
      title: 'ACADEMIC TRANSCRIPT OF RESULTS',
      subtitle: `${stu.programmeName} (${stu.programmeCode}) • Examining Body: ${stu.examiningBody}`,
      recipientName: stu.fullName,
      recipientIdentifier: stu.admissionNumber,
      issueDate: new Date().toISOString().split('T')[0],
      academicSession: '2026/2027 Academic Year',
      contentBody: `This is to certify that ${stu.fullName} (Admission No: ${stu.admissionNumber}, KCSE Index: ${stu.kcseIndexNumber || 'N/A'}) has been duly enrolled and assessed in the Department of ${stu.departmentName}.\n\nExamining Body: ${stu.examiningBody} • Qualification Level: ${(stu.qualificationLevel || 'DIPLOMA').replace('_', ' ')}`,
      tableData: {
        headers: ['Unit Code', 'Unit Title', 'Term', 'Mark (%)', 'Grade', 'Remarks'],
        rows: [
          ['DICT 101', 'Computer Programming with C++', 'Term 1', '78', 'Distinction', 'Pass'],
          ['DICT 102', 'Relational Database Management Systems', 'Term 1', '82', 'Distinction', 'Pass'],
          ['DICT 103', 'Computer Networking & Cisco Fundamentals', 'Term 1', '74', 'Credit', 'Pass'],
          ['DICT 104', 'Operating Systems & Linux Administration', 'Term 1', '70', 'Credit', 'Pass'],
          ['COMM 101', 'Communication Skills & Ethics', 'Term 1', '85', 'Distinction', 'Pass'],
          ['MATH 101', 'Discrete Mathematics for Computing', 'Term 1', '68', 'Credit', 'Pass']
        ]
      },
      signatoryName: institutionalSettings.registrarName,
      signatoryTitle: institutionalSettings.registrarTitle
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                Office of Academic Affairs
              </span>
              <h1 className="text-xl font-bold">Registrar (Academic Affairs) Portal</h1>
              <p className="text-xs text-slate-400">
                Central Trainee Master Registry • Registrar: {institutionalSettings.registrarName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('STUDENT_REGISTRY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'STUDENT_REGISTRY' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Trainee Master Registry
            </button>
            <button
              onClick={() => setActiveTab('ADMISSION_HANDOVER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'ADMISSION_HANDOVER' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Matriculation Handover
            </button>
            <button
              onClick={() => setActiveTab('ACADEMIC_CALENDAR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'ACADEMIC_CALENDAR' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Academic Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* TAB 1: CENTRAL STUDENT MASTER REGISTRY */}
        {activeTab === 'STUDENT_REGISTRY' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Institutional Trainee Master Database</h2>
                <p className="text-xs text-slate-500">
                  Total Active Records: <strong>{students.length}</strong> Trainees
                </p>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Adm No, Name, National ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="ALL">All Academic Statuses</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ATTACHMENT">ON INDUSTRIAL ATTACHMENT</option>
                  <option value="DEFERRED">DEFERRED</option>
                  <option value="GRADUATED">GRADUATED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              <div>
                <select
                  value={filterDept}
                  onChange={e => setFilterDept(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="ALL">All Departments</option>
                  <option value="dept_computing">Computing & Applied Sciences</option>
                  <option value="dept_electrical">Electrical & Electronics</option>
                  <option value="dept_building">Building & Civil Engineering</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-y border-slate-200 text-slate-600 font-bold uppercase">
                    <th className="p-3">Admission No</th>
                    <th className="p-3">Trainee Name</th>
                    <th className="p-3">Programme & Level</th>
                    <th className="p-3">Exam Body</th>
                    <th className="p-3">Current Term</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStudents.map(stu => (
                    <tr key={stu.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-blue-900">{stu.admissionNumber}</td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{stu.fullName}</span>
                        <span className="text-[11px] text-slate-500">ID: {stu.nationalIdNumber} • KCSE: {stu.kcseIndexNumber}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-slate-900 block">{stu.programmeName}</span>
                        <span className="text-[11px] text-slate-500">[{stu.programmeCode}] • {stu.qualificationLevel}</span>
                      </td>
                      <td className="p-3 font-semibold">{stu.examiningBody}</td>
                      <td className="p-3 font-semibold">Term {stu.currentTerm} of {stu.totalTerms}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          stu.academicStatus === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : stu.academicStatus === 'ATTACHMENT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {stu.academicStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePrintStudentTranscript(stu)}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-semibold text-[11px]"
                          >
                            Transcript
                          </button>
                          <select
                            value={stu.academicStatus}
                            onChange={e => handleUpdateStudentStatus(stu.id, e.target.value as any)}
                            className="text-[11px] p-1 bg-slate-50 border border-slate-300 rounded"
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="ATTACHMENT">Attachment</option>
                            <option value="DEFERRED">Defer</option>
                            <option value="GRADUATED">Graduate</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ADMISSION HANDOVER & MATRICULATION */}
        {activeTab === 'ADMISSION_HANDOVER' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Admissions Handover & Matriculation Queue</h2>
              <p className="text-xs text-slate-500">
                Verified applicants with confirmed M-Pesa application fees ready for official registration.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-y border-slate-200 text-slate-600 font-bold uppercase">
                    <th className="p-3">Ref No</th>
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Programme</th>
                    <th className="p-3">KCSE Mean Grade</th>
                    <th className="p-3">Fee Receipt</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {applicants.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{app.applicationNumber}</td>
                      <td className="p-3 font-bold text-slate-900">{app.fullName}</td>
                      <td className="p-3">{app.programmeName} ({app.programmeCode})</td>
                      <td className="p-3 font-semibold">{app.kcseMeanGrade}</td>
                      <td className="p-3 font-mono text-[11px] text-emerald-700">{app.mpesaReceiptNumber}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          app.status === 'ADMITTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {app.status !== 'ADMITTED' ? (
                          <button
                            onClick={() => handleMatriculateApplicant(app)}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-[11px] flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Matriculate</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px]">Enrolled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ACADEMIC CALENDAR */}
        {activeTab === 'ACADEMIC_CALENDAR' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Institutional Academic Calendar 2026/2027</h2>
              <p className="text-xs text-slate-500">Key dates for term commencement, KNEC/CDACC exam series, and industrial attachment cycles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-blue-950 text-sm">Term 1 (May - July 2026)</div>
                <div className="text-blue-800">Reporting Date: 4th May 2026</div>
                <div className="text-blue-800">Mid-Term Assessments: 15th - 19th June 2026</div>
                <div className="text-blue-800">KNEC Series Examinations: 20th - 31st July 2026</div>
              </div>

              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-emerald-950 text-sm">Industrial Attachment Cycle 1</div>
                <div className="text-emerald-800">Placement Period: 1st August - 31st October 2026</div>
                <div className="text-emerald-800">Site Assessment Visits: September 2026</div>
                <div className="text-emerald-800">Logbook Submission: 10th November 2026</div>
              </div>

              <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-amber-950 text-sm">Term 2 (September - December 2026)</div>
                <div className="text-amber-800">Reporting Date: 7th September 2026</div>
                <div className="text-amber-800">Annual Graduation Ceremony: 4th December 2026</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
