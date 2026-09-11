'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Layers,
  Bell,
  ChevronDown,
  LogOut,
  LogIn,
  User,
  Settings,
  HelpCircle,
  Menu,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export function CentralHeader() {
  const {
    currentUser,
    activePortalId,
    portals,
    navigateToPortal,
    notifications,
    institutionalSettings,
    toggleMobileSidebar,
    logout,
    openLoginModal,
    setActiveNavTab
  } = useERP();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setIsWorkspaceMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activePortal = portals.find(p => p.id === activePortalId) || portals[0];

  // Strictly filter portals assigned to THIS authenticated user
  const assignedPortals = portals.filter(portal =>
    currentUser.portalAssignments.some(a => a.portalId === portal.id)
  );

  // Filter notifications relevant to THIS user
  const userNotifications = notifications.filter(n => {
    if (n.targetUserId === currentUser.id || n.targetUserId === currentUser.identifier) return true;
    if (n.targetUserId === 'ALL') return true;
    return currentUser.portalAssignments.some(a => a.portalId === n.sourcePortal);
  });
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getPortalIcon = (id: PortalId) => {
    switch (id) {
      case 'STUDENT': return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'ELEARNING': return <BookOpenCheck className="w-4 h-4 text-emerald-500" />;
      case 'ELIBRARY': return <Library className="w-4 h-4 text-amber-500" />;
      case 'FINANCE': return <Receipt className="w-4 h-4 text-purple-500" />;
      case 'EXAMINATIONS': return <FileSpreadsheet className="w-4 h-4 text-rose-500" />;
      case 'HR': return <Users className="w-4 h-4 text-indigo-500" />;
      case 'ADMISSIONS': return <UserCheck className="w-4 h-4 text-teal-500" />;
      case 'HOSTEL': return <Building2 className="w-4 h-4 text-cyan-500" />;
      case 'ADMIN': return <ShieldAlert className="w-4 h-4 text-slate-700" />;
      default: return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  const getContextSubtitle = () => {
    if (activePortalId === 'STUDENT') {
      return currentUser.department || 'BSc Information Technology';
    }
    if (activePortalId === 'LECTURER') {
      return currentUser.department || 'School of Computing & Informatics';
    }
    if (activePortalId === 'FINANCE') {
      return 'Accounts & Revenue Management';
    }
    if (activePortalId === 'ADMISSIONS') {
      return 'Enrollment & Academic Registry';
    }
    if (activePortalId === 'ADMIN') {
      return 'Institutional Governance';
    }
    if (activePortalId === 'HR') {
      return 'Human Capital & Faculty Operations';
    }
    return activePortal.ownerDepartment || 'Academic Workspace';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Left: Mobile Toggle + Institution Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-nav-toggle-btn"
              onClick={toggleMobileSidebar}
              className="p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100 md:hidden cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              {institutionalSettings.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={institutionalSettings.logoUrl}
                  alt={institutionalSettings.name}
                  className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 border border-slate-200 shadow-xs shrink-0"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0"
                  style={{ backgroundColor: institutionalSettings.primaryColor || '#1e40af' }}
                >
                  {institutionalSettings.shortName?.slice(0, 2) || 'AP'}
                </div>
              )}
              <div className="min-w-0">
                <span className="font-bold text-sm tracking-tight text-slate-900 block truncate max-w-[150px] sm:max-w-xs">
                  {institutionalSettings.name || 'Apex Institute'}
                </span>
                <span className="text-[12px] text-slate-500 font-medium hidden sm:block">
                  Enterprise Academic System
                </span>
              </div>
            </div>
          </div>

          {/* Center: Contextual Workspace & Portal Indicator */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              <span className="font-semibold text-slate-800">{activePortal.name}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-medium">{getContextSubtitle()}</span>
            </div>
          </div>

          {/* Right: Workspaces (if multiple) + Help + Notifications + Profile */}
          <div className="flex items-center gap-2">

            {/* My Workspaces (only shown if user has more than 1 assigned portal) */}
            {assignedPortals.length > 1 && (
              <div className="relative" ref={workspaceRef}>
                <button
                  id="btn-my-workspaces"
                  onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 transition cursor-pointer"
                  title="Switch to another authorized workspace"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">My Workspaces</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isWorkspaceMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      Authorized Workspaces
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1 space-y-1">
                      {assignedPortals.map(portal => {
                        const isCurrent = portal.id === activePortalId;
                        return (
                          <button
                            key={portal.id}
                            id={`switch-workspace-${portal.id.toLowerCase()}`}
                            onClick={() => {
                              navigateToPortal(portal.id);
                              setIsWorkspaceMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition text-xs cursor-pointer ${
                              isCurrent
                                ? 'bg-blue-50 text-blue-800 font-semibold border border-blue-100'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="p-1 rounded-md bg-white border border-slate-200 shrink-0">
                              {getPortalIcon(portal.id)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="truncate block font-medium">{portal.name}</span>
                              <span className="text-[11px] text-slate-400 block truncate">
                                {portal.ownerDepartment || 'Workspace'}
                              </span>
                            </div>
                            {isCurrent && <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                id="notifications-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-50">
                  <div className="px-2 py-1 text-xs font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 ? (
                      <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {unreadCount} Unread
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">All Caught Up</span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto py-2 space-y-2">
                    {userNotifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500">
                        No recent notifications for your account.
                      </div>
                    ) : (
                      userNotifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-lg border text-xs transition ${
                            n.read
                              ? 'bg-slate-50 border-slate-100 text-slate-600'
                              : 'bg-blue-50/40 border-blue-100 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-500 shrink-0">
                              {n.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                          <div className="mt-2 text-[11px] text-slate-400 flex justify-between items-center">
                            <span>{n.timestamp}</span>
                            {n.actionLink && (
                              <button
                                onClick={() => {
                                  navigateToPortal(n.sourcePortal);
                                  setIsNotifOpen(false);
                                }}
                                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                              >
                                View in {n.sourcePortal} →
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Help Dialog Trigger */}
            <button
              id="help-btn"
              onClick={() => setIsHelpModalOpen(true)}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center hidden sm:flex"
              aria-label="Institutional Help"
              title="Help & Institutional Support"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* User Profile or Sign In */}
            {currentUser.id === 'usr_guest' || currentUser.identifier === 'GUEST' ? (
              <button
                id="header-sign-in-btn"
                onClick={() => openLoginModal()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Institutional Sign In</span>
              </button>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition cursor-pointer"
                  aria-label="Open User Account Menu"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden lg:block max-w-[130px]">
                    <div className="font-semibold text-slate-900 truncate text-xs leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {currentUser.identifier}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </button>

                {/* User Account Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-50">
                    {/* Authenticated Identity Information */}
                    <div className="px-2 py-2 border-b border-slate-100 mb-2">
                      <div className="font-bold text-slate-900 text-sm">{currentUser.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.identifier}</div>
                      <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                    </div>

                    {/* Standard User Actions */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveNavTab('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsHelpModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-500" />
                        <span>Help & Support</span>
                      </button>

                      <button
                        onClick={() => {
                          navigateToPortal('PUBLIC');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                        <span>Institutional Public Site</span>
                      </button>
                    </div>

                    {/* Sign Out Action */}
                    <div className="pt-2 border-t border-slate-100 mt-2">
                      <button
                        id="btn_header_sign_out"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 transition cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Institutional Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Institutional Support & Help
              </h3>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Welcome to the <strong className="text-slate-800">{institutionalSettings.name}</strong> Enterprise System.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-800">Support Desks:</div>
                <div>• Academic & Course Registrations: <span className="font-mono text-slate-700">academics@{institutionalSettings.shortName?.toLowerCase() || 'apex'}.edu</span></div>
                <div>• Bursary & Invoices: <span className="font-mono text-slate-700">bursary@{institutionalSettings.shortName?.toLowerCase() || 'apex'}.edu</span></div>
                <div>• ICT & Account Services: <span className="font-mono text-slate-700">support@{institutionalSettings.shortName?.toLowerCase() || 'apex'}.edu</span></div>
              </div>
              <p className="text-[11px] text-slate-500">
                Your role and workspace permissions are provisioned by Senate and the Registrar. For additional access privileges, submit a formal departmental request.
              </p>
            </div>
            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              Close Help
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
