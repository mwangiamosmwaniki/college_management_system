'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalId } from '@/types/erp';
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
  X
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
  section?: string;
}

export function PortalNavigation() {
  const {
    activePortalId,
    activeNavTab,
    setActiveNavTab,
    navigateToPortal,
    portals,
    currentUser
  } = useERP();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activePortal = portals.find(p => p.id === activePortalId) || portals[0];
  const assignment = currentUser.portalAssignments.find(a => a.portalId === activePortalId);
  const isMonitor = assignment?.isMonitor;
  const isAdmin = assignment?.isAdmin;

  // Generate portal-specific navigation items grouped logically
  const getNavItems = (): NavItem[] => {
    switch (activePortalId) {
      case 'STUDENT':
        return [
          { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'Core Workspace' },
          { id: 'profile', label: 'Student Bio & ID', icon: <User className="w-4 h-4" />, section: 'Core Workspace' },
          { id: 'registration', label: 'Course Registration', icon: <CalendarCheck className="w-4 h-4" />, badge: 'Active', badgeVariant: 'brand', section: 'Academics' },
          { id: 'courses', label: 'Enrolled Courses & Timetable', icon: <BookMarked className="w-4 h-4" />, section: 'Academics' },
          { id: 'results', label: 'Exam Results & CGPA', icon: <Award className="w-4 h-4" />, badge: 'Approved', badgeVariant: 'success', section: 'Academics' },
          { id: 'fees', label: 'Fees & Invoices', icon: <CreditCard className="w-4 h-4" />, section: 'Finance & Clearance' },
          { id: 'clearance', label: 'Clearance Status', icon: <CheckCircle className="w-4 h-4" />, section: 'Finance & Clearance' },
          { id: 'requests', label: 'Student Petitions', icon: <MessageSquare className="w-4 h-4" />, section: 'Support & Records' },
          { id: 'documents', label: 'Official Documents', icon: <FileText className="w-4 h-4" />, section: 'Support & Records' },
          ...(isMonitor || isAdmin ? [
            { id: 'admin_monitor', label: isMonitor ? 'Portal Monitor' : 'Administration', icon: <Activity className="w-4 h-4" />, badge: 'Ops', badgeVariant: 'warning' as const, section: 'Governance' }
          ] : [])
        ];

      case 'ELEARNING':
        return [
          { id: 'dashboard', label: 'LMS Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, section: 'Workspace' },
          { id: 'courses', label: 'Course Modules', icon: <BookOpenCheck className="w-4 h-4" />, section: 'Learning' },
          { id: 'assignments', label: 'Assignments', icon: <FileCheck2 className="w-4 h-4" />, badge: '1 Due', badgeVariant: 'warning', section: 'Learning' },
          { id: 'quizzes', label: 'Assessments', icon: <HelpCircle className="w-4 h-4" />, section: 'Learning' },
          { id: 'grading', label: 'Grading Studio', icon: <Award className="w-4 h-4" />, section: 'Grading' },
          { id: 'data_lifecycle', label: 'LMS Master Data', icon: <Database className="w-4 h-4" />, badge: 'CRUD', badgeVariant: 'info', section: 'Management' },
          { id: 'analytics', label: 'Platform Telemetry', icon: <Activity className="w-4 h-4" />, section: 'Management' },
          ...(isAdmin ? [{ id: 'settings', label: 'Platform Settings', icon: <Settings className="w-4 h-4" />, section: 'Management' }] : [])
        ];

      case 'ELIBRARY':
        return [
          { id: 'dashboard', label: 'Library Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'Workspace' },
          { id: 'catalog', label: 'Book Catalogue', icon: <Library className="w-4 h-4" />, section: 'Collection' },
          { id: 'data_lifecycle', label: 'Resource Lifecycle', icon: <Database className="w-4 h-4" />, badge: 'CRUD', badgeVariant: 'info', section: 'Collection' },
          { id: 'my_loans', label: 'Loans & Circulation', icon: <Clock className="w-4 h-4" />, section: 'Circulation' },
          { id: 'digital_drm', label: 'Digital Resources', icon: <FileText className="w-4 h-4" />, badge: 'DRM', badgeVariant: 'brand', section: 'Circulation' },
          { id: 'reservations', label: 'Reservations Queue', icon: <BookMarked className="w-4 h-4" />, section: 'Circulation' },
          { id: 'monitor', label: 'Circulation Telemetry', icon: <Activity className="w-4 h-4" />, section: 'Management' },
          ...(isAdmin ? [{ id: 'policies', label: 'Circulation Policies', icon: <Settings className="w-4 h-4" />, section: 'Management' }] : [])
        ];

      case 'FINANCE':
        return [
          { id: 'dashboard', label: 'Bursary Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'Workspace' },
          { id: 'workflow', label: 'Disbursement Pipeline', icon: <ShieldCheck className="w-4 h-4" />, badge: '4-Stage', badgeVariant: 'brand', section: 'Operations' },
          { id: 'payments', label: 'Payment Register', icon: <Receipt className="w-4 h-4" />, section: 'Operations' },
          { id: 'data_lifecycle', label: 'Invoice & Asset Data', icon: <Database className="w-4 h-4" />, badge: 'CRUD', badgeVariant: 'info', section: 'Operations' },
          { id: 'reconciliation', label: 'Reconciliation', icon: <CreditCard className="w-4 h-4" />, section: 'Governance' },
          { id: 'fee_structures', label: 'Fee Structures', icon: <FileSpreadsheet className="w-4 h-4" />, section: 'Governance' },
          { id: 'monitor', label: 'Finance Audits', icon: <Activity className="w-4 h-4" />, section: 'Governance' }
        ];

      case 'EXAMINATIONS':
        return [
          { id: 'dashboard', label: 'Exam Board Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'Workspace' },
          { id: 'marks_entry', label: 'Lecturer Marks Entry', icon: <FileSpreadsheet className="w-4 h-4" />, section: 'Grading' },
          { id: 'moderation', label: 'Moderation Review', icon: <CheckCircle className="w-4 h-4" />, section: 'Grading' },
          { id: 'approvals', label: 'Senate Gazette', icon: <Award className="w-4 h-4" />, badge: 'Senate', badgeVariant: 'success', section: 'Governance' },
          { id: 'data_lifecycle', label: 'Exam Data Lifecycle', icon: <Database className="w-4 h-4" />, badge: 'CRUD', badgeVariant: 'info', section: 'Governance' },
          { id: 'monitor', label: 'Examination Telemetry', icon: <Activity className="w-4 h-4" />, section: 'Governance' }
        ];

      case 'LECTURER':
        return [
          { id: 'dashboard', label: 'Faculty Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'Workspace' },
          { id: 'courses', label: 'My Courses & Syllabi', icon: <BookOpenCheck className="w-4 h-4" />, section: 'Teaching' },
          { id: 'data_lifecycle', label: 'Course Lifecycle', icon: <Database className="w-4 h-4" />, badge: 'CRUD', badgeVariant: 'info', section: 'Teaching' },
          { id: 'attendance', label: 'Attendance Studio', icon: <CalendarCheck className="w-4 h-4" />, badge: 'Live QR', badgeVariant: 'brand', section: 'Teaching' },
          { id: 'assignments', label: 'Assignments & Rubrics', icon: <FileCheck2 className="w-4 h-4" />, section: 'Assessment' },
          { id: 'cbt_tests', label: 'Question Bank & CBT', icon: <HelpCircle className="w-4 h-4" />, section: 'Assessment' },
          { id: 'gradebook', label: 'Senate Gradebook', icon: <FileSpreadsheet className="w-4 h-4" />, badge: 'Senate', badgeVariant: 'success', section: 'Assessment' },
          { id: 'advising', label: 'Student Advising', icon: <Users className="w-4 h-4" />, section: 'Academic Support' },
          { id: 'supervision', label: 'Thesis Supervision', icon: <GraduationCap className="w-4 h-4" />, section: 'Academic Support' },
          { id: 'research', label: 'Research Publications', icon: <Award className="w-4 h-4" />, section: 'Professional' },
          { id: 'workload', label: 'Workload & Requests', icon: <Receipt className="w-4 h-4" />, section: 'Professional' },
          { id: 'monitor', label: 'Faculty Telemetry', icon: <Activity className="w-4 h-4" />, section: 'Professional' }
        ];

      case 'ADMISSIONS':
        return [
          { id: 'dashboard', label: 'Admissions Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'Workspace' },
          { id: 'applications', label: 'Applicant Pipeline', icon: <Users className="w-4 h-4" />, section: 'Pipeline' },
          { id: 'data_lifecycle', label: 'Applicant Lifecycle', icon: <Database className="w-4 h-4" />, badge: 'CRUD', badgeVariant: 'info', section: 'Pipeline' },
          { id: 'scrutiny', label: 'Credential Verification', icon: <ShieldCheck className="w-4 h-4" />, section: 'Screening' },
          { id: 'offers', label: 'Offer Letters', icon: <FileText className="w-4 h-4" />, section: 'Screening' },
          { id: 'monitor', label: 'Admissions Telemetry', icon: <Activity className="w-4 h-4" />, section: 'Governance' }
        ];

      case 'HOSTEL':
        return [
          { id: 'dashboard', label: 'Hostel Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'Workspace' },
          { id: 'allocation', label: 'Room Allocations', icon: <Building2 className="w-4 h-4" />, section: 'Operations' },
          { id: 'data_lifecycle', label: 'Hostel Inventory Data', icon: <Database className="w-4 h-4" />, badge: 'CRUD', badgeVariant: 'info', section: 'Operations' },
          { id: 'residents', label: 'Hall Residents Directory', icon: <Users className="w-4 h-4" />, section: 'Operations' },
          { id: 'maintenance', label: 'Maintenance Workorders', icon: <AlertTriangle className="w-4 h-4" />, section: 'Facilities' },
          { id: 'clearance', label: 'Hostel Clearance', icon: <CheckCircle className="w-4 h-4" />, section: 'Facilities' }
        ];

      case 'HR':
        return [
          { id: 'dashboard', label: 'HR Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'Workspace' },
          { id: 'staff', label: 'Staff Directory', icon: <Users className="w-4 h-4" />, section: 'Workforce' },
          { id: 'data_lifecycle', label: 'Staff Data Lifecycle', icon: <Database className="w-4 h-4" />, badge: 'CRUD', badgeVariant: 'info', section: 'Workforce' },
          { id: 'leaves', label: 'Leave Applications', icon: <CalendarCheck className="w-4 h-4" />, section: 'Operations' },
          { id: 'payroll', label: 'Payroll Batches', icon: <Receipt className="w-4 h-4" />, section: 'Operations' },
          { id: 'monitor', label: 'HR Telemetry', icon: <Activity className="w-4 h-4" />, section: 'Governance' }
        ];

      case 'PUBLIC':
        return [
          { id: 'home', label: 'Public Homepage', icon: <LayoutDashboard className="w-4 h-4" />, section: 'Public Portal' },
          { id: 'programmes', label: 'Course Catalog', icon: <BookOpenCheck className="w-4 h-4" />, badge: '12+ Courses', badgeVariant: 'brand', section: 'Academics' },
          { id: 'admissions', label: 'Admissions Guide', icon: <UserCheck className="w-4 h-4" />, section: 'Admissions' },
          { id: 'news', label: 'News & Announcements', icon: <Bell className="w-4 h-4" />, section: 'Information' },
          { id: 'downloads', label: 'Downloads & Prospectus', icon: <FileText className="w-4 h-4" />, section: 'Information' },
          { id: 'contact', label: 'Campuses & Contact', icon: <Building2 className="w-4 h-4" />, section: 'Information' }
        ];

      case 'APPLICANT':
        return [
          { id: 'application_form', label: 'Application Wizard', icon: <UserCheck className="w-4 h-4" />, badge: 'May 2026', badgeVariant: 'brand', section: 'Onboarding' },
          { id: 'mpesa_payment', label: 'M-Pesa Fee (KES 1,000)', icon: <CreditCard className="w-4 h-4" />, section: 'Onboarding' },
          { id: 'track_status', label: 'Track Application Status', icon: <Clock className="w-4 h-4" />, section: 'Verification' },
          { id: 'offer_letter', label: 'Admission Offer Letter', icon: <Award className="w-4 h-4" />, badge: 'Offer', badgeVariant: 'success', section: 'Verification' }
        ];

      case 'HOD':
        return [
          { id: 'curriculum', label: 'Curricula & Syllabus', icon: <BookOpenCheck className="w-4 h-4" />, section: 'Academic Management' },
          { id: 'allocation', label: 'Lecturer Allocations', icon: <Users className="w-4 h-4" />, badge: 'Workload', badgeVariant: 'info', section: 'Academic Management' },
          { id: 'moderation', label: 'Marks Moderation', icon: <Award className="w-4 h-4" />, badge: 'Review', badgeVariant: 'warning', section: 'Assessment' },
          { id: 'timetable', label: 'Timetable & Lab Utilization', icon: <CalendarCheck className="w-4 h-4" />, section: 'Facilities' }
        ];

      case 'REGISTRAR':
        return [
          { id: 'student_registry', label: 'Trainee Master Registry', icon: <Users className="w-4 h-4" />, badge: 'Master', badgeVariant: 'brand', section: 'Registry' },
          { id: 'admission_handover', label: 'Matriculation Handover', icon: <UserCheck className="w-4 h-4" />, badge: 'Queue', badgeVariant: 'info', section: 'Admissions' },
          { id: 'academic_calendar', label: 'Academic Calendar', icon: <CalendarCheck className="w-4 h-4" />, section: 'Schedules' },
          { id: 'transcripts', label: 'Official Transcripts', icon: <FileText className="w-4 h-4" />, section: 'Documentation' }
        ];

      case 'ATTACHMENT':
        return [
          { id: 'placements', label: 'Attachment Directory', icon: <Building2 className="w-4 h-4" />, badge: '100% Placed', badgeVariant: 'success', section: 'Liaison' },
          { id: 'logbooks', label: 'Weekly Logbook Verification', icon: <FileCheck2 className="w-4 h-4" />, section: 'Assessments' },
          { id: 'assessors', label: 'Site Assessment Rubrics', icon: <Award className="w-4 h-4" />, section: 'Assessments' },
          { id: 'insurance', label: 'Insurance & Letters', icon: <ShieldCheck className="w-4 h-4" />, section: 'Documentation' }
        ];

      case 'PROCUREMENT':
        return [
          { id: 'requisitions', label: 'Department Requisitions', icon: <Receipt className="w-4 h-4" />, badge: 'Workflow', badgeVariant: 'warning', section: 'Purchasing' },
          { id: 'inventory', label: 'Central Store Stock', icon: <Database className="w-4 h-4" />, badge: 'Live', badgeVariant: 'info', section: 'Stores' },
          { id: 'purchase_orders', label: 'Local Purchase Orders (LPO)', icon: <FileText className="w-4 h-4" />, section: 'Purchasing' }
        ];

      case 'PRINCIPAL':
        return [
          { id: 'overview', label: 'Executive KPIs', icon: <LayoutDashboard className="w-4 h-4" />, badge: 'Strategic', badgeVariant: 'brand', section: 'Executive' },
          { id: 'financials', label: 'Revenue & Inflows', icon: <Receipt className="w-4 h-4" />, section: 'Financials' },
          { id: 'academic_kpis', label: 'Department Scorecards', icon: <Award className="w-4 h-4" />, section: 'Performance' },
          { id: 'governance', label: 'Senate & Council Gazettes', icon: <ShieldAlert className="w-4 h-4" />, section: 'Governance' }
        ];

      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Security & Governance', icon: <ShieldAlert className="w-4 h-4" />, section: 'Command Center' },
          { id: 'institutional_settings', label: 'Institutional Brand Profile', icon: <Building2 className="w-4 h-4" />, badge: 'Brand', badgeVariant: 'brand', section: 'Configuration' },
          { id: 'users', label: 'Central Staff RBAC', icon: <Users className="w-4 h-4" />, badge: 'Staff', badgeVariant: 'info', section: 'Identity & Access' },
          { id: 'rbac_matrix', label: 'Visual Role Matrix', icon: <Settings className="w-4 h-4" />, section: 'Identity & Access' },
          { id: 'portals', label: 'Micro-Portal Registry', icon: <Layers className="w-4 h-4" />, section: 'Platform' },
          { id: 'data_governance', label: 'Master Data Lifecycle', icon: <Database className="w-4 h-4" />, badge: 'CRUD', badgeVariant: 'info', section: 'Platform' },
          { id: 'audit', label: 'Audit Trail Ledger', icon: <FileText className="w-4 h-4" />, section: 'Governance' }
        ];

      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, section: 'Workspace' }
        ];
    }
  };

  const navItems = getNavItems();

  // Group items by section
  const sections = Array.from(new Set(navItems.map(item => item.section || 'General')));

  const getBadgeStyle = (variant?: string) => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'danger':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'info':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'brand':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase font-mono">{activePortal.name}</span>
          <span className="text-[10px] text-slate-400 font-mono">({assignment?.roleName || 'Staff'})</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"
        >
          {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Sidebar */}
      <aside
        className={`w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between shrink-0 text-slate-300 shadow-sm transition-all duration-200 ${
          isMobileOpen ? 'fixed inset-y-16 left-0 z-40 block w-72' : 'hidden md:flex'
        }`}
      >
        {/* Navigation Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
              {activePortal.code} Module
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {activePortal.version}
            </span>
          </div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            {activePortal.name}
          </h2>

          {/* Role Pill */}
          <div className="mt-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[9px] uppercase text-slate-400 block font-mono font-medium">Assigned Role</span>
              <span className="font-semibold text-slate-200 truncate block text-[11px]">
                {assignment ? assignment.roleName : 'Super Admin'}
              </span>
            </div>
            {isMonitor && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9px] font-bold uppercase font-mono">
                Monitor
              </span>
            )}
          </div>
        </div>

        {/* Grouped Nav Items */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {sections.map(section => {
            const sectionItems = navItems.filter(i => (i.section || 'General') === section);
            return (
              <div key={section} className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1 font-mono">
                  {section}
                </div>
                {sectionItems.map(item => {
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
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border font-mono shrink-0 ${getBadgeStyle(
                            item.badgeVariant
                          )}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Cross-Portal Quick Launch Bridges */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between font-mono">
            <span>Direct Portal Bridges</span>
          </div>

          {activePortalId === 'STUDENT' && (
            <div className="space-y-1">
              <button
                id="bridge-open-learning-btn"
                onClick={() => {
                  navigateToPortal('ELEARNING');
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-300 text-xs font-medium transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpenCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open E-Learning</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                id="bridge-open-library-btn"
                onClick={() => {
                  navigateToPortal('ELIBRARY');
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 text-xs font-medium transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Library className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open E-Library</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          )}

          {activePortalId === 'ELEARNING' && (
            <div className="space-y-1">
              <button
                id="bridge-open-student-btn"
                onClick={() => {
                  navigateToPortal('STUDENT');
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 text-blue-300 text-xs font-medium transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  <span>Student Portal</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                id="bridge-open-elibrary-from-lms-btn"
                onClick={() => {
                  navigateToPortal('ELIBRARY');
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 text-xs font-medium transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Library className="w-3.5 h-3.5 text-amber-400" />
                  <span>E-Library</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          )}

          {activePortalId === 'ELIBRARY' && (
            <div className="space-y-1">
              <button
                id="bridge-open-student-from-lib-btn"
                onClick={() => {
                  navigateToPortal('STUDENT');
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 text-blue-300 text-xs font-medium transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  <span>Student Portal</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                id="bridge-open-lms-from-lib-btn"
                onClick={() => {
                  navigateToPortal('ELEARNING');
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-300 text-xs font-medium transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpenCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>E-Learning</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          )}

          {activePortalId !== 'STUDENT' && activePortalId !== 'ELEARNING' && activePortalId !== 'ELIBRARY' && (
            <button
              onClick={() => {
                navigateToPortal('ADMIN');
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                <span>Security Console</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
