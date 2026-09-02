// Kenyan TVET & College ERP Master Data Architecture
// Comprehensive Domain Models and Seed Records

import {
  PublicProgrammeItem,
  PublicNewsItem,
  PublicDownloadItem,
  ApplicantMasterRecord,
  StudentMasterRecord,
  StudentTransactionLedgerEntry,
  MpesaPaymentTransaction,
  DepartmentCurriculum,
  LecturerUnitAllocation,
  AttachmentPlacement,
  StudentClearanceRecord,
  ProcurementRequisition,
  StoreInventoryItem
} from '@/types/erp';

export const KENYAN_COLLEGE_INFO = {
  name: 'Kenya Technical & Vocational Training College',
  shortName: 'KTVTC',
  motto: 'Skills for Industry, Technology & Innovation',
  regNumber: 'TVETA/0248/2020',
  charterYear: '1982',
  principalName: 'Dr. Josephat K. Cheruiyot, Ph.D, Eng.',
  registrarName: 'Mrs. Grace W. Mwangi, M.Ed',
  bursarName: 'Mr. David O. Omondi, CPA-K',
  deanOfStudents: 'Dr. Beatrice N. Mutua',
  industrialAttachmentOfficer: 'Eng. Patrick K. Kiprono',
  contact: {
    mainCampus: 'Nairobi Main Campus, Off Ngong Road, Nairobi',
    townCampus: 'CBD Town Campus, Pension Towers 4th Floor, Nairobi',
    riftCampus: 'Nakuru Western Campus, Technology Way, Nakuru',
    postalAddress: 'P.O. Box 45321 - 00100, Nairobi, Kenya',
    phone: '+254 (0) 20 271 8900 / +254 712 345 678',
    email: 'info@ktvtc.ac.ke',
    admissionsEmail: 'admissions@ktvtc.ac.ke',
    registrarEmail: 'registrar@ktvtc.ac.ke',
    financeEmail: 'bursar@ktvtc.ac.ke',
    paybillNumber: '247247',
    paybillAccountGuide: 'Enter your Admission No or Application No (e.g. CIT/2026/049 or APP-2026-0842)'
  }
};

