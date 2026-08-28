'use client';

import React from 'react';
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
  Database
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
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

  const activePortal = portals.find(p => p.id === activePortalId) || portals[0];
  const assignment = currentUser.portalAssignments.find(a => a.portalId === activePortalId);
  const isMonitor = assignment?.isMonitor;
  const isAdmin = assignment?.isAdmin;

  // Generate portal-specific navigation items
  const getNavItems = (): NavItem[] => {
    switch (activePortalId) {
      case 'STUDENT':
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'profile', label: 'Student Profile & Bio', icon: <User className="w-4 h-4" /> },
          { id: 'registration', label: 'Academic Registration', icon: <CalendarCheck className="w-4 h-4" />, badge: 'Active' },
          { id: 'courses', label: 'Enrolled Courses & Timetable', icon: <BookMarked className="w-4 h-4" /> },
          { id: 'results', label: 'Published Results & CGPA', icon: <Award className="w-4 h-4" />, badge: 'Senate Approved', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'fees', label: 'Fees, Invoices & Receipts', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'clearance', label: 'Clearance Checklist', icon: <CheckCircle className="w-4 h-4" /> },
          { id: 'requests', label: 'Student Requests & Petitions', icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'documents', label: 'Transcripts & Documents', icon: <FileText className="w-4 h-4" /> },
          ...(isMonitor || isAdmin ? [
            { id: 'admin_monitor', label: isMonitor ? 'Student Portal Monitor' : 'Portal Administration', icon: <Activity className="w-4 h-4" />, badge: 'Ops' }
          ] : [])
        ];

      case 'ELEARNING':
        return [
          { id: 'dashboard', label: 'LMS Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'courses', label: 'Course Catalog & Modules', icon: <BookOpenCheck className="w-4 h-4" /> },
          { id: 'assignments', label: 'Assignments & Submissions', icon: <FileCheck2 className="w-4 h-4" />, badge: '1 Due Soon', badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'quizzes', label: 'Quizzes & Assessments', icon: <HelpCircle className="w-4 h-4" /> },
          { id: 'grading', label: 'Instructor Grading Studio', icon: <Award className="w-4 h-4" /> },
          { id: 'data_lifecycle', label: 'LMS Content & Materials', icon: <Database className="w-4 h-4" />, badge: 'CRUD' },
          { id: 'analytics', label: 'LMS Monitor & Telemetry', icon: <Activity className="w-4 h-4" />, badge: 'Monitor' },
          ...(isAdmin ? [{ id: 'settings', label: 'LMS Platform Settings', icon: <Settings className="w-4 h-4" /> }] : [])
        ];

      case 'ELIBRARY':
        return [
          { id: 'dashboard', label: 'Library Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'catalog', label: 'Physical Book Catalogue', icon: <Library className="w-4 h-4" /> },
          { id: 'data_lifecycle', label: 'Book & Resource Lifecycle', icon: <Database className="w-4 h-4" />, badge: 'Catalog' },
          { id: 'my_loans', label: 'Loans & Circulation', icon: <Clock className="w-4 h-4" /> },
          { id: 'digital_drm', label: 'Digital Resources & DRM', icon: <FileText className="w-4 h-4" />, badge: 'DRM Active' },
          { id: 'reservations', label: 'Reservations Queue', icon: <BookMarked className="w-4 h-4" /> },
          { id: 'monitor', label: 'Library Monitor Overview', icon: <Activity className="w-4 h-4" />, badge: 'Telemetry' },
          ...(isAdmin ? [{ id: 'policies', label: 'Circulation Policies & Fines', icon: <Settings className="w-4 h-4" /> }] : [])
        ];

      case 'FINANCE':
        return [
          { id: 'dashboard', label: 'Bursary Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'workflow', label: 'Segregation of Duties Pipeline', icon: <ShieldCheck className="w-4 h-4" />, badge: '4-Stage' },
          { id: 'payments', label: 'Cashier & Payment Register', icon: <Receipt className="w-4 h-4" /> },
          { id: 'data_lifecycle', label: 'Invoice & Asset Lifecycle', icon: <Database className="w-4 h-4" />, badge: 'Ledger' },
          { id: 'reconciliation', label: 'Ledger Reconciliation', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'fee_structures', label: 'Fee Structures & Schedules', icon: <FileSpreadsheet className="w-4 h-4" /> },
          { id: 'monitor', label: 'Finance Monitor & Audits', icon: <Activity className="w-4 h-4" /> }
        ];

      case 'EXAMINATIONS':
        return [
          { id: 'dashboard', label: 'Exam Board Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'marks_entry', label: 'Lecturer Marks Entry', icon: <FileSpreadsheet className="w-4 h-4" /> },
          { id: 'moderation', label: 'Moderation Review', icon: <CheckCircle className="w-4 h-4" /> },
          { id: 'approvals', label: 'Senate Approval & Gazette', icon: <Award className="w-4 h-4" />, badge: 'Registrar' },
          { id: 'data_lifecycle', label: 'Exam Results Governance', icon: <Database className="w-4 h-4" />, badge: 'Senate' },
          { id: 'monitor', label: 'Examination Monitor', icon: <Activity className="w-4 h-4" /> }
        ];

      case 'LECTURER':
        return [
          { id: 'dashboard', label: 'Faculty Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'courses', label: 'My Courses & Syllabi', icon: <BookOpenCheck className="w-4 h-4" /> },
          { id: 'data_lifecycle', label: 'Course & Asset Lifecycle', icon: <Database className="w-4 h-4" />, badge: 'CRUD' },
          { id: 'attendance', label: 'QR Attendance Studio', icon: <CalendarCheck className="w-4 h-4" />, badge: 'Live QR', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'assignments', label: 'Assignments & Rubrics', icon: <FileCheck2 className="w-4 h-4" />, badge: 'Speed Grader' },
          { id: 'cbt_tests', label: 'CBT Tests & Question Bank', icon: <HelpCircle className="w-4 h-4" /> },
          { id: 'gradebook', label: 'Gradebook & Senate Entry', icon: <FileSpreadsheet className="w-4 h-4" />, badge: 'Senate Sheet', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'advising', label: 'Advisees & Early Warning', icon: <Users className="w-4 h-4" />, badge: 'Intervention' },
          { id: 'supervision', label: 'Thesis & Project Supervision', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'research', label: 'Research & Publications', icon: <Award className="w-4 h-4" /> },
          { id: 'workload', label: 'Workload & Requisitions', icon: <Receipt className="w-4 h-4" /> },
          { id: 'monitor', label: 'Faculty Telemetry Monitor', icon: <Activity className="w-4 h-4" /> }
        ];

      case 'ADMISSIONS':
        return [
          { id: 'dashboard', label: 'Admissions Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'applications', label: 'Applicant Pipeline', icon: <Users className="w-4 h-4" /> },
          { id: 'data_lifecycle', label: 'Applicant Data & Batches', icon: <Database className="w-4 h-4" />, badge: 'CRUD' },
          { id: 'scrutiny', label: 'Credential Verification', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'offers', label: 'Offer Letters & Acceptance', icon: <FileText className="w-4 h-4" /> },
          { id: 'monitor', label: 'Admissions Telemetry', icon: <Activity className="w-4 h-4" /> }
        ];

      case 'HOSTEL':
        return [
          { id: 'dashboard', label: 'Hostel Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'allocation', label: 'Room & Bed Allocation', icon: <Building2 className="w-4 h-4" /> },
          { id: 'data_lifecycle', label: 'Hostel Inventory Lifecycle', icon: <Database className="w-4 h-4" /> },
          { id: 'residents', label: 'Hall Residents Directory', icon: <Users className="w-4 h-4" /> },
          { id: 'maintenance', label: 'Maintenance Requests', icon: <AlertTriangle className="w-4 h-4" /> },
          { id: 'clearance', label: 'Hostel Hall Clearance', icon: <CheckCircle className="w-4 h-4" /> }
        ];

      case 'HR':
        return [
          { id: 'dashboard', label: 'HR Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'staff', label: 'Academic & Admin Staff', icon: <Users className="w-4 h-4" /> },
          { id: 'data_lifecycle', label: 'Staff Records Lifecycle', icon: <Database className="w-4 h-4" />, badge: 'HR CRUD' },
          { id: 'leaves', label: 'Leave Applications', icon: <CalendarCheck className="w-4 h-4" /> },
          { id: 'payroll', label: 'Payroll Processing Batches', icon: <Receipt className="w-4 h-4" /> },
          { id: 'monitor', label: 'HR Operational Monitor', icon: <Activity className="w-4 h-4" /> }
        ];

      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Security & Governance Center', icon: <ShieldAlert className="w-4 h-4" /> },
          { id: 'institutional_settings', label: 'Institutional Profile & Brand', icon: <Building2 className="w-4 h-4" />, badge: 'Branding', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'users', label: 'Central Staff Assignments', icon: <Users className="w-4 h-4" />, badge: 'Staff RBAC' },
          { id: 'data_governance', label: 'Master Data & Lifecycle', icon: <Database className="w-4 h-4" />, badge: 'Admin CRUD' },
          { id: 'portals', label: 'Portal Registry & Status', icon: <Layers className="w-4 h-4" /> },
          { id: 'rbac_matrix', label: 'Visual RBAC Matrix & Roles', icon: <Settings className="w-4 h-4" /> },
          { id: 'audit', label: 'Cross-Portal Audit Trail', icon: <FileText className="w-4 h-4" /> }
        ];

      default:
        return [
          { id: 'dashboard', label: 'Portal Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-6.5rem)] text-slate-300 shadow-sm">
      
      {/* Navigation Header with Portal Identity */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            {activePortal.code} Module
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {activePortal.version}
          </span>
        </div>
        <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
          {activePortal.name}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
          {activePortal.description}
        </p>

        {/* Role Tag */}
        <div className="mt-3 p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] uppercase text-slate-400 block font-mono">Your Portal Role</span>
            <span className="font-semibold text-white truncate block">
              {assignment ? assignment.roleName : 'Super Admin'}
            </span>
          </div>
          {isMonitor && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold uppercase">
              Monitor
            </span>
          )}
        </div>
      </div>

      {/* Nav items list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 pb-1">
          Navigation
        </div>
        {navItems.map(item => {
          const isActive = activeNavTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNavTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                    item.badgeColor
                      ? item.badgeColor
                      : isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Cross-Portal Quick Launch Bridges (Strict Architecture Requirement) */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
          <span>Cross-Portal Links</span>
          <span className="text-[9px] text-slate-400">Independent Apps</span>
        </div>

        {activePortalId === 'STUDENT' && (
          <div className="space-y-1.5">
            <button
              id="bridge-open-learning-btn"
              onClick={() => navigateToPortal('ELEARNING')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-300 text-xs font-medium transition group"
            >
              <div className="flex items-center gap-2">
                <BookOpenCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open E-Learning</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              id="bridge-open-library-btn"
              onClick={() => navigateToPortal('ELIBRARY')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 text-xs font-medium transition group"
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
          <div className="space-y-1.5">
            <button
              id="bridge-open-student-btn"
              onClick={() => navigateToPortal('STUDENT')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 text-blue-300 text-xs font-medium transition group"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>Open Student Portal</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              id="bridge-open-elibrary-from-lms-btn"
              onClick={() => navigateToPortal('ELIBRARY')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 text-xs font-medium transition group"
            >
              <div className="flex items-center gap-2">
                <Library className="w-3.5 h-3.5 text-amber-400" />
                <span>Open E-Library</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        )}

        {activePortalId === 'ELIBRARY' && (
          <div className="space-y-1.5">
            <button
              id="bridge-open-student-from-lib-btn"
              onClick={() => navigateToPortal('STUDENT')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 text-blue-300 text-xs font-medium transition group"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>Open Student Portal</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              id="bridge-open-lms-from-lib-btn"
              onClick={() => navigateToPortal('ELEARNING')}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 text-emerald-300 text-xs font-medium transition group"
            >
              <div className="flex items-center gap-2">
                <BookOpenCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open E-Learning</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        )}

        {activePortalId !== 'STUDENT' && activePortalId !== 'ELEARNING' && activePortalId !== 'ELIBRARY' && (
          <button
            onClick={() => navigateToPortal('ADMIN')}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition"
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
  );
}
