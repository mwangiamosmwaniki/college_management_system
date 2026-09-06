"use client";

import React, { useState, useMemo } from "react";
import {
  Globe,
  GraduationCap,
  BookOpen,
  Search,
  Filter,
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
  Layers,
  ChevronRight,
  FileText,
  UserPlus,
  ExternalLink,
  ChevronDown,
  Info,
  DollarSign,
  Menu,
  X,
} from "lucide-react";
import { useERP } from "@/context/erp-context";
import {
  PublicProgrammeItem,
  KenyanQualificationLevel,
  KenyanExaminingBody,
} from "@/types/erp";
import {
  KENYAN_COLLEGE_INFO,
  KENYAN_PUBLIC_PROGRAMMES,
  KENYAN_PUBLIC_NEWS,
  KENYAN_PUBLIC_DOWNLOADS,
} from "@/lib/kenyan-tvet-data";

export default function PublicLandingPageView() {
  const { navigateToPortal, institutionalSettings, openInstitutionalDocument } =
    useERP();

  // Navigation tabs within Public Portal
  const [activeSection, setActiveSection] = useState<
    "home" | "programmes" | "admissions" | "news" | "downloads" | "contact"
  >("home");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Programme Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedBody, setSelectedBody] = useState<string>("ALL");
  const [selectedProgrammeModal, setSelectedProgrammeModal] =
    useState<PublicProgrammeItem | null>(null);

  // News Filtering
  const [newsCategory, setNewsCategory] = useState<string>("ALL");

  // Filtered Programmes
  const filteredProgrammes = useMemo(() => {
    return KENYAN_PUBLIC_PROGRAMMES.filter((prog) => {
      const matchesSearch =
        prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prog.minimumRequirements
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesDept =
        selectedDept === "ALL" || prog.departmentId === selectedDept;
      const matchesLevel =
        selectedLevel === "ALL" || prog.qualificationLevel === selectedLevel;
      const matchesBody =
        selectedBody === "ALL" || prog.examiningBody === selectedBody;

      return matchesSearch && matchesDept && matchesLevel && matchesBody;
    });
  }, [searchQuery, selectedDept, selectedLevel, selectedBody]);

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    const map = new Map<string, string>();
    KENYAN_PUBLIC_PROGRAMMES.forEach((p) =>
      map.set(p.departmentId, p.departmentName),
    );
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Filtered News
  const filteredNews = useMemo(() => {
    if (newsCategory === "ALL") return KENYAN_PUBLIC_NEWS;
    return KENYAN_PUBLIC_NEWS.filter((n) => n.category === newsCategory);
  }, [newsCategory]);

  const handleApplyForProgramme = (prog?: PublicProgrammeItem) => {
    window.location.assign("/applicant");
  };

  const handleSectionChange = (section: typeof activeSection) => {
    setActiveSection(section);
    setIsMobileNavOpen(false);
  };

  const handleDownloadProspectus = () => {
    openInstitutionalDocument({
      docType: "CUSTOM_REPORT",
      title: `${institutionalSettings.name} — Official Course Catalog & Prospectus 2026/2027`,
      subtitle: "TVETA Accredited Technical & Vocational Training Programs",
      recipientName: "Prospective Trainee / Candidate",
      issueDate: new Date().toISOString().split("T")[0],
      contentBody: `This prospectus details the fully accredited technical, vocational, and business training diplomas, certificates, and artisan curricula offered at Kenya Technical & Vocational Training College for the academic year 2026/2027.\n\nAll courses are examined and accredited by national examining bodies including KNEC, TVET CDACC, NITA, and KASNEB. Trainees undergo 12 weeks of mandatory industrial attachment with industry partners prior to graduation.`,
      tableData: {
        headers: [
          "Program Code",
          "Program Name",
          "Level",
          "Examining Body",
          "Duration",
          "Fee / Term (KES)",
        ],
        rows: KENYAN_PUBLIC_PROGRAMMES.map((p) => [
          p.code,
          p.name,
          p.qualificationLevel.replace("_", " "),
          p.examiningBody,
          `${p.durationTerms} Terms`,
          `KES ${p.tuitionFeePerTerm.toLocaleString()}`,
        ]),
      },
      signatoryName: institutionalSettings.registrarName,
      signatoryTitle: institutionalSettings.registrarTitle,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* 1. Public Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-3 py-2 sm:min-h-20 sm:py-0">
            {/* College Crest & Identity */}
            <button
              className="flex min-w-0 items-center gap-2.5 text-left sm:gap-3"
              onClick={() => handleSectionChange("home")}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-emerald-500 bg-emerald-700 text-lg font-bold text-white shadow-md sm:h-12 sm:w-12 sm:text-xl">
                KT
              </div>
              <div className="min-w-0">
                <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-emerald-700 sm:block sm:text-xs">
                  Kenya TVETA Certified
                </span>
                <h1 className="truncate text-sm font-bold leading-tight text-slate-900 sm:text-lg">
                  {institutionalSettings.name}
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  {institutionalSettings.motto}
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-1 lg:flex lg:gap-1.5">
              <button
                id="pub_nav_home"
                onClick={() => setActiveSection("home")}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  activeSection === "home"
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Home
              </button>
              <button
                id="pub_nav_programmes"
                onClick={() => setActiveSection("programmes")}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "programmes"
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Courses
              </button>
              <button
                id="pub_nav_admissions"
                onClick={() => setActiveSection("admissions")}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  activeSection === "admissions"
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Admissions
              </button>
              <button
                id="pub_nav_news"
                onClick={() => setActiveSection("news")}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  activeSection === "news"
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                News
              </button>
              <button
                id="pub_nav_downloads"
                onClick={() => setActiveSection("downloads")}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  activeSection === "downloads"
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Resources
              </button>
              <button
                id="pub_nav_contact"
                onClick={() => setActiveSection("contact")}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  activeSection === "contact"
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Quick Action Buttons */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <a
                id="btn_pub_apply_header"
                href="/applicant"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-800 sm:px-3.5 sm:text-sm"
              >
                <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline sm:inline">Apply</span>
              </a>

              <a
                id="btn_pub_login_portal"
                href="/app"
                className="hidden items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:flex sm:px-3.5 sm:text-sm"
              >
                <GraduationCap className="h-3.5 w-3.5 text-emerald-700 sm:h-4 sm:w-4" />
                <span>Login</span>
              </a>

              <button
                type="button"
                aria-label={
                  isMobileNavOpen ? "Close navigation" : "Open navigation"
                }
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="rounded-lg border border-slate-300 p-2 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
              >
                {isMobileNavOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <nav
            className={`${isMobileNavOpen ? "flex" : "hidden"} flex-col gap-1 border-t border-slate-100 py-2 lg:hidden`}
          >
            {[
              ["home", "Home"],
              ["programmes", "Courses"],
              ["admissions", "Admissions"],
              ["news", "News"],
              ["downloads", "Resources"],
              ["contact", "Contact"],
            ].map(([section, label]) => (
              <button
                key={section}
                onClick={() =>
                  handleSectionChange(section as typeof activeSection)
                }
                className={`rounded-lg px-3 py-2 text-left text-sm font-medium ${activeSection === section ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 2. SECTION: HOME HERO & HIGHLIGHTS */}
      {activeSection === "home" && (
        <>
          {/* Hero Banner */}
          <div className="relative bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white overflow-hidden py-16 lg:py-24">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      May & September 2026 Intakes Open (KUCCPS &
                      Self-Sponsored)
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Equipping Kenya’s Youth with Practical Industry & Technical
                    Skills.
                  </h1>

                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                    Pursue market-driven Diploma, Craft Certificate, and Artisan
                    qualifications in Computing, Engineering, Building Sciences,
                    Business, Hospitality, and Agriculture accredited by TVETA,
                    KNEC, and CDACC.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      id="btn_hero_apply_now"
                      onClick={() => handleApplyForProgramme()}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all transform active:scale-95"
                    >
                      <span>Start Online Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      id="btn_hero_browse_courses"
                      onClick={() => setActiveSection("programmes")}
                      className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm flex items-center gap-2 transition-all"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Explore 12+ Programmes</span>
                    </button>

                    <button
                      id="btn_hero_prospectus"
                      onClick={handleDownloadProspectus}
                      className="px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Prospectus</span>
                    </button>
                  </div>

                  {/* Trust Metrics */}
                  <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800">
                    <div>
                      <div className="text-2xl font-bold text-emerald-400">
                        100%
                      </div>
                      <div className="text-xs text-slate-400">
                        Industry Attachment
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-400">
                        94.8%
                      </div>
                      <div className="text-xs text-slate-400">
                        KNEC / CDACC Pass
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal-400">
                        3,500+
                      </div>
                      <div className="text-xs text-slate-400">
                        Active Trainees
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">
                        3 Campuses
                      </div>
                      <div className="text-xs text-slate-400">
                        Nairobi, CBD & Nakuru
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Hero Info Card */}
                <div className="lg:col-span-5">
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2.5">
                        <Award className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">
                          Official Accreditation
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Active 2026
                      </span>
                    </div>

                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>
                          <strong>TVETA Reg:</strong> Reg. No. TVETA/0248/2020
                          as a National TVET Institution.
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>
                          <strong>KNEC Centre:</strong> Certified Examination
                          Centre #20401102 (Technical & Business).
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>
                          <strong>TVET CDACC:</strong> CBET Competency-Based
                          Assessment Certified Centre.
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <span>
                          <strong>HELB & KUCCPS:</strong> Eligible for
                          Government Capitation, HELB Loans & County Bursaries.
                        </span>
                      </div>
                    </div>

                    {/* M-Pesa Payment Info Box */}
                    <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3.5 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-emerald-300">
                        <span>Lipa na M-Pesa PayBill</span>
                        <span className="font-mono text-white text-sm">
                          247247
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        Account No: Trainee Admission No (e.g.{" "}
                        <code>CIT/2026/049</code>) or Application No.
                      </p>
                    </div>

                    {/* Quick Portal Gateway buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => navigateToPortal("APPLICANT")}
                        className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center transition-colors"
                      >
                        Applicant Status Hub
                      </button>
                      <button
                        onClick={() => navigateToPortal("STUDENT")}
                        className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs text-center border border-slate-700 transition-colors"
                      >
                        Student Portal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Courses Showcase */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Academic Offerings
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  Popular & Market-Driven TVET Programmes
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Hands-on training aligned with Vision 2030 and national
                  industrial workforce requirements.
                </p>
              </div>

              <button
                onClick={() => setActiveSection("programmes")}
                className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <span>View All 12 Programmes</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {KENYAN_PUBLIC_PROGRAMMES.filter((p) => p.featured).map(
                (prog) => (
                  <div
                    key={prog.id}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {prog.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {prog.examiningBody} • {prog.qualificationLevel}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {prog.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {prog.departmentName}
                      </p>

                      <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-700 border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Min. Entry:</span>
                          <span className="font-semibold">
                            {prog.kcseRequirement}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Duration:</span>
                          <span className="font-semibold">
                            {prog.durationTerms} Terms (
                            {prog.durationMonths / 12} Yrs)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Tuition Fee:</span>
                          <span className="font-bold text-emerald-700">
                            KES {prog.tuitionFeePerTerm.toLocaleString()} / Term
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedProgrammeModal(prog)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        View Syllabus & Requirements
                      </button>

                      <button
                        onClick={() => handleApplyForProgramme(prog)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* Key Advantages / Why Choose KTVTC */}
          <section className="bg-slate-100 border-y border-slate-200 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  The TVET Excellence Advantage
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  Why Study at Kenya Technical & Vocational College?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Modern Engineering & ICT Workshops
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Well-equipped laboratories including Cisco networking
                    facilities, auto-mechanics diagnostics, electrical test
                    benches, and industrial commercial kitchen labs.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Guaranteed Industrial Attachment
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dedicated Industrial Liaison Office facilitating mandatory
                    12-week placements with top tier corporations like KPLC,
                    KenGen, Safaricom, and leading manufacturing firms.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Affordable Fees & Bursary Support
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Low regulated tuition fees, direct qualification for Higher
                    Education Loans Board (HELB) TVET loans, and seamless county
                    bursary allocation support.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 3. SECTION: PROGRAMMES CATALOG (SEARCHABLE & FILTERABLE) */}
      {activeSection === "programmes" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Academic Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              All Accredited Programmes & Courses
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Search by qualification level, department, or examining body
              (KNEC, TVET CDACC, NITA, KASNEB).
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search course title or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              {/* Department Dropdown */}
              <div>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Dropdown */}
              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">All Qualification Levels</option>
                  <option value="DIPLOMA">Diploma (Level 6)</option>
                  <option value="CRAFT_CERTIFICATE">
                    Craft Certificate (Level 5)
                  </option>
                  <option value="ARTISAN">Artisan (Level 4)</option>
                  <option value="CERTIFICATE">Professional Certificate</option>
                </select>
              </div>

              {/* Examining Body Dropdown */}
              <div>
                <select
                  value={selectedBody}
                  onChange={(e) => setSelectedBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">All Examining Bodies</option>
                  <option value="KNEC">
                    KNEC (Kenya National Exam Council)
                  </option>
                  <option value="TVET_CDACC">
                    TVET CDACC (CBET Curriculum)
                  </option>
                  <option value="NITA">
                    NITA (National Industrial Training)
                  </option>
                  <option value="KASNEB">KASNEB (Accountancy & Finance)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>
                Showing <strong>{filteredProgrammes.length}</strong> matching
                courses
              </span>
              {(selectedDept !== "ALL" ||
                selectedLevel !== "ALL" ||
                selectedBody !== "ALL" ||
                searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedDept("ALL");
                    setSelectedLevel("ALL");
                    setSelectedBody("ALL");
                    setSearchQuery("");
                  }}
                  className="text-emerald-700 hover:underline font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Programmes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProgrammes.map((prog) => (
              <div
                key={prog.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {prog.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {prog.examiningBody} •{" "}
                      {prog.qualificationLevel.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {prog.name}
                  </h3>

                  <p className="text-xs text-slate-600">
                    {prog.departmentName}
                  </p>

                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-700 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Min. Requirements:</span>
                      <span className="font-semibold text-slate-900">
                        {prog.kcseRequirement}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Duration:</span>
                      <span className="font-semibold">
                        {prog.durationTerms} Terms ({prog.durationMonths}{" "}
                        Months)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tuition Fee:</span>
                      <span className="font-bold text-emerald-700">
                        KES {prog.tuitionFeePerTerm.toLocaleString()} / Term
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Study Mode:</span>
                      <span className="font-semibold">
                        {prog.studyMode.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProgrammeModal(prog)}
                    className="text-xs font-semibold text-slate-600 hover:text-emerald-700"
                  >
                    Details & Careers
                  </button>

                  <button
                    onClick={() => handleApplyForProgramme(prog)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. SECTION: ADMISSIONS GUIDE */}
      {activeSection === "admissions" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Join Our Institution
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Step-by-Step Admissions Procedure
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Both government-sponsored (KUCCPS) and self-sponsored applicants
              can register seamlessly online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Select Your Programme
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose your desired Diploma, Craft, or Artisan programme and
                verify minimum KCSE subject prerequisites.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Fill Online Application
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide personal bio-data, guardian details, KCSE index number,
                and preferred intake (January, May, or September).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Upload Documents
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload clear scans of your KCSE Certificate / Result Slip,
                National ID or Birth Certificate, and Passport Photo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Receive Offer Letter
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track your review status, download your formal Admission Letter,
                and pay term fees via M-Pesa Paybill 247247.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-emerald-900 text-white rounded-2xl p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold">
              Ready to Start Your Application?
            </h3>
            <p className="text-emerald-200 text-sm max-w-xl mx-auto">
              Applications for May 2026 intake close on 25th April 2026. Takes
              only 5 minutes to submit online.
            </p>
            <button
              onClick={() => handleApplyForProgramme()}
              className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Go to Applicant Portal
            </button>
          </div>
        </section>
      )}

      {/* 5. SECTION: NEWS & NOTICES */}
      {activeSection === "news" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Official Updates
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                News, Announcements & Tenders
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                "ALL",
                "INTAKE_ALERT",
                "EXAMINATION_NOTICE",
                "GRADUATION",
                "ANNOUNCEMENT",
                "TENDER",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewsCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    newsCategory === cat
                      ? "bg-emerald-700 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-emerald-200 transition-colors space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                    {item.category.replace("_", " ")}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Published: {item.publishedDate} by {item.author}
                    </span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. SECTION: DOWNLOAD CENTRE */}
      {activeSection === "downloads" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Institutional Repository
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Public Download Centre
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Official prospectuses, fee structures, application guides, and
              student regulatory handbooks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KENYAN_PUBLIC_DOWNLOADS.map((dl) => (
              <div
                key={dl.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {dl.fileFormat} • {dl.fileSize}
                    </span>
                    <span className="text-xs text-slate-500">
                      Updated: {dl.updatedDate}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {dl.title}
                  </h3>

                  <p className="text-xs text-slate-500">
                    Target: {dl.targetAudience}
                  </p>
                </div>

                <button
                  onClick={handleDownloadProspectus}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. SECTION: CONTACT & CAMPUS LOCATIONS */}
      {activeSection === "contact" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Get in Touch
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Campuses & Contact Information
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Visit our administrative offices or contact our admissions desks
              directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Nairobi Main Campus
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Off Ngong Road, Administration Complex
                <br />
                P.O. Box 45321 - 00100 Nairobi
                <br />
                Tel: +254 (0) 20 271 8900
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                CBD Town Campus
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pension Towers 4th Floor, Loita Street, Nairobi
                <br />
                Evening & Part-time Professional Classes
                <br />
                Tel: +254 712 345 678
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Nakuru Western Campus
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Technology Way, Nakuru Town West
                <br />
                Agriculture & Engineering Demo Centre
                <br />
                Tel: +254 722 918 273
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 8. MODAL: PROGRAMME SYLLABUS & DETAILS */}
      {selectedProgrammeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedProgrammeModal.code} •{" "}
                  {selectedProgrammeModal.examiningBody}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {selectedProgrammeModal.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedProgrammeModal.departmentName}
                </p>
              </div>

              <button
                onClick={() => setSelectedProgrammeModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <strong>Qualification Level:</strong>{" "}
                    {selectedProgrammeModal.qualificationLevel}
                  </div>
                  <div>
                    <strong>Duration:</strong>{" "}
                    {selectedProgrammeModal.durationTerms} Terms (
                    {selectedProgrammeModal.durationMonths} Months)
                  </div>
                  <div>
                    <strong>Tuition Fee:</strong> KES{" "}
                    {selectedProgrammeModal.tuitionFeePerTerm.toLocaleString()}{" "}
                    / Term
                  </div>
                  <div>
                    <strong>Campus:</strong> {selectedProgrammeModal.campus}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  Minimum Entry Requirements
                </h4>
                <p className="text-xs text-slate-600">
                  {selectedProgrammeModal.minimumRequirements}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  Career & Industry Opportunities
                </h4>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  {selectedProgrammeModal.careerOutcomes.map((career, i) => (
                    <li key={i}>{career}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                <strong>Accreditation:</strong>{" "}
                {selectedProgrammeModal.accreditation}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedProgrammeModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedProgrammeModal(null);
                  handleApplyForProgramme(selectedProgrammeModal);
                }}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
              >
                Apply for this Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. PUBLIC FOOTER */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-800">
              {institutionalSettings.name}
            </p>
            <p>
              Accredited by TVETA under the TVET Act No. 29 of 2013 • Reg.{" "}
              {KENYAN_COLLEGE_INFO.regNumber}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSection("programmes")}
              className="hover:underline"
            >
              Courses
            </button>
            <button
              onClick={() => setActiveSection("admissions")}
              className="hover:underline"
            >
              Admissions
            </button>
            <button
              onClick={() => navigateToPortal("STUDENT")}
              className="hover:underline font-semibold text-emerald-700"
            >
              Trainee Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