export const KENYAN_PUBLIC_PROGRAMMES: PublicProgrammeItem[] = [
  {
    id: 'prog_dict_01',
    code: 'DICT-01',
    name: 'Diploma in Information Communication Technology (DICT)',
    departmentId: 'dept_computing',
    departmentName: 'Department of Computing & Informatics',
    facultyName: 'School of Applied Sciences & Technology',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'KNEC',
    durationMonths: 36,
    durationTerms: 9,
    studyMode: 'FULL_TIME',
    campus: 'Nairobi Main Campus & Nakuru Campus',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade C- (Minus) with at least C- in Mathematics and English / Kiswahili, or relevant Craft Certificate in IT.',
    kcseRequirement: 'KCSE C- (Minus)',
    tuitionFeePerTerm: 18500,
    totalEstimatedFee: 166500,
    careerOutcomes: [
      'Systems & Network Administrator',
      'Database Administrator & Analyst',
      'Full Stack Web & Software Developer',
      'ICT Support Engineer & Consultant',
      'Cybersecurity & Network Analyst'
    ],
    accreditation: 'TVETA Accredited - Reg. TVETA/0248/2020 • KNEC Approved Exam Centre #20401102',
    featured: true
  },
  {
    id: 'prog_cdacc_sw_02',
    code: 'CDACC-SWE-06',
    name: 'Diploma in Software Engineering (CBET Level 6)',
    departmentId: 'dept_computing',
    departmentName: 'Department of Computing & Informatics',
    facultyName: 'School of Applied Sciences & Technology',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'TVET_CDACC',
    durationMonths: 36,
    durationTerms: 9,
    studyMode: 'FULL_TIME',
    campus: 'Nairobi Main Campus',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade C- (Minus) or relevant Level 5 National Certificate in Software Development.',
    kcseRequirement: 'KCSE C- (Minus)',
    tuitionFeePerTerm: 20000,
    totalEstimatedFee: 180000,
    careerOutcomes: [
      'Enterprise Software Engineer',
      'Mobile Application Developer (Flutter/Android)',
      'Cloud Solutions & DevOps Specialist',
      'REST API & Microservices Engineer'
    ],
    accreditation: 'TVET CDACC Certified Competency-Based Curriculum',
    featured: true
  },
  {
    id: 'prog_cit_03',
    code: 'CIT-02',
    name: 'Craft Certificate in Information Technology (CCIT)',
    departmentId: 'dept_computing',
    departmentName: 'Department of Computing & Informatics',
    facultyName: 'School of Applied Sciences & Technology',
    qualificationLevel: 'CRAFT_CERTIFICATE',
    examiningBody: 'KNEC',
    durationMonths: 24,
    durationTerms: 6,
    studyMode: 'FULL_TIME',
    campus: 'All Campuses (Nairobi, CBD, Nakuru)',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade D (Plain) or Artisan Certificate in Information Technology.',
    kcseRequirement: 'KCSE D (Plain)',
    tuitionFeePerTerm: 16000,
    totalEstimatedFee: 96000,
    careerOutcomes: [
      'Computer Hardware & Repair Technician',
      'Junior Helpdesk Support Specialist',
      'Data Entry & Management Officer',
      'Junior Web Maintenance Assistant'
    ],
    accreditation: 'KNEC Approved Certificate Curriculum',
    featured: false
  },
  {
    id: 'prog_artisan_it_04',
    code: 'ART-ICT-01',
    name: 'Artisan in Computer Applications & Office Maintenance',
    departmentId: 'dept_computing',
    departmentName: 'Department of Computing & Informatics',
    facultyName: 'School of Applied Sciences & Technology',
    qualificationLevel: 'ARTISAN',
    examiningBody: 'NITA',
    durationMonths: 12,
    durationTerms: 3,
    studyMode: 'FULL_TIME',
    campus: 'All Campuses',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade D- (Minus) or KCPE Certificate with proof of basic literacy.',
    kcseRequirement: 'KCSE D- / KCPE',
    tuitionFeePerTerm: 14000,
    totalEstimatedFee: 42000,
    careerOutcomes: [
      'Office IT Assistant',
      'Cyber Cafe & Print Shop Operator',
      'Computer Lab Attendant'
    ],
    accreditation: 'NITA Certified Grade III Assessment',
    featured: false
  },
  {
    id: 'prog_ee_power_05',
    code: 'DEEE-PWR-01',
    name: 'Diploma in Electrical & Electronic Engineering (Power Option)',
    departmentId: 'dept_electrical',
    departmentName: 'Department of Electrical & Electronics Engineering',
    facultyName: 'School of Engineering & Built Environment',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'KNEC',
    durationMonths: 36,
    durationTerms: 9,
    studyMode: 'FULL_TIME',
    campus: 'Nairobi Main Campus Workshops',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade C- (Minus) with at least C- in Mathematics and Physics / Physical Science.',
    kcseRequirement: 'KCSE C- with Physics C-',
    tuitionFeePerTerm: 21500,
    totalEstimatedFee: 193500,
    careerOutcomes: [
      'EPRA Licensed Electrical Contractor Class B',
      'Power Generation & Substation Technician',
      'Industrial Automation & PLC Technician',
      'Solar Photovoltaic (T3) Installation Engineer'
    ],
    accreditation: 'KNEC Approved • EPRA Recognized Training Institution',
    featured: true
  },
  {
    id: 'prog_cert_elect_06',
    code: 'CEEI-02',
    name: 'Craft Certificate in Electrical Installation (Wireman)',
    departmentId: 'dept_electrical',
    departmentName: 'Department of Electrical & Electronics Engineering',
    facultyName: 'School of Engineering & Built Environment',
    qualificationLevel: 'CRAFT_CERTIFICATE',
    examiningBody: 'KNEC',
    durationMonths: 24,
    durationTerms: 6,
    studyMode: 'FULL_TIME',
    campus: 'Nairobi Main Campus & Nakuru',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade D (Plain) with D in Mathematics and Science.',
    kcseRequirement: 'KCSE D (Plain)',
    tuitionFeePerTerm: 17500,
    totalEstimatedFee: 105000,
    careerOutcomes: [
      'Domestic & Commercial Wireman (EPRA Class C2)',
      'Building Site Electrical Installer',
      'Motor Rewinding Technician'
    ],
    accreditation: 'KNEC / EPRA Registered',
    featured: false
  },
  {
    id: 'prog_auto_eng_07',
    code: 'DAUT-01',
    name: 'Diploma in Automotive Engineering & Mechatronics',
    departmentId: 'dept_mechanical',
    departmentName: 'Department of Mechanical & Automotive Engineering',
    facultyName: 'School of Engineering & Built Environment',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'KNEC',
    durationMonths: 36,
    durationTerms: 9,
    studyMode: 'FULL_TIME',
    campus: 'Nairobi Main Campus Auto Workshop',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade C- (Minus) with passes in Physics and Mathematics.',
    kcseRequirement: 'KCSE C- (Minus)',
    tuitionFeePerTerm: 22000,
    totalEstimatedFee: 198000,
    careerOutcomes: [
      'Automotive Systems Diagnostician',
      'Fleet Maintenance Manager',
      'Vehicle Mechatronics & Electronic EFI Specialist',
      'Insurance Motor Vehicle Assessor'
    ],
    accreditation: 'KNEC & NTSA Authorized Inspection Partner',
    featured: true
  },
  {
    id: 'prog_civil_build_08',
    code: 'DCIV-01',
    name: 'Diploma in Building Construction & Civil Engineering',
    departmentId: 'dept_civil',
    departmentName: 'Department of Building & Civil Engineering',
    facultyName: 'School of Engineering & Built Environment',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'KNEC',
    durationMonths: 36,
    durationTerms: 9,
    studyMode: 'FULL_TIME',
    campus: 'Nairobi Main Campus',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade C- (Minus) with C- in Mathematics and Physics.',
    kcseRequirement: 'KCSE C- (Minus)',
    tuitionFeePerTerm: 20500,
    totalEstimatedFee: 184500,
    careerOutcomes: [
      'Site Agent & Assistant Resident Engineer',
      'Structural Draftsman & CAD Technician',
      'Clerk of Works & Materials Quality Inspector',
      'Quantity Survey Assistant'
    ],
    accreditation: 'KNEC Approved • NCA Registered Training Provider',
    featured: true
  },
  {
    id: 'prog_bus_mgt_09',
    code: 'DBM-01',
    name: 'Diploma in Business Management & Entrepreneurship',
    departmentId: 'dept_business',
    departmentName: 'Department of Business & Management Studies',
    facultyName: 'School of Business & Social Sciences',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'KNEC',
    durationMonths: 36,
    durationTerms: 9,
    studyMode: 'FULL_TIME',
    campus: 'All Campuses (Nairobi, CBD, Nakuru)',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade C- (Minus) with at least D+ in English/Kiswahili and Mathematics.',
    kcseRequirement: 'KCSE C- (Minus)',
    tuitionFeePerTerm: 17000,
    totalEstimatedFee: 153000,
    careerOutcomes: [
      'Business Operations Assistant Manager',
      'Human Resource Assistant',
      'Sales & Marketing Representative',
      'Small Business & SME Entrepreneur'
    ],
    accreditation: 'KNEC Approved Curriculum',
    featured: false
  },
  {
    id: 'prog_cpa_kasneb_10',
    code: 'KAS-CPA-01',
    name: 'Certified Public Accountants (CPA Foundation & Intermediate)',
    departmentId: 'dept_business',
    departmentName: 'Department of Business & Management Studies',
    facultyName: 'School of Business & Social Sciences',
    qualificationLevel: 'CERTIFICATE',
    examiningBody: 'KASNEB',
    durationMonths: 24,
    durationTerms: 6,
    studyMode: 'PART_TIME',
    campus: 'CBD Town Campus (Evening & Weekend)',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade C+ (Plus) with C+ in Mathematics and English, or KASNEB ATD Certificate.',
    kcseRequirement: 'KCSE C+ with C+ in Math',
    tuitionFeePerTerm: 19500,
    totalEstimatedFee: 117000,
    careerOutcomes: [
      'Accountant & Internal Audit Assistant',
      'Tax Compliance Officer (KRA eTIMS)',
      'Financial Analyst & Bookkeeper'
    ],
    accreditation: 'KASNEB Accredited Tuition & Examination Centre',
    featured: true
  },
  {
    id: 'prog_hosp_fb_11',
    code: 'DHOS-01',
    name: 'Diploma in Food & Beverage Production, Sales and Service',
    departmentId: 'dept_hospitality',
    departmentName: 'Department of Hospitality & Tourism Management',
    facultyName: 'School of Hospitality, Cosmetology & Human Ecology',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'KNEC',
    durationMonths: 36,
    durationTerms: 9,
    studyMode: 'FULL_TIME',
    campus: 'Nairobi Main Campus Culinary Labs',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade C- (Minus) with D+ in Home Science or Chemistry/Biology.',
    kcseRequirement: 'KCSE C- (Minus)',
    tuitionFeePerTerm: 23000,
    totalEstimatedFee: 207000,
    careerOutcomes: [
      'Head Chef & Sous Chef',
      'Restaurant & Banquet Supervisor',
      'Food & Beverage Quality Controller',
      'Catering Business Owner'
    ],
    accreditation: 'KNEC Approved • Tourism Regulatory Authority (TRA) Recognized',
    featured: true
  },
  {
    id: 'prog_agri_12',
    code: 'DAGR-01',
    name: 'Diploma in Sustainable Agriculture & Agribusiness (CBET)',
    departmentId: 'dept_agriculture',
    departmentName: 'Department of Agricultural Sciences',
    facultyName: 'School of Applied Sciences & Technology',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'TVET_CDACC',
    durationMonths: 36,
    durationTerms: 9,
    studyMode: 'FULL_TIME',
    campus: 'Nakuru Western Campus Demo Farm',
    intakes: ['JANUARY', 'MAY', 'SEPTEMBER'],
    minimumRequirements: 'KCSE Mean Grade C- (Minus) with C- in Agriculture and Biology.',
    kcseRequirement: 'KCSE C- (Minus)',
    tuitionFeePerTerm: 19000,
    totalEstimatedFee: 171000,
    careerOutcomes: [
      'Commercial Farm Manager',
      'Agricultural Extension Officer',
      'Greenhouse & Irrigation Systems Specialist',
      'Agrovet & Produce Marketing Director'
    ],
    accreditation: 'TVET CDACC Level 6 Agricultural Qualification',
    featured: false
  }
];

