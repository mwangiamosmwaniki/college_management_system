'use client';

import React from 'react';
import { useERP } from '@/context/erp-context';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileCheck,
  CreditCard,
  FileText,
  HelpCircle,
  FolderOpen,
  User,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Building2,
  Receipt,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Library,
  Briefcase,
  Layers,
  GraduationCap
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
  badge?: string;
}

export function PortalNavigation() {
  const {
    activePortalId,
    activeNavTab,
    setActiveNavTab,
    portals,
    currentUser,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isSidebarCollapsed,
    toggleSidebarCollapse
  } = useERP();

  const activePortal = portals.find(p => p.id === activePortalId) || portals[0];
  const assignment = currentUser.portalAssignments.find(a => a.portalId === activePortalId);

  // Define strictly structured, user-oriented navigation items based on institutional role
  const getNavItems = (): NavItem[] => {
    switch (activePortalId) {
      case 'STUDENT':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, section: 'General' },
          { id: 'courses', label: 'My Courses', icon: <BookOpen className="w-4 h-4" />, section: 'My Academics' },
          { id: 'registration', label: 'Course Registration', icon: <FileCheck className="w-4 h-4" />, section: 'My Academics' },
          { id: 'results', label: 'Academic Results', icon: <Award className="w-4 h-4" />, section: 'My Academics' },
          { id: 'fees', label: 'Fees & Invoices', icon: <CreditCard className="w-4 h-4" />, section: 'Finance' },
          { id: 'clearance', label: 'Clearance Status', icon: <CheckCircle2 className="w-4 h-4" />, section: 'Finance' },
          { id: 'requests', label: 'Formal Requests', icon: <HelpCircle className="w-4 h-4" />, section: 'Services' },
          { id: 'documents', label: 'Official Documents', icon: <FolderOpen className="w-4 h-4" />, section: 'Services' },
          { id: 'profile', label: 'My Student Profile', icon: <User className="w-4 h-4" />, section: 'Account' }
        ];

      case 'LECTURER':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, section: 'General' },
          { id: 'courses', label: 'My Courses & Classes', icon: <BookOpen className="w-4 h-4" />, section: 'Teaching' },
          { id: 'attendance', label: 'Class Attendance', icon: <Clock className="w-4 h-4" />, section: 'Teaching' },
          { id: 'assignments', label: 'Assignments', icon: <FileText className="w-4 h-4" />, section: 'Assessment' },
          { id: 'gradebook', label: 'Semester Gradebook', icon: <Award className="w-4 h-4" />, section: 'Assessment' },
          { id: 'cbt_tests', label: 'Exams & Quizzes', icon: <FileSpreadsheet className="w-4 h-4" />, section: 'Assessment' },
          { id: 'advising', label: 'Student Advising', icon: <Users className="w-4 h-4" />, section: 'Students' },
          { id: 'supervision', label: 'Project Supervision', icon: <GraduationCap className="w-4 h-4" />, section: 'Students' },
          { id: 'research', label: 'Research & Publications', icon: <Briefcase className="w-4 h-4" />, section: 'Academic' },
          { id: 'workload', label: 'Faculty Requests', icon: <Layers className="w-4 h-4" />, section: 'Academic' },
          { id: 'profile', label: 'Faculty Profile', icon: <User className="w-4 h-4" />, section: 'Account' }
        ];

      case 'FINANCE':
        return [
          { id: 'dashboard', label: 'Financial Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'General' },
          { id: 'payments', label: 'Payment Transactions', icon: <Receipt className="w-4 h-4" />, section: 'Finance' },
          { id: 'workflow', label: 'Invoices & Billing', icon: <FileText className="w-4 h-4" />, section: 'Finance' },
          { id: 'fee_structures', label: 'Fee Schedules', icon: <CreditCard className="w-4 h-4" />, section: 'Finance' },
          { id: 'reconciliation', label: 'Bank Reconciliation', icon: <CheckCircle2 className="w-4 h-4" />, section: 'Finance' },
          { id: 'profile', label: 'Finance Profile', icon: <User className="w-4 h-4" />, section: 'Account' }
        ];

      case 'ADMISSIONS':
        return [
          { id: 'dashboard', label: 'Admissions Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'General' },
          { id: 'applications', label: 'Candidate Applications', icon: <Users className="w-4 h-4" />, section: 'Applications' },
          { id: 'scrutiny', label: 'Document Verification', icon: <FileCheck className="w-4 h-4" />, section: 'Applications' },
          { id: 'offers', label: 'Offer Letters', icon: <FileText className="w-4 h-4" />, section: 'Applications' },
          { id: 'profile', label: 'Admissions Profile', icon: <User className="w-4 h-4" />, section: 'Account' }
        ];

      case 'HR':
        return [
          { id: 'dashboard', label: 'HR Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, section: 'General' },
          { id: 'staff', label: 'Faculty & Staff', icon: <Users className="w-4 h-4" />, section: 'People' },
          { id: 'leaves', label: 'Leave Applications', icon: <Calendar className="w-4 h-4" />, section: 'Leave' },
          { id: 'payroll', label: 'Payroll Registers', icon: <Receipt className="w-4 h-4" />, section: 'Payroll' },
          { id: 'profile', label: 'Staff Profile', icon: <User className="w-4 h-4" />, section: 'Account' }
        ];

      case 'ELEARNING':
        return [
          { id: 'dashboard', label: 'Course Catalog', icon: <BookOpen className="w-4 h-4" />, section: 'Academics' },
          { id: 'modules', label: 'Weekly Modules', icon: <Layers className="w-4 h-4" />, section: 'Learning' },
          { id: 'discussions', label: 'Class Discussions', icon: <Users className="w-4 h-4" />, section: 'Learning' },
          { id: 'profile', label: 'Learning Profile', icon: <User className="w-4 h-4" />, section: 'Account' }
        ];

      case 'ELIBRARY':
        return [
          { id: 'dashboard', label: 'Catalog Search', icon: <Library className="w-4 h-4" />, section: 'Collection' },
          { id: 'loans', label: 'Active Loans', icon: <BookOpen className="w-4 h-4" />, section: 'Services' },
          { id: 'digital', label: 'Digital Journals', icon: <FolderOpen className="w-4 h-4" />, section: 'Services' },
          { id: 'profile', label: 'Patron Account', icon: <User className="w-4 h-4" />, section: 'Account' }
        ];

      case 'EXAMINATIONS':
        return [
          { id: 'dashboard', label: 'Senate Moderation', icon: <Award className="w-4 h-4" />, section: 'Examinations' },
          { id: 'moderation', label: 'Marks Verification', icon: <CheckCircle2 className="w-4 h-4" />, section: 'Examinations' },
          { id: 'gazette', label: 'Graduation Gazette', icon: <FileSpreadsheet className="w-4 h-4" />, section: 'Examinations' },
          { id: 'profile', label: 'Examiner Profile', icon: <User className="w-4 h-4" />, section: 'Account' }
        ];

      case 'HOSTEL':
        return [
          { id: 'dashboard', label: 'Halls of Residence', icon: <Building2 className="w-4 h-4" />, section: 'Accommodation' },
          { id: 'allocation', label: 'Bed Allocation', icon: <Users className="w-4 h-4" />, section: 'Accommodation' },
          { id: 'maintenance', label: 'Maintenance Requests', icon: <HelpCircle className="w-4 h-4" />, section: 'Services' },
          { id: 'profile', label: 'Warden Profile', icon: <User className="w-4 h-4" />, section: 'Account' }
        ];

      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'System Overview', icon: <LayoutDashboard className="w-4 h-4" />, section: 'General' },
          { id: 'users', label: 'Users & Roles', icon: <Users className="w-4 h-4" />, section: 'Identity' },
          { id: 'rbac_matrix', label: 'Access Permissions', icon: <Settings className="w-4 h-4" />, section: 'Identity' },
          { id: 'institutional_settings', label: 'Institution Profile', icon: <Building2 className="w-4 h-4" />, section: 'Organization' },
          { id: 'settings', label: 'Academic Structure', icon: <Layers className="w-4 h-4" />, section: 'Organization' },
          { id: 'audit', label: 'Audit Trail', icon: <FileText className="w-4 h-4" />, section: 'Governance' },
          { id: 'profile', label: 'Administrator Profile', icon: <User className="w-4 h-4" />, section: 'Account' }
        ];

      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, section: 'General' },
          { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" />, section: 'Account' }
        ];
    }
  };

  const navItems = getNavItems();
  const sections = Array.from(new Set(navItems.map(item => item.section || 'General')));

  return (
    <>
      {/* 1. Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 2. Mobile Drawer Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col justify-between text-slate-700 shadow-2xl transition-transform duration-200 md:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600 block">
              {activePortal.name}
            </span>
            <h2 className="text-xs text-slate-500 truncate mt-0.5">
              {assignment ? assignment.roleName : 'Standard Role'}
            </h2>
          </div>

          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Scrollable Nav List */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {sections.map(section => {
            const sectionItems = navItems.filter(i => (i.section || 'General') === section);
            return (
              <div key={section} className="space-y-1">
                {section !== 'General' && (
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                    {section}
                  </div>
                )}
                {sectionItems.map(item => {
                  const isActive = activeNavTab === item.id || 
                    (item.id === 'settings' && (activeNavTab === 'school_settings')) ||
                    (item.id === 'institutional_settings' && activeNavTab === 'settings');

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveNavTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer min-h-[42px] ${
                        isActive
                          ? 'bg-blue-50 text-blue-800 font-semibold border-l-3 border-blue-600'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* 3. Desktop Sidebar (Responsive Collapsible) */}
      <aside
        className={`bg-white border-r border-slate-200 hidden md:flex flex-col justify-between shrink-0 text-slate-700 shadow-xs transition-all duration-200 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Desktop Sidebar Header / Title */}
        <div className={`p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}>
          {!isSidebarCollapsed ? (
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600 block truncate">
                {activePortal.name}
              </span>
              <span className="text-xs text-slate-500 truncate block mt-0.5">
                {assignment ? assignment.roleName : 'Standard Access'}
              </span>
            </div>
          ) : (
            <span className="text-xs font-bold text-blue-600" title={activePortal.name}>
              {activePortal.code.slice(0, 3)}
            </span>
          )}

          <button
            id="btn-collapse-sidebar"
            onClick={toggleSidebarCollapse}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer ml-1"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Desktop Scrollable Nav List */}
        <nav className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto">
          {sections.map(section => {
            const sectionItems = navItems.filter(i => (i.section || 'General') === section);
            return (
              <div key={section} className="space-y-1">
                {!isSidebarCollapsed && section !== 'General' && (
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                    {section}
                  </div>
                )}
                {isSidebarCollapsed && section !== 'General' && (
                  <div className="my-2 border-t border-slate-100" />
                )}
                {sectionItems.map(item => {
                  const isActive = activeNavTab === item.id || 
                    (item.id === 'settings' && (activeNavTab === 'school_settings')) ||
                    (item.id === 'institutional_settings' && activeNavTab === 'settings');

                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => setActiveNavTab(item.id)}
                      title={item.label}
                      className={`w-full flex items-center rounded-lg text-xs font-medium transition cursor-pointer ${
                        isSidebarCollapsed
                          ? 'justify-center p-2.5 min-h-[40px]'
                          : 'px-3 py-2 min-h-[38px] justify-between'
                      } ${
                        isActive
                          ? 'bg-blue-50 text-blue-800 font-semibold border-l-3 border-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className={`flex items-center min-w-0 ${isSidebarCollapsed ? '' : 'gap-2.5'}`}>
                        <span className={isActive ? 'text-blue-600 shrink-0' : 'text-slate-500 shrink-0'}>
                          {item.icon}
                        </span>
                        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Desktop Sidebar Footer */}
        <div className={`p-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-400 ${isSidebarCollapsed ? 'text-center' : 'flex items-center justify-between'}`}>
          {!isSidebarCollapsed ? (
            <>
              <span className="truncate">Apex ERP System</span>
              <span className="font-mono">v3.2</span>
            </>
          ) : (
            <span className="font-mono text-[10px]">ERP</span>
          )}
        </div>
      </aside>
    </>
  );
}
