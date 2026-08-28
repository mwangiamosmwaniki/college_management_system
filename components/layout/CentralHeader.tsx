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
  XCircle,
  ExternalLink,
  ChevronDown,
  UserCheck,
  FileText,
  Sliders,
  Radio,
  Lock,
  Layers,
  Search,
  Database
} from 'lucide-react';

export function CentralHeader() {
  const {
    currentUser,
    users,
    switchUserPersona,
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
    setIsCrudLifecycleSuiteOpen
  } = useERP();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isPortalLauncherOpen, setIsPortalLauncherOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const activePortal = portals.find(p => p.id === activePortalId) || portals[0];
  const currentAssignment = currentUser.portalAssignments.find(a => a.portalId === activePortalId);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getPortalIcon = (id: PortalId) => {
    switch (id) {
      case 'STUDENT': return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'ELEARNING': return <BookOpenCheck className="w-4 h-4 text-emerald-600" />;
      case 'ELIBRARY': return <Library className="w-4 h-4 text-amber-600" />;
      case 'FINANCE': return <Receipt className="w-4 h-4 text-purple-600" />;
      case 'EXAMINATIONS': return <FileSpreadsheet className="w-4 h-4 text-rose-600" />;
      case 'HR': return <Users className="w-4 h-4 text-indigo-600" />;
      case 'ADMISSIONS': return <UserCheck className="w-4 h-4 text-teal-600" />;
      case 'HOSTEL': return <Building2 className="w-4 h-4 text-cyan-600" />;
      case 'ADMIN': return <ShieldAlert className="w-4 h-4 text-slate-700" />;
      default: return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Global Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Central Identity Platform */}
          <div className="flex items-center gap-3">
            {institutionalSettings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={institutionalSettings.logoUrl}
                alt="Institutional Logo"
                className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 border border-slate-700 shadow-inner"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-inner"
                style={{ backgroundColor: institutionalSettings.primaryColor || '#2563eb' }}
              >
                {institutionalSettings.shortName?.slice(0, 2) || 'AP'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-white line-clamp-1 max-w-[200px] sm:max-w-xs">
                  {institutionalSettings.name}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                  {institutionalSettings.shortName || 'ERP'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <span>SSO Central Identity</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Contextual RBAC
                </span>
              </p>
            </div>
          </div>

          {/* Quick Portal Switcher Launcher */}
          <div className="relative">
            <button
              id="portal-launcher-btn"
              onClick={() => setIsPortalLauncherOpen(!isPortalLauncherOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span>Portal: <strong className="text-white font-semibold">{activePortal.name}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Portal Dropdown Menu */}
            {isPortalLauncherOpen && (
              <div className="absolute left-0 mt-2 w-80 rounded-xl bg-slate-800/95 backdrop-blur-md border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 flex items-center justify-between">
                  <span>Available Institutional Portals</span>
                  <span className="text-slate-500">SSO Router</span>
                </div>
                <div className="max-h-80 overflow-y-auto py-1 space-y-1">
                  {portals.map(portal => {
                    const isAssigned = currentUser.portalAssignments.some(a => a.portalId === portal.id) || 
                      currentUser.portalAssignments.some(a => a.portalId === 'ADMIN');
                    const isCurrent = portal.id === activePortalId;
                    const assignment = currentUser.portalAssignments.find(a => a.portalId === portal.id);

                    return (
                      <button
                        key={portal.id}
                        onClick={() => {
                          navigateToPortal(portal.id);
                          setIsPortalLauncherOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-start gap-2.5 transition text-xs ${
                          isCurrent
                            ? 'bg-blue-600/20 border border-blue-500/40 text-blue-200'
                            : isAssigned
                            ? 'hover:bg-slate-700/60 text-slate-200'
                            : 'opacity-50 hover:bg-slate-700/30 text-slate-400'
                        }`}
                      >
                        <div className="p-1.5 rounded-md bg-slate-900 border border-slate-700 shrink-0 mt-0.5">
                          {getPortalIcon(portal.id)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-100 truncate">{portal.name}</span>
                            {!isAssigned && (
                              <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20">
                                <Lock className="w-2.5 h-2.5" /> No Role
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">
                            {isAssigned ? (
                              <span className="text-emerald-400">Role: {assignment ? assignment.roleName : 'Super Admin'}</span>
                            ) : (
                              portal.description
                            )}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Center (Security Suite, Events, Audit, Health) */}
          <div className="flex items-center gap-2">

            {/* Acceptance Test Suite Trigger */}
            <button
              id="security-suite-btn"
              onClick={() => setIsSecuritySuiteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold transition shadow-sm"
              title="Execute Acceptance Tests A through O live against active RBAC"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>RBAC Tests</span>
            </button>

            {/* Cross-Portal Events Trigger */}
            <button
              id="events-modal-btn"
              onClick={() => setIsEventsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition"
              title="Inspect Cross-Portal Event Bus synchronization"
            >
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Event Bus</span>
            </button>

            {/* Audit Log Drawer Trigger */}
            <button
              id="audit-drawer-btn"
              onClick={() => setIsAuditDrawerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition"
              title="Open Real-time Audit Trail"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Audit Log</span>
            </button>

            {/* Portal Health Trigger */}
            <button
              id="health-modal-btn"
              onClick={() => setIsHealthModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition"
              title="View Portal Health and Telemetry"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Health</span>
            </button>

            {/* Visual Role Matrix Builder */}
            <button
              id="role-builder-btn"
              onClick={() => setIsRoleBuilderOpen(true)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
              title="Custom Portal Role & Permission Matrix"
            >
              <Sliders className="w-4 h-4 text-slate-300" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="notifications-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in duration-100">
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-300 border-b border-slate-700 flex items-center justify-between">
                    <span>Portal Notifications</span>
                    <span className="text-[10px] text-blue-400">Scoped per domain</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1 space-y-1.5">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-2 rounded-lg border text-xs ${
                          n.read ? 'bg-slate-800/40 border-slate-700/60 text-slate-400' : 'bg-slate-700/60 border-slate-600 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-100">{n.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase bg-slate-900 border border-slate-700 text-blue-400">
                            {n.sourcePortal}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-300">{n.message}</p>
                        <div className="mt-1 text-[10px] text-slate-500 flex justify-between">
                          <span>{n.timestamp}</span>
                          {n.actionLink && (
                            <button
                              onClick={() => {
                                const targetPortal = n.sourcePortal;
                                navigateToPortal(targetPortal);
                                setIsNotifOpen(false);
                              }}
                              className="text-blue-400 hover:underline flex items-center gap-0.5"
                            >
                              Go to {n.sourcePortal} <ExternalLink className="w-2.5 h-2.5" />
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
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs border border-blue-400/50">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="font-semibold text-slate-100 leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{currentUser.identifier}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Persona Selection Dropdown */}
              {isPersonaMenuOpen && (
                <div className="absolute right-0 mt-2 w-96 rounded-xl bg-slate-800/95 backdrop-blur-md border border-slate-700 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1.5 border-b border-slate-700/60 mb-2">
                    <div className="text-xs font-bold text-white">Switch Active Persona</div>
                    <p className="text-[11px] text-slate-400">
                      Demonstrates contextual role separation across Student, LMS, Library, Finance & Exams.
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto space-y-1.5">
                    {users.map(u => {
                      const isSelected = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUserPersona(u.id);
                            setIsPersonaMenuOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500/50 text-white'
                              : 'bg-slate-900/40 border-slate-700/70 hover:bg-slate-700/50 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                                {u.identifier}
                              </span>
                            </div>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                Active Persona
                              </span>
                            )}
                          </div>
                          
                          {/* List Portal Assignments for this user */}
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {u.portalAssignments.map(a => (
                              <span
                                key={a.portalId}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-mono flex items-center gap-1 border ${
                                  a.isMonitor
                                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                    : a.isAdmin
                                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}
                              >
                                <span>{a.portalId}:</span>
                                <span className="font-medium text-slate-200">{a.roleName}</span>
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Secondary Context Banner: Shows exact active portal context & authorization */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-[11px] gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-medium text-slate-400">Active Session:</span>
            <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/60 text-blue-300 font-mono font-semibold">
              Portal: {activePortal.name} ({activePortal.id})
            </span>
            <span className="text-slate-600">•</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 font-mono">
              Contextual Role: {currentAssignment ? currentAssignment.roleName : 'Super Admin Override'}
            </span>
            {currentAssignment?.isMonitor && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider">
                Monitor Mode (Read-Only)
              </span>
            )}
            {currentAssignment?.scope?.courseIds && (
              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono">
                Course Scope: [{currentAssignment.scope.courseIds.join(', ')}]
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="font-mono text-[10px] text-slate-500">{currentUser.institution}</span>
            <span className="text-slate-700">|</span>
            <span className="font-mono text-[10px] text-slate-500">Dept: {currentUser.department}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