export const KENYAN_PUBLIC_NEWS: PublicNewsItem[] = [
  {
    id: 'news_01',
    title: 'May & September 2026 Intakes Now Open (KUCCPS & Self-Sponsored)',
    category: 'INTAKE_ALERT',
    summary: 'Applications are invited from qualified KCSE graduates and certificate holders for Diploma, Certificate, and Artisan programmes starting in May and September 2026.',
    content: `The Academic Registrar announces that the May 2026 (Term 2) and September 2026 (Term 3) admission cycles are now open. Prospective students may apply online via the Applicant Portal or download application forms from the Downloads section.

Government-sponsored students placed through KUCCPS should download their official joining instructions and upload their placement letters. Self-sponsored applicants may submit direct applications through our portal.

Application deadline for May intake: 25th April 2026. Reporting date: 5th May 2026.`,
    publishedDate: '2026-03-01',
    author: 'Office of the Registrar',
    featured: true,
    downloadUrl: '#'
  },
  {
    id: 'news_02',
    title: 'July 2026 KNEC & TVET CDACC Series Exam Registration Deadline',
    category: 'EXAMINATION_NOTICE',
    summary: 'All final year and modular candidate students must verify their examination registration and submit national ID copies before 30th March 2026.',
    content: `All candidates preparing to sit for the July 2026 KNEC and TVET CDACC National Examinations are notified that nominal roll verification is ongoing at the Examinations Office. Ensure your unit codes, spelling of names as per National ID/Birth Certificate, and fee clearance receipts are submitted.`,
    publishedDate: '2026-02-24',
    author: 'Senior Examinations Officer',
    featured: false
  },
  {
    id: 'news_03',
    title: '14th Annual Graduation Ceremony & Award of Diplomas Announcement',
    category: 'GRADUATION',
    summary: 'The 14th Graduation Ceremony will be held on Friday, 12th June 2026 at the Main Campus Sports Grounds. Gown collection starts on 1st June 2026.',
    content: `The Principal and Board of Governors cordially invite all eligible graduates of the 2024/2025 academic year to the 14th Annual Graduation Ceremony. Clearance through the multi-departmental clearance portal is mandatory prior to gown issuance.`,
    publishedDate: '2026-02-18',
    author: 'Ceremonials Committee',
    featured: true
  },
  {
    id: 'news_04',
    title: 'Industrial Attachment Placements for Term 2 (May–August 2026)',
    category: 'ANNOUNCEMENT',
    summary: 'Students scheduled for Term 2 industrial attachment are advised to pick their insurance indemnity covers and logbooks from the Career Services Office.',
    content: `The Industrial Attachment Directorate reminds all second and third-year students going for mandatory 12-week industrial attachment to register their host company details on the Attachment Portal to enable scheduling of lecturer assessment visits.`,
    publishedDate: '2026-02-10',
    author: 'Industrial Liaison Officer',
    featured: false
  },
  {
    id: 'news_05',
    title: 'Tender Notice: Supply and Delivery of Engineering Workshop Consumables',
    category: 'TENDER',
    summary: 'Tenders are invited from registered suppliers for workshop welding gas, electrical cables, and automotive consumables for FY 2026/2027.',
    content: `Tender documents with detailed specifications may be obtained from the Procurement Office or downloaded from our official website. Completed bids must be submitted in sealed envelopes by 20th March 2026 at 10:00 AM.`,
    publishedDate: '2026-02-05',
    author: 'Head of Procurement',
    featured: false
  }
];

export const KENYAN_PUBLIC_DOWNLOADS: PublicDownloadItem[] = [
  {
    id: 'dl_01',
    title: 'Institutional Prospectus & Course Catalog 2026/2027',
    category: 'PROSPECTUS',
    fileFormat: 'PDF',
    fileSize: '4.8 MB',
    url: '#',
    updatedDate: '2026-01-15',
    targetAudience: 'PUBLIC'
  },
  {
    id: 'dl_02',
    title: 'Comprehensive Fee Structure (Self-Sponsored & KUCCPS 2026)',
    category: 'FEE_STRUCTURE',
    fileFormat: 'PDF',
    fileSize: '1.2 MB',
    url: '#',
    updatedDate: '2026-01-20',
    targetAudience: 'APPLICANTS'
  },
  {
    id: 'dl_03',
    title: 'Printable Prospective Student Application Form (Hardcopy Option)',
    category: 'APPLICATION_FORM',
    fileFormat: 'PDF',
    fileSize: '850 KB',
    url: '#',
    updatedDate: '2026-01-10',
    targetAudience: 'APPLICANTS'
  },
  {
    id: 'dl_04',
    title: 'Official Academic Calendar & Term Dates 2026 (Terms 1, 2 & 3)',
    category: 'ACADEMIC_CALENDAR',
    fileFormat: 'PDF',
    fileSize: '620 KB',
    url: '#',
    updatedDate: '2026-01-05',
    targetAudience: 'STUDENTS'
  },
  {
    id: 'dl_05',
    title: 'Industrial Attachment Guidelines & Digital Logbook Guidebook',
    category: 'ATTACHMENT_GUIDELINES',
    fileFormat: 'PDF',
    fileSize: '2.1 MB',
    url: '#',
    updatedDate: '2025-11-30',
    targetAudience: 'STUDENTS'
  },
  {
    id: 'dl_06',
    title: 'Student Code of Conduct, Examination Regulations & Residential Rules',
    category: 'STUDENT_HANDBOOK',
    fileFormat: 'PDF',
    fileSize: '3.4 MB',
    url: '#',
    updatedDate: '2025-10-12',
    targetAudience: 'STUDENTS'
  }
];

