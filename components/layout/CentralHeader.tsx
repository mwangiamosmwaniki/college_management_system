'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalId } from '@/types/erp';
import {
  ShieldAlert,
  GraduationCap,
  BookOpenCheck,
  Library,
  Receipt,
  FileSpreadsheet,
  Users,
  Building2,
  Bell,
  Activity,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  FileText,
  Sliders,
  Radio,
  Lock,
  Layers,
  Search,
  Check,
  Menu,
  ExternalLink,
  LogOut
} from 'lucide-react';

export function CentralHeader() {
  const {
    currentUser,
    users,
    openLoginModal,
    activePortalId,
    portals,
    navigateToPortal,
    roles,
    notifications,
    institutionalSettings,
    setIsSecuritySuiteOpen,
    setIsRoleBuilderOpen,
    setIsAuditDrawerOpen,
    setIsEventsModalOpen,
    setIsHealthModalOpen,
    setIsCrudLifecycleSuiteOpen,
    toggleMobileSidebar,
    logout
  } = useERP();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isPortalLauncherOpen, setIsPortalLauncherOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [portalSearch, setPortalSearch] = useState('');

  const activePortal = portals.find(p => p.id === activePortalId) || portals[0];
  const currentAssignment = currentUser.portalAssignments.find(a => a.portalId === activePortalId);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getPortalIcon = (id: PortalId) => {
    switch (id) {
      case 'STUDENT': return <GraduationCap className="w-4 h-4 text-blue-400" />;
      case 'ELEARNING': return <BookOpenCheck className="w-4 h-4 text-emerald-400" />;
      case 'ELIBRARY': return <Library className="w-4 h-4 text-amber-400" />;
      case 'FINANCE': return <Receipt className="w-4 h-4 text-purple-400" />;
      case 'EXAMINATIONS': return <FileSpreadsheet className="w-4 h-4 text-rose-400" />;
      case 'HR': return <Users className="w-4 h-4 text-indigo-400" />;
      case 'ADMISSIONS': return <UserCheck className="w-4 h-4 text-teal-400" />;
      case 'HOSTEL': return <Building2 className="w-4 h-4 text-cyan-400" />;
      case 'ADMIN': return <ShieldAlert className="w-4 h-4 text-slate-300" />;
      default: return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const isSuperAdmin = currentUser.portalAssignments.some(
    a => a.portalId === 'ADMIN' && (a.roleId === 'ROLE_SUPER_ADMIN' || a.isAdmin)
  );

  // Only show portals linked to the role of the signed in account
  const roleLinkedPortals = portals.filter(portal => {
    if (isSuperAdmin) return true;
    return currentUser.portalAssignments.some(a => a.portalId === portal.id);
  });

  const filteredPortals = roleLinkedPortals.filter(p =>
    !portalSearch ||
    p.name.toLowerCase().includes(portalSearch.toLowerCase()) ||
    p.code.toLowerCase().includes(portalSearch.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Global Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Mobile Navigation Toggle + Logo & Central Institutional Identity */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="mobile-nav-toggle-btn"
              onClick={toggleMobileSidebar}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:text-white md:hidden cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {institutionalSettings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={institutionalSettings.logoUrl}
                alt="Institutional Logo"
                className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 border border-slate-700 shadow-inner shrink-0"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-inner shrink-0"
                style={{ backgroundColor: institutionalSettings.primaryColor || '#2563eb' }}
              >
                {institutionalSettings.shortName?.slice(0, 2) || 'AP'}
              </div>
            )}
            <div className="min-w-0">
              <span className="font-bold text-sm tracking-tight text-white line-clamp-1 max-w-[130px] sm:max-w-xs">
                {institutionalSettings.name}
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Institutional Enterprise Portal
              </p>
            </div>
          </div>

          {/* Quick Portal Switcher Launcher & Public Bridge */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                id="portal-launcher-btn"
                onClick={() => setIsPortalLauncherOpen(!isPortalLauncherOpen)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 transition cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></div>
                <span className="truncate max-w-[90px] sm:max-w-[160px]">
                  Portal: <strong className="text-white font-semibold">{activePortal.name}</strong>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

            {/* Portal Dropdown Menu */}
            {isPortalLauncherOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in duration-100">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between font-mono">
                  <span>Linked Portals ({currentUser.name.split(' ')[0]})</span>
                  <span className="text-slate-500">{roleLinkedPortals.length} {roleLinkedPortals.length === 1 ? 'Module' : 'Modules'}</span>
                </div>

                {roleLinkedPortals.length > 3 && (
                  <div className="p-1.5">
                    <div className="relative mb-1">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={portalSearch}
                        onChange={(e) => setPortalSearch(e.target.value)}
                        placeholder="Filter my portals..."
                        className="w-full pl-8 pr-2.5 py-1 text-xs rounded bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div className="max-h-72 overflow-y-auto py-0.5 space-y-1">
                  {filteredPortals.length === 0 ? (
                    <div className="py-5 text-center text-xs text-slate-400 font-mono">
                      No linked portals found
                    </div>
                  ) : (
                    filteredPortals.map(portal => {
                      const isCurrent = portal.id === activePortalId;
                      const assignment = currentUser.portalAssignments.find(a => a.portalId === portal.id);
                      const roleDisplay = assignment ? assignment.roleName : 'Super Administrator';

                      return (
                        <button
                          key={portal.id}
                          id={`portal-btn-${portal.id.toLowerCase()}`}
                          onClick={() => {
                            navigateToPortal(portal.id);
                            setIsPortalLauncherOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg flex items-start gap-2.5 transition text-xs cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-600/20 border border-blue-500/40 text-blue-200'
                              : 'hover:bg-slate-800/80 text-slate-200'
                          }`}
                        >
                          <div className="p-1.5 rounded-md bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                            {getPortalIcon(portal.id)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-slate-100 truncate block">{portal.name}</span>
                            <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                              Role: {roleDisplay}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Public Site Bridge for quick navigation */}
          <button
            id="header-public-site-btn"
            onClick={() => navigateToPortal('PUBLIC')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
            title="Return to Public College Portal"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Public Site</span>
          </button>
        </div>

          {/* Action Center (Security Suite, Events, Audit, Health) */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Acceptance Test Suite Trigger */}
            <button
              id="security-suite-btn"
              onClick={() => setIsSecuritySuiteOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/25 text-xs font-semibold transition shadow-sm cursor-pointer"
              title="Execute Acceptance Tests A through O live"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">RBAC Tests</span>
            </button>

            {/* Cross-Portal Events Trigger */}
            <button
              id="events-modal-btn"
              onClick={() => setIsEventsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
              title="Inspect Cross-Portal Event Bus"
            >
              <Radio className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="hidden md:inline">Events</span>
            </button>

            {/* Audit Log Drawer Trigger */}
            <button
              id="audit-drawer-btn"
              onClick={() => setIsAuditDrawerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
              title="Open Real-time Audit Trail"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden md:inline">Audit</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="notifications-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition cursor-pointer"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center font-mono">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in duration-100">
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-300 border-b border-slate-800 flex items-center justify-between font-mono">
                    <span>Notifications</span>
                    <span className="text-[10px] text-blue-400">{unreadCount} Unread</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1 space-y-1.5">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg border text-xs ${
                          n.read ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-800/80 border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-100">{n.title}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-slate-950 border border-slate-800 text-blue-400">
                            {n.sourcePortal}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-300">{n.message}</p>
                        <div className="mt-1.5 text-[10px] text-slate-500 flex justify-between font-mono">
                          <span>{n.timestamp}</span>
                          {n.actionLink && (
                            <button
                              onClick={() => {
                                const targetPortal = n.sourcePortal;
                                navigateToPortal(targetPortal);
                                setIsNotifOpen(false);
                              }}
                              className="text-blue-400 hover:underline cursor-pointer"
                            >
                              Go to {n.sourcePortal} →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                id="persona-switcher-btn"
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs border border-blue-400/50 shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block max-w-[130px]">
                  <div className="font-semibold text-slate-100 truncate text-xs leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{currentUser.identifier}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Account & Security Session Menu */}
              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in duration-100">
                  <div className="px-2 py-1.5 border-b border-slate-800 mb-2">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Institutional Session</span>
                      <span className="px-1.5 py-0.2 text-[9px] rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Current Authenticated User Card */}
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 mb-2 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm border border-blue-400/50 shrink-0">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-100 text-xs truncate">{currentUser.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{currentUser.identifier}</div>
                        <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                      </div>
                    </div>

                    {/* Active Portal Roles */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] text-slate-400 mb-1 font-medium">Assigned Roles:</div>
                      <div className="flex flex-wrap gap-1">
                        {currentUser.portalAssignments.map(a => (
                          <span
                            key={a.portalId}
                            className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-blue-950/60 border border-blue-800/50 text-blue-300"
                          >
                            {a.roleName} ({a.portalId})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Security Session Info */}
                  <div className="px-2 py-1.5 bg-slate-950/40 rounded border border-slate-800/60 text-[10px] text-slate-400 space-y-1 mb-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Backend:</span>
                      <span className="text-slate-300">Spring Boot 3 + PostgreSQL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Protection:</span>
                      <span className="text-emerald-400">Server-Side RBAC + Tenant Isolation</span>
                    </div>
                  </div>

                  {/* Menu Actions */}
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <button
                      onClick={() => {
                        setIsPersonaMenuOpen(false);
                        openLoginModal();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-blue-300 hover:text-blue-200 hover:bg-blue-950/40 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Switch Account / Re-authenticate</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        navigateToPortal('PUBLIC');
                        setIsPersonaMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                        <span>Public College Portal</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">PUBLIC</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsPersonaMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out / Invalidate Session</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Secondary Context Banner: Portal Role and Scope */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-[11px] gap-2">
          <div className="flex items-center gap-2 text-slate-300 flex-wrap">
            <span className="font-medium text-slate-400">Context:</span>
            <span className="px-2 py-0.2 rounded bg-blue-950/70 border border-blue-800/60 text-blue-300 font-mono font-semibold">
              {activePortal.name}
            </span>
            <span className="text-slate-600">•</span>
            <span className="px-2 py-0.2 rounded bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-mono">
              Role: {currentAssignment ? currentAssignment.roleName : 'Super Admin'}
            </span>
            {currentAssignment?.isMonitor && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase font-mono">
                Monitor Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
            <span>{currentUser.department || 'Central Administration'}</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500">{currentUser.institution}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
