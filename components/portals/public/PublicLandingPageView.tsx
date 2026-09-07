'use client';

import React, { useState } from 'react';
import {
  Globe,
  GraduationCap,
  BookOpen,
  Search,
  ArrowRight,
  Download,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronRight,
  FileText,
  UserPlus,
  Briefcase,
  Building2,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';
import { useERP } from '@/context/erp-context';
import { PublicProgrammeItem } from '@/types/erp';
import { KENYAN_COLLEGE_INFO, KENYAN_PUBLIC_PROGRAMMES } from '@/lib/kenyan-tvet-data';

// Subcomponents
import { PublicHeroSection } from './PublicHeroSection';
import { PublicProgrammesSection } from './PublicProgrammesSection';
import { PublicAboutSection } from './PublicAboutSection';
import { PublicAdmissionsSection } from './PublicAdmissionsSection';
import { PublicNewsSection } from './PublicNewsSection';
import { PublicNoticesSection } from './PublicNoticesSection';
import { PublicContactSection } from './PublicContactSection';

export default function PublicLandingPageView() {
  const { navigateToPortal, institutionalSettings, openInstitutionalDocument, openLoginModal } = useERP();

  // Navigation tabs within Public Portal
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'programmes' | 'admissions' | 'news' | 'notices' | 'contact'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleApplyForProgramme = (prog?: PublicProgrammeItem) => {
    setIsMobileMenuOpen(false);
    navigateToPortal('APPLICANT');
  };

  const handleSectionClick = (section: typeof activeSection) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadProspectus = () => {
    openInstitutionalDocument({
      docType: 'CUSTOM_REPORT',
      title: `${institutionalSettings.name} — Official Course Catalog & Prospectus 2026/2027`,
      subtitle: 'TVETA Accredited Technical & Vocational Training Programs',
      recipientName: 'Prospective Trainee / Candidate',
      issueDate: new Date().toISOString().split('T')[0],
      contentBody: `This prospectus details the fully accredited technical, vocational, and business training diplomas, certificates, and artisan curricula offered at ${institutionalSettings.name} for the academic year 2026/2027.\n\nAll courses are examined and accredited by national examining bodies including KNEC, TVET CDACC, NITA, and KASNEB. Trainees undergo 12 weeks of mandatory industrial attachment with industry partners prior to graduation.`,
      tableData: {
        headers: ['Program Code', 'Program Name', 'Level', 'Examining Body', 'Duration', 'Fee / Term (KES)'],
        rows: KENYAN_PUBLIC_PROGRAMMES.map(p => [
          p.code,
          p.name,
          p.qualificationLevel.replace('_', ' '),
          p.examiningBody,
          `${p.durationTerms} Terms`,
          `KES ${p.tuitionFeePerTerm.toLocaleString()}`
        ])
      },
      signatoryName: institutionalSettings.registrarName,
      signatoryTitle: institutionalSettings.registrarTitle
    });
  };

  const handleDownloadFeeStructure = () => {
    openInstitutionalDocument({
      docType: 'FEE_INVOICE',
      title: `${institutionalSettings.name} — Official Fee Schedule 2026/2027`,
      subtitle: 'Approved by the College Council & Ministry of Education',
      recipientName: 'All Prospective Trainees & Sponsors',
      issueDate: new Date().toISOString().split('T')[0],
      contentBody: `OFFICIAL TVET FEE STRUCTURE\n\n1. Government Subsidized Trainees (KUCCPS Placed): Annual Tuition Subsidy KES 30,000 paid by the Government of Kenya.\n2. HELB TVET Loans: Eligible candidates receive tuition loans and upkeep allowances.\n3. Official Payment: Lipa na M-Pesa PayBill 247247, Account: Trainee Admission Number.\n\nAll fees are payable per term in advance.`,
      signatoryName: institutionalSettings.bursarName,
      signatoryTitle: institutionalSettings.bursarTitle
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* 1. PUBLIC TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* College Crest & Identity */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => handleSectionClick('home')}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-md border-2 border-emerald-600 shrink-0">
                KT
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800 block truncate">
                  Republic of Kenya • TVETA Certified
                </span>
                <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 leading-tight truncate">
                  {institutionalSettings.name}
                </h1>
                <p className="text-[11px] text-slate-500 hidden md:block truncate">
                  {institutionalSettings.motto}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              <button
                id="pub_nav_home"
                onClick={() => handleSectionClick('home')}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeSection === 'home'
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Home
              </button>
              <button
                id="pub_nav_about"
                onClick={() => handleSectionClick('about')}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeSection === 'about'
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                About
              </button>
              <button
                id="pub_nav_programmes"
                onClick={() => handleSectionClick('programmes')}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeSection === 'programmes'
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Programmes
              </button>
              <button
                id="pub_nav_admissions"
                onClick={() => handleSectionClick('admissions')}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeSection === 'admissions'
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Admissions
              </button>
              <button
                id="pub_nav_news"
                onClick={() => handleSectionClick('news')}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeSection === 'news'
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                News
              </button>
              <button
                id="pub_nav_notices"
                onClick={() => handleSectionClick('notices')}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeSection === 'notices'
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Notices
              </button>
              <button
                id="pub_nav_contact"
                onClick={() => handleSectionClick('contact')}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeSection === 'contact'
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Quick Action Buttons (Desktop + Mobile Trigger) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="btn_pub_login_header"
                onClick={() => openLoginModal()}
                className="px-3.5 py-2 text-sm font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Portal Login</span>
              </button>

              <button
                id="btn_pub_apply_header"
                onClick={() => handleApplyForProgramme()}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Apply for 2026</span>
                <span className="sm:hidden">Apply</span>
              </button>

              {/* Mobile Hamburger Trigger */}
              <button
                id="btn_pub_mobile_menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Slide-over */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-700">
              <button
                onClick={() => handleSectionClick('home')}
                className={`p-2.5 rounded-xl text-left ${activeSection === 'home' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-100'}`}
              >
                Home
              </button>
              <button
                onClick={() => handleSectionClick('about')}
                className={`p-2.5 rounded-xl text-left ${activeSection === 'about' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-100'}`}
              >
                About Us
              </button>
              <button
                onClick={() => handleSectionClick('programmes')}
                className={`p-2.5 rounded-xl text-left ${activeSection === 'programmes' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-100'}`}
              >
                Programmes
              </button>
              <button
                onClick={() => handleSectionClick('admissions')}
                className={`p-2.5 rounded-xl text-left ${activeSection === 'admissions' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-100'}`}
              >
                Admissions Guide
              </button>
              <button
                onClick={() => handleSectionClick('news')}
                className={`p-2.5 rounded-xl text-left ${activeSection === 'news' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-100'}`}
              >
                News & Updates
              </button>
              <button
                onClick={() => handleSectionClick('notices')}
                className={`p-2.5 rounded-xl text-left ${activeSection === 'notices' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-100'}`}
              >
                Official Notices
              </button>
              <button
                onClick={() => handleSectionClick('contact')}
                className={`p-2.5 rounded-xl text-left ${activeSection === 'contact' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-100'}`}
              >
                Contact & Campuses
              </button>
              <button
                onClick={handleDownloadProspectus}
                className="p-2.5 rounded-xl text-left text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                <span>Prospectus</span>
              </button>
            </div>

            {/* Mobile Portal Gateways */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); openLoginModal('STUDENT'); }}
                className="py-2.5 px-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Login</span>
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); openLoginModal('STAFF'); }}
                className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Staff Login</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. DYNAMIC PAGE CONTENT SWITCHER */}
      <main>
        {activeSection === 'home' && (
          <div className="space-y-0">
            {/* HERO SECTION WITH FRAMER MOTION ANIMATION & HIGH-DEFINITION IMAGES */}
            <PublicHeroSection
              onApplyClick={() => handleApplyForProgramme()}
              onExploreCoursesClick={() => {
                const el = document.getElementById('programme_search_section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else handleSectionClick('programmes');
              }}
              onDownloadProspectus={handleDownloadProspectus}
              onStudentLogin={() => openLoginModal('STUDENT')}
              onStaffLogin={() => openLoginModal('STAFF')}
              institutionalName={institutionalSettings.name}
            />

            {/* NOTE: Login Portals under Institutional Gateways REMOVED from Home Page as requested! */}

            {/* PROGRAMMES SECTION: FEATURED COURSES FIRST, SEARCHABLE FOR THE REST */}
            <PublicProgrammesSection
              onApplyForProgramme={handleApplyForProgramme}
              onDownloadProspectus={handleDownloadProspectus}
            />

            {/* CURATED HIGHLIGHTS: INSTITUTIONAL HERITAGE & CAPITATION */}
            <section className="py-14 bg-slate-50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
                      Institutional Heritage & Practical CBET Training
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      A National Centre of Excellence in Technical & Vocational Training
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Established under the TVET Act No. 29 of 2013, our college equips students with tangible industrial skills. Trainees spend 60% of their learning time in modern workshops and complete 12 weeks of supervised industrial attachment.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleSectionClick('about')}
                        className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Learn More About Us</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSectionClick('admissions')}
                        className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Admissions & HELB Guide</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-slate-900">Why Train with Us?</h3>
                    <ul className="space-y-2.5 text-xs text-slate-600">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>TVETA Registered:</strong> Category A National TVET Institution.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Government Capitation:</strong> KES 30,000 annual subsidy for KUCCPS trainees.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>100% Industry Attachment:</strong> Placements with Safaricom, KenGen, KPLC, and Isuzu.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Automated M-Pesa Receipts:</strong> Instant fee clearance via PayBill 247247.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeSection === 'about' && (
          <PublicAboutSection
            onApplyClick={() => handleApplyForProgramme()}
            onExploreCoursesClick={() => handleSectionClick('programmes')}
          />
        )}

        {activeSection === 'programmes' && (
          <PublicProgrammesSection
            onApplyForProgramme={handleApplyForProgramme}
            onDownloadProspectus={handleDownloadProspectus}
            isStandalonePage={true}
          />
        )}

        {activeSection === 'admissions' && (
          <PublicAdmissionsSection
            onApplyClick={() => handleApplyForProgramme()}
            onDownloadProspectus={handleDownloadProspectus}
            onDownloadFeeStructure={handleDownloadFeeStructure}
          />
        )}

        {activeSection === 'news' && (
          <PublicNewsSection />
        )}

        {activeSection === 'notices' && (
          <PublicNoticesSection />
        )}

        {activeSection === 'contact' && (
          <PublicContactSection />
        )}
      </main>

      {/* 3. PUBLIC FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  KT
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-base block">{institutionalSettings.name}</span>
                  <span className="text-[11px] text-emerald-800 font-semibold font-mono">Reg. No. {KENYAN_COLLEGE_INFO.regNumber}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                A premier TVETA registered national polytechnic equipping Kenya’s youth with industry-ready competency-based qualifications in engineering, computing, built environment, business, and hospitality.
              </p>
              <div className="text-xs text-slate-500 font-mono">
                Lipa na M-Pesa PayBill: <strong className="text-slate-900">247247</strong>
              </div>
            </div>

            {/* Academic Navigation */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3 font-mono">Curriculum</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><button onClick={() => handleSectionClick('programmes')} className="hover:text-emerald-800 transition-colors cursor-pointer">Computing & IT (CBET 6)</button></li>
                <li><button onClick={() => handleSectionClick('programmes')} className="hover:text-emerald-800 transition-colors cursor-pointer">Mechanical & Automotive</button></li>
                <li><button onClick={() => handleSectionClick('programmes')} className="hover:text-emerald-800 transition-colors cursor-pointer">Electrical & Electronics</button></li>
                <li><button onClick={() => handleSectionClick('programmes')} className="hover:text-emerald-800 transition-colors cursor-pointer">Building & Civil Technology</button></li>
                <li><button onClick={() => handleSectionClick('programmes')} className="hover:text-emerald-800 transition-colors cursor-pointer">Hospitality & Cosmetology</button></li>
              </ul>
            </div>

            {/* Admissions & Governance */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3 font-mono">Admissions & News</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><button onClick={() => handleSectionClick('admissions')} className="hover:text-emerald-800 transition-colors cursor-pointer">KUCCPS & Direct Intakes</button></li>
                <li><button onClick={() => handleSectionClick('admissions')} className="hover:text-emerald-800 transition-colors cursor-pointer">Entry Requirements Matrix</button></li>
                <li><button onClick={() => handleSectionClick('news')} className="hover:text-emerald-800 transition-colors cursor-pointer">Campus Newsroom</button></li>
                <li><button onClick={() => handleSectionClick('notices')} className="hover:text-emerald-800 transition-colors cursor-pointer">Gazetted Circulars</button></li>
                <li><button onClick={handleDownloadProspectus} className="hover:text-emerald-800 transition-colors cursor-pointer">Download Prospectus</button></li>
              </ul>
            </div>

            {/* Campuses & Contact */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-3 font-mono">Campuses</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Nairobi Main:</strong> Off Ngong Road<br />
                <strong>CBD Town:</strong> Haile Selassie Ave<br />
                <strong>Nakuru:</strong> Section 58<br />
                <span className="font-mono text-[11px] block mt-1">Tel: +254 (0) 20 234 5678</span>
              </p>
              <div className="pt-2">
                <button
                  onClick={() => openLoginModal()}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Portal Login
                </button>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 {institutionalSettings.name}. TVETA Certified Public Technical Institution.</p>
            <div className="flex items-center gap-4">
              <span className="hover:underline cursor-pointer" onClick={() => handleSectionClick('about')}>About TVET College</span>
              <span className="hover:underline cursor-pointer" onClick={() => handleSectionClick('notices')}>Official Gazette</span>
              <span className="hover:underline cursor-pointer" onClick={() => handleSectionClick('contact')}>Support Helpdesk</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