export const INITIAL_APPLICANTS_DATA: ApplicantMasterRecord[] = [
  {
    id: 'app_001',
    applicationNumber: 'APP-2026-0104',
    fullName: 'Brian Kipchumba Koech',
    email: 'brian.koech@gmail.com',
    phone: '+254 722 918 273',
    nationalIdOrBirthCert: '38920194',
    gender: 'MALE',
    dateOfBirth: '2004-06-14',
    county: 'Uasin Gishu',
    subCounty: 'Ainabkoi',
    postalAddress: 'P.O. Box 128 - 30100 Eldoret',
    previousSchool: 'Kapsabet Boys High School',
    kcseIndexNumber: '26500001048',
    kcseYear: 2024,
    kcseMeanGrade: 'C',
    kcseSubjectGrades: [
      { subject: 'Mathematics', grade: 'C+', points: 7 },
      { subject: 'English', grade: 'C', points: 6 },
      { subject: 'Kiswahili', grade: 'B-', points: 7 },
      { subject: 'Physics', grade: 'C+', points: 7 },
      { subject: 'Computer Studies', grade: 'A-', points: 11 },
      { subject: 'Chemistry', grade: 'D+', points: 4 },
      { subject: 'Geography', grade: 'B', points: 8 }
    ],
    primaryProgrammeId: 'prog_dict_01',
    primaryProgrammeName: 'Diploma in Information Communication Technology (DICT)',
    alternativeProgrammeId: 'prog_cdacc_sw_02',
    alternativeProgrammeName: 'Diploma in Software Engineering (CBET Level 6)',
    preferredIntake: 'MAY',
    preferredCampus: 'Nairobi Main Campus',
    studyMode: 'FULL_TIME',
    fundingSource: 'SELF_SPONSORED',
    guardianName: 'Ezekiel Koech',
    guardianPhone: '+254 721 889 012',
    guardianRelationship: 'Father',
    guardianEmail: 'ezekiel.koech@eldoret.co.ke',
    documents: [
      {
        id: 'doc_app_01',
        category: 'KCSE_CERTIFICATE',
        fileName: 'Brian_Koech_KCSE_ResultSlip.pdf',
        fileSize: '1.4 MB',
        uploadedAt: '2026-02-14',
        status: 'VERIFIED'
      },
      {
        id: 'doc_app_02',
        category: 'NATIONAL_ID',
        fileName: 'Brian_Koech_National_ID.pdf',
        fileSize: '820 KB',
        uploadedAt: '2026-02-14',
        status: 'VERIFIED'
      },
      {
        id: 'doc_app_03',
        category: 'PASSPORT_PHOTO',
        fileName: 'Passport_BrianK.jpg',
        fileSize: '340 KB',
        uploadedAt: '2026-02-14',
        status: 'VERIFIED'
      }
    ],
    applicationFeeAmount: 1000,
    applicationFeeStatus: 'VERIFIED',
    mpesaReference: 'TBR8192KSL',
    paymentDate: '2026-02-14 11:24:00',
    status: 'OFFERED',
    admissionOfferDate: '2026-02-20',
    offerDeadlineDate: '2026-04-15',
    allocatedAdmissionNumber: 'CIT/2026/049',
    reviewerRemarks: 'Meets and exceeds KCSE Mean Grade C- requirement. Verified via KNEC Portal.',
    reviewedBy: 'Patricia Gomez (Admissions Officer)',
    admissionLetterUrl: '#',
    joiningInstructionsUrl: '#'
  },
  {
    id: 'app_002',
    applicationNumber: 'APP-2026-0112',
    fullName: 'Faith Mwende Mutuku',
    email: 'faith.mutuku@outlook.com',
    phone: '+254 711 445 678',
    nationalIdOrBirthCert: '39481023',
    gender: 'FEMALE',
    dateOfBirth: '2005-03-22',
    county: 'Machakos',
    subCounty: 'Kangundo',
    postalAddress: 'P.O. Box 45 - 90115 Tala',
    previousSchool: 'Makueni Girls High School',
    kcseIndexNumber: '14300002019',
    kcseYear: 2024,
    kcseMeanGrade: 'C+',
    kcseSubjectGrades: [
      { subject: 'Mathematics', grade: 'C+', points: 7 },
      { subject: 'English', grade: 'B', points: 8 },
      { subject: 'Kiswahili', grade: 'B', points: 8 },
      { subject: 'Business Studies', grade: 'A', points: 12 },
      { subject: 'Biology', grade: 'C', points: 6 },
      { subject: 'Chemistry', grade: 'C-', points: 5 },
      { subject: 'History', grade: 'A-', points: 11 }
    ],
    primaryProgrammeId: 'prog_cpa_kasneb_10',
    primaryProgrammeName: 'Certified Public Accountants (CPA Foundation & Intermediate)',
    alternativeProgrammeId: 'prog_bus_mgt_09',
    alternativeProgrammeName: 'Diploma in Business Management & Entrepreneurship',
    preferredIntake: 'MAY',
    preferredCampus: 'CBD Town Campus',
    studyMode: 'PART_TIME',
    fundingSource: 'SELF_SPONSORED',
    guardianName: 'Agnes Ndinda Mutuku',
    guardianPhone: '+254 720 119 283',
    guardianRelationship: 'Mother',
    documents: [
      {
        id: 'doc_app_04',
        category: 'KCSE_CERTIFICATE',
        fileName: 'Faith_Mutuku_KCSE.pdf',
        fileSize: '1.2 MB',
        uploadedAt: '2026-02-18',
        status: 'VERIFIED'
      },
      {
        id: 'doc_app_05',
        category: 'NATIONAL_ID',
        fileName: 'Faith_Mutuku_ID_Copy.pdf',
        fileSize: '710 KB',
        uploadedAt: '2026-02-18',
        status: 'VERIFIED'
      }
    ],
    applicationFeeAmount: 1000,
    applicationFeeStatus: 'VERIFIED',
    mpesaReference: 'UBR9201LWP',
    paymentDate: '2026-02-18 14:10:00',
    status: 'OFFER_ACCEPTED',
    admissionOfferDate: '2026-02-22',
    allocatedAdmissionNumber: 'CPA/2026/012',
    reviewerRemarks: 'Outstanding KCSE C+ profile. Accepted for May 2026 Evening Cohort.',
    reviewedBy: 'Patricia Gomez (Admissions Officer)'
  },
  {
    id: 'app_003',
    applicationNumber: 'APP-2026-0129',
    fullName: 'Dennis Otieno Ouma',
    email: 'dennis.ouma@gmail.com',
    phone: '+254 704 332 190',
    nationalIdOrBirthCert: '40192847',
    gender: 'MALE',
    dateOfBirth: '2004-11-08',
    county: 'Kisumu',
    subCounty: 'Kisumu Central',
    postalAddress: 'P.O. Box 801 - 40100 Kisumu',
    previousSchool: 'Kisumu Boys High School',
    kcseIndexNumber: '39700001099',
    kcseYear: 2024,
    kcseMeanGrade: 'C-',
    kcseSubjectGrades: [
      { subject: 'Mathematics', grade: 'C', points: 6 },
      { subject: 'English', grade: 'C-', points: 5 },
      { subject: 'Kiswahili', grade: 'C', points: 6 },
      { subject: 'Physics', grade: 'C-', points: 5 },
      { subject: 'Chemistry', grade: 'D+', points: 4 }
    ],
    primaryProgrammeId: 'prog_ee_power_05',
    primaryProgrammeName: 'Diploma in Electrical & Electronic Engineering (Power Option)',
    preferredIntake: 'SEPTEMBER',
    preferredCampus: 'Nairobi Main Campus',
    studyMode: 'FULL_TIME',
    fundingSource: 'KUCCPS_GOVERNMENT',
    kuccpsAdmissionNumber: 'KUCCPS/2026/88921',
    guardianName: 'Silas Ouma',
    guardianPhone: '+254 722 091 823',
    guardianRelationship: 'Father',
    documents: [
      {
        id: 'doc_app_06',
        category: 'KCSE_CERTIFICATE',
        fileName: 'Dennis_Ouma_KCSE_Slip.pdf',
        fileSize: '1.5 MB',
        uploadedAt: '2026-02-22',
        status: 'VERIFIED'
      }
    ],
    applicationFeeAmount: 0,
    applicationFeeStatus: 'WAIVED',
    status: 'ADMISSION_PROVISIONED',
    allocatedAdmissionNumber: 'ENG/2026/088',
    reviewerRemarks: 'Government Sponsored Student (KUCCPS). Fee waived as per state guidelines.'
  },
  {
    id: 'app_004',
    applicationNumber: 'APP-2026-0135',
    fullName: 'Lilian Wangari Karanja',
    email: 'lilian.karanja@yahoo.com',
    phone: '+254 728 554 321',
    nationalIdOrBirthCert: '38192049',
    gender: 'FEMALE',
    dateOfBirth: '2003-09-17',
    county: 'Kiambu',
    subCounty: 'Ruiru',
    postalAddress: 'P.O. Box 210 - 00232 Ruiru',
    previousSchool: 'Loreto High School Limuru',
    kcseIndexNumber: '11200003014',
    kcseYear: 2023,
    kcseMeanGrade: 'C-',
    kcseSubjectGrades: [
      { subject: 'Mathematics', grade: 'D+', points: 4 },
      { subject: 'English', grade: 'C', points: 6 },
      { subject: 'Kiswahili', grade: 'C+', points: 7 },
      { subject: 'Home Science', grade: 'B+', points: 9 },
      { subject: 'Biology', grade: 'C-', points: 5 }
    ],
    primaryProgrammeId: 'prog_hosp_fb_11',
    primaryProgrammeName: 'Diploma in Food & Beverage Production, Sales and Service',
    preferredIntake: 'MAY',
    preferredCampus: 'Nairobi Main Campus',
    studyMode: 'FULL_TIME',
    fundingSource: 'SELF_SPONSORED',
    guardianName: 'Mary Wanjiru Karanja',
    guardianPhone: '+254 723 998 112',
    guardianRelationship: 'Mother',
    documents: [
      {
        id: 'doc_app_07',
        category: 'KCSE_CERTIFICATE',
        fileName: 'Lilian_KCSE_Cert.pdf',
        fileSize: '1.1 MB',
        uploadedAt: '2026-02-25',
        status: 'PENDING_VERIFICATION'
      }
    ],
    applicationFeeAmount: 1000,
    applicationFeeStatus: 'VERIFIED',
    mpesaReference: 'VBD81920SK',
    paymentDate: '2026-02-25 09:40:00',
    status: 'UNDER_REVIEW',
    reviewerRemarks: 'Pending KNEC database grade validation.'
  },
  {
    id: 'app_005',
    applicationNumber: 'APP-2026-0141',
    fullName: 'Kevin Kiprono Bett',
    email: 'kevin.bett@gmail.com',
    phone: '+254 719 883 201',
    nationalIdOrBirthCert: '39201948',
    gender: 'MALE',
    dateOfBirth: '2004-12-01',
    county: 'Nakuru',
    subCounty: 'Rongai',
    postalAddress: 'P.O. Box 77 - 20108 Rongai',
    previousSchool: 'Menengai High School',
    kcseIndexNumber: '27500004081',
    kcseYear: 2024,
    kcseMeanGrade: 'D',
    kcseSubjectGrades: [
      { subject: 'Mathematics', grade: 'D', points: 3 },
      { subject: 'English', grade: 'D+', points: 4 },
      { subject: 'Kiswahili', grade: 'C-', points: 5 },
      { subject: 'Physics', grade: 'D', points: 3 }
    ],
    primaryProgrammeId: 'prog_cert_elect_06',
    primaryProgrammeName: 'Craft Certificate in Electrical Installation (Wireman)',
    preferredIntake: 'MAY',
    preferredCampus: 'Nakuru Western Campus',
    studyMode: 'FULL_TIME',
    fundingSource: 'COUNTY_BURSARY',
    guardianName: 'Samson Bett',
    guardianPhone: '+254 724 551 290',
    guardianRelationship: 'Father',
    documents: [],
    applicationFeeAmount: 1000,
    applicationFeeStatus: 'PENDING',
    status: 'DOCS_CORRECTION_REQUESTED',
    reviewerRemarks: 'Please upload a clear scanned copy of your KCSE Certificate / Result Slip and National ID.'
  }
];

