"use client";

import React, { useState } from "react";
import { useERP } from "@/context/erp-context";
import { PortalId } from "@/types/erp";
import {
  GraduationCap,
  BookOpenCheck,
  Library,
  Receipt,
  FileSpreadsheet,
  Users,
  Building2,
  ShieldAlert,
  UserCheck,
  LayoutDashboard,
  User,
  CalendarCheck,
  Award,
  CreditCard,
  CheckCircle,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  Clock,
  BookMarked,
  FileCheck2,
  HelpCircle,
  Activity,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Database,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?:
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "brand";
  section?: string;
}

export function PortalNavigation() {
  const {
    activePortalId,
    activeNavTab,
    setActiveNavTab,
    navigateToPortal,
    portals,
    currentUser,
  } = useERP();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activePortal =
    portals.find((p) => p.id === activePortalId) || portals[0];
  const assignment = currentUser.portalAssignments.find(
    (a) => a.portalId === activePortalId,
  );
  const isMonitor = assignment?.isMonitor;
  const isAdmin = assignment?.isAdmin;

  const isSuperAdmin = currentUser.portalAssignments.some(
    (a) =>
      a.portalId === "ADMIN" && (a.roleId === "ROLE_SUPER_ADMIN" || a.isAdmin),
  );

  // Only other portals linked to the user's role
  const otherRolePortals = portals.filter(
    (p) =>
      p.id !== activePortalId &&
      (isSuperAdmin ||
        currentUser.portalAssignments.some((a) => a.portalId === p.id)),
  );

  const getPortalIcon = (id: PortalId) => {
    switch (id) {
      case "STUDENT":
        return <GraduationCap className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case "ELEARNING":
        return (
          <BookOpenCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        );
      case "ELIBRARY":
        return <Library className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case "FINANCE":
        return <Receipt className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case "EXAMINATIONS":
        return (
          <FileSpreadsheet className="w-3.5 h-3.5 text-rose-400 shrink-0" />
        );
      case "HR":
        return <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      case "ADMISSIONS":
        return <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />;
      case "HOSTEL":
        return <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case "ADMIN":
        return <ShieldAlert className="w-3.5 h-3.5 text-slate-300 shrink-0" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  // Generate portal-specific navigation items grouped logically
  const getNavItems = (): NavItem[] => {
    switch (activePortalId) {
      case "STUDENT":
        return [
          {
            id: "dashboard",
            label: "Overview",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Core Workspace",
          },
          {
            id: "profile",
            label: "Student Bio & ID",
            icon: <User className="w-4 h-4" />,
            section: "Core Workspace",
          },
          {
            id: "registration",
            label: "Course Registration",
            icon: <CalendarCheck className="w-4 h-4" />,
            section: "Academics",
          },
          {
            id: "courses",
            label: "Enrolled Courses & Timetable",
            icon: <BookMarked className="w-4 h-4" />,
            section: "Academics",
          },
          {
            id: "results",
            label: "Exam Results & CGPA",
            icon: <Award className="w-4 h-4" />,
            section: "Academics",
          },
          {
            id: "fees",
            label: "Fees & Invoices",
            icon: <CreditCard className="w-4 h-4" />,
            section: "Finance & Clearance",
          },
          {
            id: "clearance",
            label: "Clearance Status",
            icon: <CheckCircle className="w-4 h-4" />,
            section: "Finance & Clearance",
          },
          {
            id: "requests",
            label: "Student Petitions",
            icon: <MessageSquare className="w-4 h-4" />,
            section: "Support & Records",
          },
          {
            id: "documents",
            label: "Official Documents",
            icon: <FileText className="w-4 h-4" />,
            section: "Support & Records",
          },
          ...(isMonitor || isAdmin
            ? [
                {
                  id: "admin_monitor",
                  label: isMonitor ? "Portal Monitor" : "Administration",
                  icon: <Activity className="w-4 h-4" />,
                  section: "Governance",
                },
              ]
            : []),
        ];

      case "ELEARNING":
        return [
          {
            id: "dashboard",
            label: "LMS Dashboard",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Workspace",
          },
          {
            id: "courses",
            label: "Course Modules",
            icon: <BookOpenCheck className="w-4 h-4" />,
            section: "Learning",
          },
          {
            id: "assignments",
            label: "Assignments",
            icon: <FileCheck2 className="w-4 h-4" />,
            section: "Learning",
          },
          {
            id: "quizzes",
            label: "Assessments",
            icon: <HelpCircle className="w-4 h-4" />,
            section: "Learning",
          },
          {
            id: "grading",
            label: "Grading Studio",
            icon: <Award className="w-4 h-4" />,
            section: "Grading",
          },
          {
            id: "data_lifecycle",
            label: "LMS Master Data",
            icon: <Database className="w-4 h-4" />,
            section: "Management",
          },
          {
            id: "analytics",
            label: "Platform Telemetry",
            icon: <Activity className="w-4 h-4" />,
            section: "Management",
          },
          ...(isAdmin
            ? [
                {
                  id: "settings",
                  label: "Platform Settings",
                  icon: <Settings className="w-4 h-4" />,
                  section: "Management",
                },
              ]
            : []),
        ];

      case "ELIBRARY":
        return [
          {
            id: "dashboard",
            label: "Library Overview",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Workspace",
          },
          {
            id: "catalog",
            label: "Book Catalogue",
            icon: <Library className="w-4 h-4" />,
            section: "Collection",
          },
          {
            id: "data_lifecycle",
            label: "Resource Lifecycle",
            icon: <Database className="w-4 h-4" />,
            section: "Collection",
          },
          {
            id: "my_loans",
            label: "Loans & Circulation",
            icon: <Clock className="w-4 h-4" />,
            section: "Circulation",
          },
          {
            id: "digital_drm",
            label: "Digital Resources",
            icon: <FileText className="w-4 h-4" />,
            section: "Circulation",
          },
          {
            id: "reservations",
            label: "Reservations Queue",
            icon: <BookMarked className="w-4 h-4" />,
            section: "Circulation",
          },
          {
            id: "monitor",
            label: "Circulation Telemetry",
            icon: <Activity className="w-4 h-4" />,
            section: "Management",
          },
          ...(isAdmin
            ? [
                {
                  id: "policies",
                  label: "Circulation Policies",
                  icon: <Settings className="w-4 h-4" />,
                  section: "Management",
                },
              ]
            : []),
        ];

      case "FINANCE":
        return [
          {
            id: "dashboard",
            label: "Bursary Overview",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Workspace",
          },
          {
            id: "workflow",
            label: "Disbursement Pipeline",
            icon: <ShieldCheck className="w-4 h-4" />,
            section: "Operations",
          },
          {
            id: "payments",
            label: "Payment Register",
            icon: <Receipt className="w-4 h-4" />,
            section: "Operations",
          },
          {
            id: "data_lifecycle",
            label: "Invoice & Asset Data",
            icon: <Database className="w-4 h-4" />,
            section: "Operations",
          },
          {
            id: "reconciliation",
            label: "Reconciliation",
            icon: <CreditCard className="w-4 h-4" />,
            section: "Governance",
          },
          {
            id: "fee_structures",
            label: "Fee Structures",
            icon: <FileSpreadsheet className="w-4 h-4" />,
            section: "Governance",
          },
          {
            id: "monitor",
            label: "Finance Audits",
            icon: <Activity className="w-4 h-4" />,
            section: "Governance",
          },
        ];

      case "EXAMINATIONS":
        return [
          {
            id: "dashboard",
            label: "Exam Board Overview",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Workspace",
          },
          {
            id: "marks_entry",
            label: "Lecturer Marks Entry",
            icon: <FileSpreadsheet className="w-4 h-4" />,
            section: "Grading",
          },
          {
            id: "moderation",
            label: "Moderation Review",
            icon: <CheckCircle className="w-4 h-4" />,
            section: "Grading",
          },
          {
            id: "approvals",
            label: "Senate Gazette",
            icon: <Award className="w-4 h-4" />,
            section: "Governance",
          },
          {
            id: "data_lifecycle",
            label: "Exam Data Lifecycle",
            icon: <Database className="w-4 h-4" />,
            section: "Governance",
          },
          {
            id: "monitor",
            label: "Examination Telemetry",
            icon: <Activity className="w-4 h-4" />,
            section: "Governance",
          },
        ];

      case "LECTURER":
        return [
          {
            id: "dashboard",
            label: "Faculty Overview",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Workspace",
          },
          {
            id: "courses",
            label: "My Courses & Syllabi",
            icon: <BookOpenCheck className="w-4 h-4" />,
            section: "Teaching",
          },
          {
            id: "data_lifecycle",
            label: "Course Lifecycle",
            icon: <Database className="w-4 h-4" />,
            section: "Teaching",
          },
          {
            id: "attendance",
            label: "Attendance Studio",
            icon: <CalendarCheck className="w-4 h-4" />,
            section: "Teaching",
          },
          {
            id: "assignments",
            label: "Assignments & Rubrics",
            icon: <FileCheck2 className="w-4 h-4" />,
            section: "Assessment",
          },
          {
            id: "cbt_tests",
            label: "Question Bank & CBT",
            icon: <HelpCircle className="w-4 h-4" />,
            section: "Assessment",
          },
          {
            id: "gradebook",
            label: "Senate Gradebook",
            icon: <FileSpreadsheet className="w-4 h-4" />,
            section: "Assessment",
          },
          {
            id: "advising",
            label: "Student Advising",
            icon: <Users className="w-4 h-4" />,
            section: "Academic Support",
          },
          {
            id: "supervision",
            label: "Thesis Supervision",
            icon: <GraduationCap className="w-4 h-4" />,
            section: "Academic Support",
          },
          {
            id: "research",
            label: "Research Publications",
            icon: <Award className="w-4 h-4" />,
            section: "Professional",
          },
          {
            id: "workload",
            label: "Workload & Requests",
            icon: <Receipt className="w-4 h-4" />,
            section: "Professional",
          },
          {
            id: "monitor",
            label: "Faculty Telemetry",
            icon: <Activity className="w-4 h-4" />,
            section: "Professional",
          },
        ];

      case "ADMISSIONS":
        return [
          {
            id: "dashboard",
            label: "Admissions Overview",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Workspace",
          },
          {
            id: "applications",
            label: "Applicant Pipeline",
            icon: <Users className="w-4 h-4" />,
            section: "Pipeline",
          },
          {
            id: "data_lifecycle",
            label: "Applicant Lifecycle",
            icon: <Database className="w-4 h-4" />,
            section: "Pipeline",
          },
          {
            id: "scrutiny",
            label: "Credential Verification",
            icon: <ShieldCheck className="w-4 h-4" />,
            section: "Screening",
          },
          {
            id: "offers",
            label: "Offer Letters",
            icon: <FileText className="w-4 h-4" />,
            section: "Screening",
          },
          {
            id: "monitor",
            label: "Admissions Telemetry",
            icon: <Activity className="w-4 h-4" />,
            section: "Governance",
          },
        ];

      case "HOSTEL":
        return [
          {
            id: "dashboard",
            label: "Hostel Overview",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Workspace",
          },
          {
            id: "allocation",
            label: "Room Allocations",
            icon: <Building2 className="w-4 h-4" />,
            section: "Operations",
          },
          {
            id: "data_lifecycle",
            label: "Hostel Inventory Data",
            icon: <Database className="w-4 h-4" />,
            section: "Operations",
          },
          {
            id: "residents",
            label: "Hall Residents Directory",
            icon: <Users className="w-4 h-4" />,
            section: "Operations",
          },
          {
            id: "maintenance",
            label: "Maintenance Workorders",
            icon: <AlertTriangle className="w-4 h-4" />,
            section: "Facilities",
          },
          {
            id: "clearance",
            label: "Hostel Clearance",
            icon: <CheckCircle className="w-4 h-4" />,
            section: "Facilities",
          },
        ];

      case "HR":
        return [
          {
            id: "dashboard",
            label: "HR Overview",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Workspace",
          },
          {
            id: "staff",
            label: "Staff Directory",
            icon: <Users className="w-4 h-4" />,
            section: "Workforce",
          },
          {
            id: "data_lifecycle",
            label: "Staff Data Lifecycle",
            icon: <Database className="w-4 h-4" />,
            section: "Workforce",
          },
          {
            id: "leaves",
            label: "Leave Applications",
            icon: <CalendarCheck className="w-4 h-4" />,
            section: "Operations",
          },
          {
            id: "payroll",
            label: "Payroll Batches",
            icon: <Receipt className="w-4 h-4" />,
            section: "Operations",
          },
          {
            id: "monitor",
            label: "HR Telemetry",
            icon: <Activity className="w-4 h-4" />,
            section: "Governance",
          },
        ];

      case "PUBLIC":
        return [
          {
            id: "home",
            label: "Public Homepage",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Public Portal",
          },
          {
            id: "programmes",
            label: "Course Catalog",
            icon: <BookOpenCheck className="w-4 h-4" />,
            section: "Academics",
          },
          {
            id: "admissions",
            label: "Admissions Guide",
            icon: <UserCheck className="w-4 h-4" />,
            section: "Admissions",
          },
          {
            id: "news",
            label: "News & Announcements",
            icon: <Bell className="w-4 h-4" />,
            section: "Information",
          },
          {
            id: "downloads",
            label: "Downloads & Prospectus",
            icon: <FileText className="w-4 h-4" />,
            section: "Information",
          },
          {
            id: "contact",
            label: "Campuses & Contact",
            icon: <Building2 className="w-4 h-4" />,
            section: "Information",
          },
        ];

      case "APPLICANT":
        return [
          {
            id: "application_form",
            label: "Application Wizard",
            icon: <UserCheck className="w-4 h-4" />,
            section: "Onboarding",
          },
          {
            id: "mpesa_payment",
            label: "M-Pesa Fee (KES 1,000)",
            icon: <CreditCard className="w-4 h-4" />,
            section: "Onboarding",
          },
          {
            id: "track_status",
            label: "Track Application Status",
            icon: <Clock className="w-4 h-4" />,
            section: "Verification",
          },
          {
            id: "offer_letter",
            label: "Admission Offer Letter",
            icon: <Award className="w-4 h-4" />,
            section: "Verification",
          },
        ];

      case "HOD":
        return [
          {
            id: "curriculum",
            label: "Curricula & Syllabus",
            icon: <BookOpenCheck className="w-4 h-4" />,
            section: "Academic Management",
          },
          {
            id: "allocation",
            label: "Lecturer Allocations",
            icon: <Users className="w-4 h-4" />,
            section: "Academic Management",
          },
          {
            id: "moderation",
            label: "Marks Moderation",
            icon: <Award className="w-4 h-4" />,
            section: "Assessment",
          },
          {
            id: "timetable",
            label: "Timetable & Lab Utilization",
            icon: <CalendarCheck className="w-4 h-4" />,
            section: "Facilities",
          },
        ];

      case "REGISTRAR":
        return [
          {
            id: "student_registry",
            label: "Trainee Master Registry",
            icon: <Users className="w-4 h-4" />,
            section: "Registry",
          },
          {
            id: "admission_handover",
            label: "Matriculation Handover",
            icon: <UserCheck className="w-4 h-4" />,
            section: "Admissions",
          },
          {
            id: "academic_calendar",
            label: "Academic Calendar",
            icon: <CalendarCheck className="w-4 h-4" />,
            section: "Schedules",
          },
          {
            id: "transcripts",
            label: "Official Transcripts",
            icon: <FileText className="w-4 h-4" />,
            section: "Documentation",
          },
        ];

      case "ATTACHMENT":
        return [
          {
            id: "placements",
            label: "Attachment Directory",
            icon: <Building2 className="w-4 h-4" />,
            section: "Liaison",
          },
          {
            id: "logbooks",
            label: "Weekly Logbook Verification",
            icon: <FileCheck2 className="w-4 h-4" />,
            section: "Assessments",
          },
          {
            id: "assessors",
            label: "Site Assessment Rubrics",
            icon: <Award className="w-4 h-4" />,
            section: "Assessments",
          },
          {
            id: "insurance",
            label: "Insurance & Letters",
            icon: <ShieldCheck className="w-4 h-4" />,
            section: "Documentation",
          },
        ];

      case "PROCUREMENT":
        return [
          {
            id: "requisitions",
            label: "Department Requisitions",
            icon: <Receipt className="w-4 h-4" />,
            section: "Purchasing",
          },
          {
            id: "inventory",
            label: "Central Store Stock",
            icon: <Database className="w-4 h-4" />,
            section: "Stores",
          },
          {
            id: "purchase_orders",
            label: "Local Purchase Orders (LPO)",
            icon: <FileText className="w-4 h-4" />,
            section: "Purchasing",
          },
        ];

      case "PRINCIPAL":
        return [
          {
            id: "overview",
            label: "Executive KPIs",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Executive",
          },
          {
            id: "financials",
            label: "Revenue & Inflows",
            icon: <Receipt className="w-4 h-4" />,
            section: "Financials",
          },
          {
            id: "academic_kpis",
            label: "Department Scorecards",
            icon: <Award className="w-4 h-4" />,
            section: "Performance",
          },
          {
            id: "governance",
            label: "Senate & Council Gazettes",
            icon: <ShieldAlert className="w-4 h-4" />,
            section: "Governance",
          },
        ];

      case "ADMIN":
        return [
          {
            id: "dashboard",
            label: "Security & Governance",
            icon: <ShieldAlert className="w-4 h-4" />,
            section: "Command Center",
          },
          {
            id: "institutional_settings",
            label: "Institutional Brand Profile",
            icon: <Building2 className="w-4 h-4" />,
            section: "Configuration",
          },
          {
            id: "users",
            label: "Central Staff RBAC",
            icon: <Users className="w-4 h-4" />,
            section: "Identity & Access",
          },
          {
            id: "rbac_matrix",
            label: "Visual Role Matrix",
            icon: <Settings className="w-4 h-4" />,
            section: "Identity & Access",
          },
          {
            id: "portals",
            label: "Micro-Portal Registry",
            icon: <Layers className="w-4 h-4" />,
            section: "Platform",
          },
          {
            id: "data_governance",
            label: "Master Data Lifecycle",
            icon: <Database className="w-4 h-4" />,
            section: "Platform",
          },
          {
            id: "audit",
            label: "Audit Trail Ledger",
            icon: <FileText className="w-4 h-4" />,
            section: "Governance",
          },
        ];

      default:
        return [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="w-4 h-4" />,
            section: "Workspace",
          },
        ];
    }
  };

  const navItems = getNavItems();

  // Group items by section
  const sections = Array.from(
    new Set(navItems.map((item) => item.section || "General")),
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase font-mono">
            {activePortal.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            ({assignment?.roleName || "Staff"})
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"
        >
          {isMobileOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Sidebar */}
      <aside
        className={`w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between shrink-0 text-slate-300 shadow-sm transition-all duration-200 ${
          isMobileOpen
            ? "absolute inset-y-0 left-0 z-40 flex w-[min(18rem,calc(100vw-1rem))] max-h-full"
            : "hidden md:flex"
        }`}
      >
        {/* Navigation Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono block mb-1">
            {activePortal.code} Module
          </span>
          <h2 className="text-sm font-bold text-white tracking-tight">
            {activePortal.name}
          </h2>

          {/* Role Pill */}
          <div className="mt-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[9px] uppercase text-slate-400 block font-mono font-medium">
                Assigned Role
              </span>
              <span className="font-semibold text-slate-200 truncate block text-[11px]">
                {assignment ? assignment.roleName : "Super Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Grouped Nav Items */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {sections.map((section) => {
            const sectionItems = navItems.filter(
              (i) => (i.section || "General") === section,
            );
            return (
              <div key={section} className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 font-mono">
                  {section}
                </div>
                {sectionItems.map((item) => {
                  const isActive = activeNavTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveNavTab(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white font-semibold shadow-sm"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={isActive ? "text-white" : "text-slate-400"}
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Cross-Portal Quick Launch Bridges (Role-Linked Only) */}
        {otherRolePortals.length > 0 && (
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 font-mono">
              Direct Portal Bridges
            </div>

            <div className="space-y-1">
              {otherRolePortals.map((p) => (
                <button
                  key={p.id}
                  id={`bridge-open-${p.id.toLowerCase()}-btn`}
                  onClick={() => {
                    navigateToPortal(p.id);
                    setIsMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition group cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    {getPortalIcon(p.id)}
                    <span className="truncate">{p.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