export const INITIAL_STUDENT_MASTER_RECORDS: StudentMasterRecord[] = [
  {
    id: 'stu_001_alex',
    admissionNumber: 'CIT/2024/014',
    fullName: 'Alex Mwangi Karanja',
    photoUrl: 'https://picsum.photos/seed/alex_m/150/150',
    nationalIdOrBirthCert: '37891024',
    gender: 'MALE',
    dateOfBirth: '2003-08-14',
    phone: '+254 712 890 345',
    email: 'alex.m@student.ktvtc.ac.ke',
    county: 'Nairobi',
    subCounty: 'Kasarani',
    postalAddress: 'P.O. Box 54200 - 00200 Nairobi',
    programmeId: 'prog_dict_01',
    programmeName: 'Diploma in Information Communication Technology (DICT)',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'KNEC',
    departmentId: 'dept_computing',
    departmentName: 'Department of Computing & Informatics',
    campusId: 'campus_main',
    campusName: 'Nairobi Main Campus',
    studyMode: 'FULL_TIME',
    intakeCohort: 'MAY_2024',
    admissionDate: '2024-05-06',
    academicStatus: 'ACTIVE',
    currentAcademicYear: '2025/2026',
    currentTermOrSemester: 'TERM_2',
    totalTermsCompleted: 5,
    totalTermsRequired: 9,
    guardianName: 'Joseph Karanja Mwangi',
    guardianPhone: '+254 722 345 678',
    guardianEmail: 'j.karanja@mwangitrading.co.ke',
    fundingCategory: 'SELF_SPONSORED',
    statusHistory: [
      {
        status: 'ADMITTED',
        effectiveDate: '2024-05-06',
        reason: 'Initial admission upon fee clearance and document verification',
        authorizedBy: 'Registrar (Academic Affairs)'
      },
      {
        status: 'ACTIVE',
        effectiveDate: '2024-05-10',
        reason: 'Enrolled in Term 1 Modules',
        authorizedBy: 'Admissions Desk'
      }
    ]
  },
  {
    id: 'stu_002_mercy',
    admissionNumber: 'ENG/2023/089',
    fullName: 'Mercy Chemutai Rono',
    photoUrl: 'https://picsum.photos/seed/mercy_r/150/150',
    nationalIdOrBirthCert: '36981245',
    gender: 'FEMALE',
    dateOfBirth: '2002-11-20',
    phone: '+254 721 443 210',
    email: 'mercy.rono@student.ktvtc.ac.ke',
    county: 'Kericho',
    subCounty: 'Ainamoi',
    postalAddress: 'P.O. Box 320 - 20200 Kericho',
    programmeId: 'prog_ee_power_05',
    programmeName: 'Diploma in Electrical & Electronic Engineering (Power Option)',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'KNEC',
    departmentId: 'dept_electrical',
    departmentName: 'Department of Electrical & Electronics Engineering',
    campusId: 'campus_main',
    campusName: 'Nairobi Main Campus',
    studyMode: 'FULL_TIME',
    intakeCohort: 'SEPTEMBER_2023',
    admissionDate: '2023-09-04',
    academicStatus: 'ON_ATTACHMENT',
    currentAcademicYear: '2025/2026',
    currentTermOrSemester: 'TERM_2',
    totalTermsCompleted: 6,
    totalTermsRequired: 9,
    guardianName: 'Kiprono Rono',
    guardianPhone: '+254 720 891 002',
    guardianEmail: 'kiprono.rono@tea.or.ke',
    fundingCategory: 'KUCCPS_GOVERNMENT',
    helbAccountNumber: 'HELB-2023-90812',
    statusHistory: [
      {
        status: 'ADMITTED',
        effectiveDate: '2023-09-04',
        reason: 'KUCCPS Placement September 2023',
        authorizedBy: 'Registrar'
      },
      {
        status: 'ON_ATTACHMENT',
        effectiveDate: '2026-01-12',
        reason: 'Cleared for 12-week mandatory industrial attachment at Kenya Power (KPLC)',
        authorizedBy: 'Industrial Attachment Officer'
      }
    ]
  },
  {
    id: 'stu_003_samuel',
    admissionNumber: 'BUS/2024/041',
    fullName: 'Samuel Ndung’u Kamau',
    photoUrl: 'https://picsum.photos/seed/samuel_k/150/150',
    nationalIdOrBirthCert: '38102948',
    gender: 'MALE',
    dateOfBirth: '2004-02-18',
    phone: '+254 790 123 456',
    email: 'samuel.kamau@student.ktvtc.ac.ke',
    county: 'Murang’a',
    subCounty: 'Kigumo',
    postalAddress: 'P.O. Box 90 - 10200 Murang’a',
    programmeId: 'prog_bus_mgt_09',
    programmeName: 'Diploma in Business Management & Entrepreneurship',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'KNEC',
    departmentId: 'dept_business',
    departmentName: 'Department of Business & Management Studies',
    campusId: 'campus_cbd',
    campusName: 'CBD Town Campus',
    studyMode: 'FULL_TIME',
    intakeCohort: 'JANUARY_2024',
    admissionDate: '2024-01-08',
    academicStatus: 'ACTIVE',
    currentAcademicYear: '2025/2026',
    currentTermOrSemester: 'TERM_2',
    totalTermsCompleted: 6,
    totalTermsRequired: 9,
    guardianName: 'Jane Wambui Kamau',
    guardianPhone: '+254 711 908 231',
    guardianEmail: 'jane.kamau@muranga.go.ke',
    fundingCategory: 'SELF_SPONSORED',
    statusHistory: [
      {
        status: 'ADMITTED',
        effectiveDate: '2024-01-08',
        reason: 'Self-sponsored intake Jan 2024',
        authorizedBy: 'Registrar'
      }
    ]
  },
  {
    id: 'stu_004_cynthia',
    admissionNumber: 'HOS/2023/028',
    fullName: 'Cynthia Achieng Otieno',
    photoUrl: 'https://picsum.photos/seed/cynthia_o/150/150',
    nationalIdOrBirthCert: '37201948',
    gender: 'FEMALE',
    dateOfBirth: '2003-05-10',
    phone: '+254 701 889 203',
    email: 'cynthia.otieno@student.ktvtc.ac.ke',
    county: 'Siaya',
    subCounty: 'Bondo',
    postalAddress: 'P.O. Box 112 - 40601 Bondo',
    programmeId: 'prog_hosp_fb_11',
    programmeName: 'Diploma in Food & Beverage Production, Sales and Service',
    qualificationLevel: 'DIPLOMA',
    examiningBody: 'KNEC',
    departmentId: 'dept_hospitality',
    departmentName: 'Department of Hospitality & Tourism Management',
    campusId: 'campus_main',
    campusName: 'Nairobi Main Campus',
    studyMode: 'FULL_TIME',
    intakeCohort: 'SEPTEMBER_2023',
    admissionDate: '2023-09-04',
    academicStatus: 'ACTIVE',
    currentAcademicYear: '2025/2026',
    currentTermOrSemester: 'TERM_2',
    totalTermsCompleted: 7,
    totalTermsRequired: 9,
    guardianName: 'George Otieno',
    guardianPhone: '+254 722 678 901',
    guardianEmail: 'g.otieno@fisheries.go.ke',
    fundingCategory: 'COUNTY_BURSARY',
    statusHistory: [
      {
        status: 'ADMITTED',
        effectiveDate: '2023-09-04',
        reason: 'Enrolled under Siaya County Executive Bursary Scheme',
        authorizedBy: 'Registrar'
      }
    ]
  }
];

export const INITIAL_STUDENT_LEDGER_ENTRIES: StudentTransactionLedgerEntry[] = [
  // Alex Mwangi (CIT/2024/014) Ledger
  {
    id: 'ledg_001',
    studentId: 'stu_001_alex',
    admissionNumber: 'CIT/2024/014',
    timestamp: '2025-09-01 08:00:00',
    entryType: 'INVOICE_CHARGE',
    referenceNumber: 'INV-2025-T1-014',
    description: 'Term 1 Tuition & Lab Practical Fee 2025/2026',
    termOrSemester: 'TERM_1',
    academicYear: '2025/2026',
    debitAmount: 18500,
    creditAmount: 0,
    runningBalance: 18500,
    etimsInvoiceNumber: 'KRA-ETIMS-0029104-2025',
    reconciledBy: 'David O. Omondi (Bursar)'
  },
  {
    id: 'ledg_002',
    studentId: 'stu_001_alex',
    admissionNumber: 'CIT/2024/014',
    timestamp: '2025-09-05 11:32:00',
    entryType: 'PAYMENT_MPESA',
    referenceNumber: 'MPESA-QKW891029',
    description: 'M-Pesa PayBill Payment via 247247 (Ref: CIT/2024/014)',
    termOrSemester: 'TERM_1',
    academicYear: '2025/2026',
    debitAmount: 0,
    creditAmount: 18500,
    runningBalance: 0,
    reconciledBy: 'Automated M-Pesa Gateway'
  },
  {
    id: 'ledg_003',
    studentId: 'stu_001_alex',
    admissionNumber: 'CIT/2024/014',
    timestamp: '2026-01-05 08:30:00',
    entryType: 'INVOICE_CHARGE',
    referenceNumber: 'INV-2026-T2-014',
    description: 'Term 2 Tuition & Activity Levy 2025/2026',
    termOrSemester: 'TERM_2',
    academicYear: '2025/2026',
    debitAmount: 18500,
    creditAmount: 0,
    runningBalance: 18500,
    etimsInvoiceNumber: 'KRA-ETIMS-0038102-2026',
    reconciledBy: 'David O. Omondi (Bursar)'
  },
  {
    id: 'ledg_004',
    studentId: 'stu_001_alex',
    admissionNumber: 'CIT/2024/014',
    timestamp: '2026-01-12 14:15:00',
    entryType: 'PAYMENT_MPESA',
    referenceNumber: 'MPESA-RTY781290',
    description: 'M-Pesa PayBill Payment (Part payment)',
    termOrSemester: 'TERM_2',
    academicYear: '2025/2026',
    debitAmount: 0,
    creditAmount: 10000,
    runningBalance: 8500,
    reconciledBy: 'Automated M-Pesa Gateway'
  },
  {
    id: 'ledg_005',
    studentId: 'stu_001_alex',
    admissionNumber: 'CIT/2024/014',
    timestamp: '2026-02-10 16:40:00',
    entryType: 'PAYMENT_MPESA',
    referenceNumber: 'MPESA-SBH902194',
    description: 'M-Pesa PayBill Payment (Term 2 Balance Clearance)',
    termOrSemester: 'TERM_2',
    academicYear: '2025/2026',
    debitAmount: 0,
    creditAmount: 8500,
    runningBalance: 0,
    reconciledBy: 'Automated M-Pesa Gateway'
  },

  // Mercy Chemutai (ENG/2023/089) Ledger
  {
    id: 'ledg_006',
    studentId: 'stu_002_mercy',
    admissionNumber: 'ENG/2023/089',
    timestamp: '2026-01-05 08:30:00',
    entryType: 'INVOICE_CHARGE',
    referenceNumber: 'INV-2026-T2-089',
    description: 'Term 2 Engineering Workshop & Attachment Assessment Fee',
    termOrSemester: 'TERM_2',
    academicYear: '2025/2026',
    debitAmount: 21500,
    creditAmount: 0,
    runningBalance: 21500,
    etimsInvoiceNumber: 'KRA-ETIMS-0038199-2026'
  },
  {
    id: 'ledg_007',
    studentId: 'stu_002_mercy',
    admissionNumber: 'ENG/2023/089',
    timestamp: '2026-01-20 10:00:00',
    entryType: 'HELB_DISBURSEMENT',
    referenceNumber: 'HELB-BATCH-2026-01',
    description: 'HELB TVET Tuition Loan Disbursement (Batch #04)',
    termOrSemester: 'TERM_2',
    academicYear: '2025/2026',
    debitAmount: 0,
    creditAmount: 15000,
    runningBalance: 6500,
    reconciledBy: 'Finance Officer (Accounts)'
  }
];

export const INITIAL_MPESA_TRANSACTIONS: MpesaPaymentTransaction[] = [
  {
    id: 'mp_001',
    mpesaReceiptNumber: 'SBH902194',
    transactionAmount: 8500,
    payerPhoneNumber: '254712890345',
    billRefNumber: 'CIT/2024/014',
    transactionTimestamp: '2026-02-10 16:40:12',
    channel: 'PAYBILL_247247',
    status: 'RECONCILED_MATCHED',
    matchedStudentId: 'stu_001_alex',
    matchedAdmissionNumber: 'CIT/2024/014',
    matchedStudentName: 'Alex Mwangi Karanja',
    allocatedLedgerEntryId: 'ledg_005',
    processedBy: 'SYSTEM_AUTORECON',
    notes: 'Matched to Student Alex Mwangi. Balance cleared.'
  },
  {
    id: 'mp_002',
    mpesaReceiptNumber: 'TBR8192KSL',
    transactionAmount: 1000,
    payerPhoneNumber: '254722918273',
    billRefNumber: 'APP-2026-0104',
    transactionTimestamp: '2026-02-14 11:24:00',
    channel: 'STK_PUSH_EXPRESS',
    status: 'RECONCILED_MATCHED',
    matchedStudentName: 'Brian Kipchumba Koech (Applicant)',
    processedBy: 'SYSTEM_AUTORECON',
    notes: 'Application fee verified for APP-2026-0104'
  },
  {
    id: 'mp_003',
    mpesaReceiptNumber: 'VXB771890',
    transactionAmount: 16000,
    payerPhoneNumber: '254721990812',
    billRefNumber: 'ENG/2023/089',
    transactionTimestamp: '2026-03-01 09:12:44',
    channel: 'PAYBILL_247247',
    status: 'QUEUED_VERIFICATION',
    matchedStudentId: 'stu_002_mercy',
    matchedAdmissionNumber: 'ENG/2023/089',
    matchedStudentName: 'Mercy Chemutai Rono',
    notes: 'Pending cashier verification for over-the-counter receipt printing'
  },
  {
    id: 'mp_004',
    mpesaReceiptNumber: 'UNM889102',
    transactionAmount: 18500,
    payerPhoneNumber: '254700112233',
    billRefNumber: 'JOHN MWANGI',
    transactionTimestamp: '2026-03-01 11:05:20',
    channel: 'PAYBILL_247247',
    status: 'UNMATCHED_ACCOUNT',
    notes: 'Payer entered name instead of standard Admission Number. Held in suspense account.'
  }
];

export const INITIAL_DEPARTMENT_CURRICULA: DepartmentCurriculum[] = [
  {
    id: 'curr_dict_knec',
    departmentId: 'dept_computing',
    departmentName: 'Department of Computing & Informatics',
    programmeId: 'prog_dict_01',
    programmeName: 'Diploma in Information Communication Technology (DICT)',
    qualificationLevel: 'DIPLOMA',
    curriculumVersion: 'KNEC_MODULAR_2023_V3',
    examiningBody: 'KNEC',
    totalTerms: 9,
    totalCreditsOrUnits: 18,
    activeStudentsEnrolled: 142,
    units: [
      {
        unitCode: 'DICT-101',
        unitTitle: 'Introduction to ICT & Computer Operating Systems',
        theoryHours: 45,
        practicalHours: 45,
        termNumber: 1,
        isCore: true
      },
      {
        unitCode: 'DICT-102',
        unitTitle: 'Computer Hardware Support & Peripheral Maintenance',
        theoryHours: 30,
        practicalHours: 60,
        termNumber: 1,
        isCore: true
      },
      {
        unitCode: 'DICT-103',
        unitTitle: 'Structured Programming in C/C++',
        theoryHours: 40,
        practicalHours: 50,
        termNumber: 2,
        isCore: true
      },
      {
        unitCode: 'DICT-201',
        unitTitle: 'Database Design & Relational SQL Architecture',
        theoryHours: 40,
        practicalHours: 50,
        termNumber: 4,
        isCore: true
      },
      {
        unitCode: 'DICT-202',
        unitTitle: 'Computer Networking & Cisco Routing Fundamentals',
        theoryHours: 35,
        practicalHours: 55,
        termNumber: 5,
        isCore: true
      },
      {
        unitCode: 'DICT-301',
        unitTitle: 'Web Application Development & Cloud Integration',
        theoryHours: 30,
        practicalHours: 60,
        termNumber: 7,
        isCore: true
      },
      {
        unitCode: 'DICT-302',
        unitTitle: 'Industrial Trade Project & Capstone Implementation',
        theoryHours: 15,
        practicalHours: 90,
        termNumber: 8,
        isCore: true
      }
    ]
  },
  {
    id: 'curr_ee_power',
    departmentId: 'dept_electrical',
    departmentName: 'Department of Electrical & Electronics Engineering',
    programmeId: 'prog_ee_power_05',
    programmeName: 'Diploma in Electrical & Electronic Engineering (Power Option)',
    qualificationLevel: 'DIPLOMA',
    curriculumVersion: 'KNEC_EE_REV_2024',
    examiningBody: 'KNEC',
    totalTerms: 9,
    totalCreditsOrUnits: 20,
    activeStudentsEnrolled: 98,
    units: [
      {
        unitCode: 'EEE-101',
        unitTitle: 'Electrical Engineering Principles & Circuit Analysis',
        theoryHours: 50,
        practicalHours: 40,
        termNumber: 1,
        isCore: true
      },
      {
        unitCode: 'EEE-102',
        unitTitle: 'Electrical Workshop Practice & Domestic Wiring',
        theoryHours: 20,
        practicalHours: 80,
        termNumber: 1,
        isCore: true
      },
      {
        unitCode: 'EEE-201',
        unitTitle: 'Electrical Machines & Transformer Technology',
        theoryHours: 45,
        practicalHours: 45,
        termNumber: 4,
        isCore: true
      },
      {
        unitCode: 'EEE-301',
        unitTitle: 'Power Systems Generation, Transmission & Distribution',
        theoryHours: 50,
        practicalHours: 40,
        termNumber: 7,
        isCore: true
      }
    ]
  }
];

export const INITIAL_LECTURER_ALLOCATIONS: LecturerUnitAllocation[] = [
  {
    id: 'alloc_001',
    academicYear: '2025/2026',
    termOrSemester: 'TERM_2',
    unitCode: 'DICT-201',
    unitTitle: 'Database Design & Relational SQL Architecture',
    departmentId: 'dept_computing',
    lecturerId: 'usr_dr_henderson',
    lecturerName: 'Dr. Marcus Henderson',
    weeklyContactHours: 6,
    assignedClassCohorts: ['DICT May 2024 Cohort A', 'DICT May 2024 Cohort B'],
    roomVenue: 'ICT Computer Lab 3',
    hodApproved: true,
    status: 'ALLOCATED'
  },
  {
    id: 'alloc_002',
    academicYear: '2025/2026',
    termOrSemester: 'TERM_2',
    unitCode: 'DICT-301',
    unitTitle: 'Web Application Development & Cloud Integration',
    departmentId: 'dept_computing',
    lecturerId: 'usr_dr_henderson',
    lecturerName: 'Dr. Marcus Henderson',
    weeklyContactHours: 6,
    assignedClassCohorts: ['DICT Sept 2023 Cohort'],
    roomVenue: 'Software Innovation Hub',
    hodApproved: true,
    status: 'ALLOCATED'
  },
  {
    id: 'alloc_003',
    academicYear: '2025/2026',
    termOrSemester: 'TERM_2',
    unitCode: 'EEE-102',
    unitTitle: 'Electrical Workshop Practice & Domestic Wiring',
    departmentId: 'dept_electrical',
    lecturerId: 'usr_prof_adeyemi',
    lecturerName: 'Prof. Tunde Adeyemi',
    weeklyContactHours: 8,
    assignedClassCohorts: ['DEEE Jan 2026 Cohort'],
    roomVenue: 'Heavy Electrical Workshop Wing B',
    hodApproved: true,
    status: 'ALLOCATED'
  }
];

export const INITIAL_ATTACHMENT_PLACEMENTS: AttachmentPlacement[] = [
  {
    id: 'att_001',
    studentId: 'stu_002_mercy',
    admissionNumber: 'ENG/2023/089',
    studentName: 'Mercy Chemutai Rono',
    programmeName: 'Diploma in Electrical & Electronic Engineering (Power Option)',
    departmentName: 'Department of Electrical & Electronics Engineering',
    companyName: 'Kenya Power & Lighting Company (KPLC)',
    companyLocation: 'Ruaraka Regional Substation & Stores',
    companyTown: 'Nairobi',
    industrySupervisorName: 'Eng. Dennis Mutua',
    industrySupervisorPhone: '+254 722 400 910',
    industrySupervisorEmail: 'dmutua@kplc.co.ke',
    startDate: '2026-01-12',
    endDate: '2026-04-03',
    durationWeeks: 12,
    collegeVisitingSupervisorId: 'usr_dr_henderson',
    collegeVisitingSupervisorName: 'Dr. Marcus Henderson',
    assessmentVisitDate: '2026-02-25',
    supervisorScore: 88,
    logbookWeeksVerified: 7,
    totalRequiredWeeks: 12,
    status: 'ASSESSED',
    logbookEntriesCount: 7,
    clearanceGranted: false
  },
  {
    id: 'att_002',
    studentId: 'stu_003_samuel',
    admissionNumber: 'BUS/2024/041',
    studentName: 'Samuel Ndung’u Kamau',
    programmeName: 'Diploma in Business Management & Entrepreneurship',
    departmentName: 'Department of Business & Management Studies',
    companyName: 'Bidco Africa Limited',
    companyLocation: 'Industrial Park, Thika Highway',
    companyTown: 'Thika',
    industrySupervisorName: 'Madam Gladys Waweru',
    industrySupervisorPhone: '+254 710 334 556',
    industrySupervisorEmail: 'gwaweru@bidco-africa.com',
    startDate: '2026-05-04',
    endDate: '2026-07-24',
    durationWeeks: 12,
    logbookWeeksVerified: 0,
    totalRequiredWeeks: 12,
    status: 'APPROVED',
    logbookEntriesCount: 0,
    clearanceGranted: false
  }
];

export const INITIAL_STUDENT_CLEARANCE_RECORDS: StudentClearanceRecord[] = [
  {
    id: 'clr_001',
    studentId: 'stu_004_cynthia',
    admissionNumber: 'HOS/2023/028',
    studentName: 'Cynthia Achieng Otieno',
    programmeName: 'Diploma in Food & Beverage Production, Sales and Service',
    departmentName: 'Department of Hospitality & Tourism Management',
    clearanceReason: 'GRADUATION',
    initiatedDate: '2026-02-15',
    targetCompletionDate: '2026-03-30',
    overallStatus: 'IN_PROGRESS',
    finalCertificateIssued: false,
    signoffs: [
      {
        department: 'LIBRARY',
        officerName: 'Karen Vance',
        officerRole: 'Senior Circulation Librarian',
        status: 'CLEARED',
        signedAt: '2026-02-18 10:14:00',
        remarks: 'All 3 borrowed culinary reference manuals returned in good condition.'
      },
      {
        department: 'DEPARTMENT_WORKSHOP',
        officerName: 'Chef Bernard Ndung’u',
        officerRole: 'Culinary Laboratory In-Charge',
        status: 'CLEARED',
        signedAt: '2026-02-20 14:30:00',
        remarks: 'Chef uniform and pastry toolset returned.'
      },
      {
        department: 'HOSTEL',
        officerName: 'Alhaji Hassan Bello',
        officerRole: 'Chief Hall Warden',
        status: 'CLEARED',
        signedAt: '2026-02-22 09:00:00',
        remarks: 'Room vacated and key surrendered without damages.'
      },
      {
        department: 'FINANCE',
        officerName: 'David O. Omondi',
        officerRole: 'University Bursar',
        status: 'CLEARED',
        signedAt: '2026-02-26 11:20:00',
        remarks: 'Full tuition fee paid. KES 0 balance.'
      },
      {
        department: 'REGISTRAR',
        officerName: 'Mrs. Grace W. Mwangi',
        officerRole: 'Registrar (Academic Affairs)',
        status: 'PENDING',
        remarks: 'Awaiting Senate approval of Final Graduation Gazette.'
      }
    ]
  }
];

export const INITIAL_PROCUREMENT_REQUISITIONS: ProcurementRequisition[] = [
  {
    id: 'req_001',
    requisitionNumber: 'REQ-2026-0042',
    departmentId: 'dept_computing',
    departmentName: 'Department of Computing & Informatics',
    requestedBy: 'Dr. Marcus Henderson (Senior Lecturer)',
    requestedDate: '2026-02-10',
    items: [
      {
        itemName: 'Cat6 Shielded Ethernet Cable Roll (305m)',
        category: 'ICT_HARDWARE',
        quantity: 4,
        unitOfMeasure: 'Rolls',
        estimatedUnitCost: 14500,
        purpose: 'Network Lab 3 re-cabling for KNEC practical exams'
      },
      {
        itemName: 'RJ45 Connectors Box (100 pcs)',
        category: 'ICT_HARDWARE',
        quantity: 10,
        unitOfMeasure: 'Boxes',
        estimatedUnitCost: 1200,
        purpose: 'Network patch cables creation'
      },
      {
        itemName: 'Cisco 24-Port Gigabit Managed Switch',
        category: 'ICT_HARDWARE',
        quantity: 2,
        unitOfMeasure: 'Units',
        estimatedUnitCost: 48000,
        purpose: 'Switching infrastructure upgrade'
      }
    ],
    totalEstimatedCost: 166000,
    status: 'PRINCIPAL_APPROVED',
    poNumber: 'PO-2026-0018',
    approverRemarks: 'Approved for KNEC Exam readiness. Proceed with local quotation.'
  },
  {
    id: 'req_002',
    requisitionNumber: 'REQ-2026-0049',
    departmentId: 'dept_electrical',
    departmentName: 'Department of Electrical & Electronics Engineering',
    requestedBy: 'Prof. Tunde Adeyemi (HOD)',
    requestedDate: '2026-02-22',
    items: [
      {
        itemName: 'Single Core Copper Wire 1.5mm (Red, Black, Green)',
        category: 'WORKSHOP_TOOLS',
        quantity: 15,
        unitOfMeasure: 'Rolls',
        estimatedUnitCost: 4200,
        purpose: 'First year wireman installation workshop practicals'
      },
      {
        itemName: 'Digital Clamp Multimeters (Fluke 302+)',
        category: 'WORKSHOP_TOOLS',
        quantity: 6,
        unitOfMeasure: 'Units',
        estimatedUnitCost: 11500,
        purpose: 'AC/DC current testing equipment'
      }
    ],
    totalEstimatedCost: 132000,
    status: 'HOD_RECOMMENDED',
    approverRemarks: 'Recommended by HOD Electrical. Forwarded to Principal for financial authorization.'
  }
];

export const INITIAL_STORE_INVENTORY: StoreInventoryItem[] = [
  {
    id: 'inv_001',
    itemCode: 'ICT-CBL-001',
    itemName: 'Cat6 UTP Cable Roll (305m)',
    category: 'ICT_HARDWARE',
    unitOfMeasure: 'Rolls',
    quantityInStock: 8,
    reorderLevel: 3,
    unitCost: 14000,
    storeLocation: 'ICT Central Store Shelf A-12',
    lastRestockedDate: '2026-01-18',
    status: 'IN_STOCK'
  },
  {
    id: 'inv_002',
    itemCode: 'ELE-WRE-002',
    itemName: 'Twin with Earth Cable 2.5mm',
    category: 'WORKSHOP_TOOLS',
    unitOfMeasure: 'Rolls',
    quantityInStock: 2,
    reorderLevel: 5,
    unitCost: 6500,
    storeLocation: 'Engineering Workshop Store Bay 4',
    lastRestockedDate: '2025-11-20',
    status: 'LOW_STOCK'
  },
  {
    id: 'inv_003',
    itemCode: 'STN-EXM-003',
    itemName: 'KNEC Examination Answer Booklets (16 Pages)',
    category: 'STATIONERY',
    unitOfMeasure: 'Reams (500 sheets)',
    quantityInStock: 45,
    reorderLevel: 10,
    unitCost: 2800,
    storeLocation: 'Secure Exam Vault Shelf S-01',
    lastRestockedDate: '2026-02-02',
    status: 'IN_STOCK'
  },
  {
    id: 'inv_004',
    itemCode: 'HOS-KTC-004',
    itemName: 'Stainless Steel Chef Cooking Pots (50L)',
    category: 'EQUIPMENT',
    unitOfMeasure: 'Units',
    quantityInStock: 6,
    reorderLevel: 2,
    unitCost: 18500,
    storeLocation: 'Hospitality Stores Room 2',
    lastRestockedDate: '2025-08-14',
    status: 'IN_STOCK'
  }
];
