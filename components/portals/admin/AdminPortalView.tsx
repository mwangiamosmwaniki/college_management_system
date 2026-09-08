'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalDataLifecycleManager } from '@/components/common/PortalDataLifecycleManager';
import { InstitutionalSettingsManager } from '@/components/portals/admin/InstitutionalSettingsManager';
import {
  ShieldAlert,
  Users,
  Sliders,
  Radio,
  FileText,
  Activity,
  UserCheck,
  UserX,
  Plus,
  CheckCircle2,
  Trash2,
  Lock,
  Layers,
  Sparkles,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Server,
  Globe,
  RefreshCw,
  Eye,
  Key,
  Building2,
  Briefcase,
  SlidersHorizontal,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  UserCog
} from 'lucide-react';

export function AdminPortalView() {
  const {
    currentUser,
    activeNavTab,
    setActiveNavTab,
    users,
    roles,
    portals,
    auditLogs,
    events,
    institutionalSettings,
    setIsSecuritySuiteOpen,
    setIsRoleBuilderOpen,
    setIsEventsModalOpen,
    setIsAuditDrawerOpen,
    setIsHealthModalOpen,
    revokePortalRole,
    assignPortalRole,
    updateUserStatus,
    openInstitutionalDocument
  } = useERP();

  // Exclude students from central staff assignment (students have immutable roles until graduation)
  const staffUsers = users.filter(u => !u.identifier.startsWith('STU-') && !u.portalAssignments.every(a => a.roleId === 'ROLE_STUDENT'));

  const [selectedUserId, setSelectedUserId] = useState(staffUsers[0]?.id || users[0]?.id || '');
  const [selectedPortalToAssign, setSelectedPortalToAssign] = useState(portals[0]?.id || 'ADMIN');
  const [selectedRoleToAssign, setSelectedRoleToAssign] = useState(roles[0]?.id || '');
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);
  
  // Filters for staff directory
  const [staffSearch, setStaffSearch] = useState('');
  const [staffDeptFilter, setStaffDeptFilter] = useState('ALL');
  const [staffPortalFilter, setStaffPortalFilter] = useState('ALL');
  const [staffPrivilegeFilter, setStaffPrivilegeFilter] = useState<'ALL' | 'ADMIN' | 'MONITOR' | 'REGULAR'>('ALL');
  const [staffStatusFilter, setStaffStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED' | 'ON_LEAVE'>('ALL');

  // Audit filters
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilterPortal, setAuditFilterPortal] = useState('ALL');

  // Filtered staff list
  const filteredStaffUsers = staffUsers.filter(u => {
    const query = staffSearch.toLowerCase();
    const matchesSearch = !staffSearch ||
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.identifier.toLowerCase().includes(query) ||
      u.portalAssignments.some(a => a.roleName.toLowerCase().includes(query)) ||
      (u.department && u.department.toLowerCase().includes(query));

    const matchesDept = staffDeptFilter === 'ALL' || u.department === staffDeptFilter;
    const matchesPortal = staffPortalFilter === 'ALL' || u.portalAssignments.some(a => a.portalId === staffPortalFilter);
    
    const isUserAdmin = u.portalAssignments.some(a => a.isAdmin);
    const isUserMonitor = u.portalAssignments.some(a => a.isMonitor);

    let matchesPrivilege = true;
    if (staffPrivilegeFilter === 'ADMIN') matchesPrivilege = isUserAdmin;
    else if (staffPrivilegeFilter === 'MONITOR') matchesPrivilege = isUserMonitor;
    else if (staffPrivilegeFilter === 'REGULAR') matchesPrivilege = !isUserAdmin && !isUserMonitor;

    const userStatus = u.status || 'ACTIVE';
    const matchesStatus = staffStatusFilter === 'ALL' || userStatus === staffStatusFilter;

    return matchesSearch && matchesDept && matchesPortal && matchesPrivilege && matchesStatus;
  });

  const targetUser = staffUsers.find(u => u.id === selectedUserId) || filteredStaffUsers[0] || staffUsers[0];
  const availableRolesForPortal = roles.filter(r => r.portalId === selectedPortalToAssign);

  // Extract unique departments for filter dropdown
  const uniqueDepartments = Array.from(new Set(staffUsers.map(u => u.department).filter(Boolean)));

  const handleAssignRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleToAssign || !targetUser) return;
    const roleDef = roles.find(r => r.id === selectedRoleToAssign);
    if (!roleDef) return;

    assignPortalRole(
      targetUser.id,
      selectedPortalToAssign,
      roleDef.id,
      roleDef.name,
      roleDef.isMonitor,
      roleDef.isAdmin
    );

    setAssignSuccess(`Assigned ${roleDef.name} on ${selectedPortalToAssign} Portal to ${targetUser.name}!`);
    setTimeout(() => setAssignSuccess(null), 3500);
  };

  const handleGenerateAppointmentMemo = (user: typeof targetUser) => {
    if (!user) return;

    const activeAssignmentsSummary = user.portalAssignments.map(a => 
      `• ${a.portalId} Portal: ${a.roleName} ${a.isAdmin ? '(Super Administrator)' : a.isMonitor ? '(Audit Monitor)' : '(Authorized Operator)'}`
    ).join('\n');

    openInstitutionalDocument({
      docType: 'ADMISSION_LETTER',
      docNumber: `APPT-${user.identifier}-${new Date().getFullYear()}`,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      title: 'OFFICIAL ADMINISTRATIVE APPOINTMENT & ROLE DELEGATION MEMORANDUM',
      subtitle: 'CENTRAL GOVERNANCE & RBAC AUTHORIZATION MANDATE',
      recipientName: user.name,
      recipientIdentifier: user.identifier,
      recipientDepartment: user.department || 'Central Administration',
      recipientFaculty: user.faculty || 'University Directorate',
      recipientProgram: user.portalAssignments[0]?.roleName || 'University Faculty / Staff',
      recipientLevel: `Status: ${user.status || 'ACTIVE'}`,
      issuingAuthority: 'Office of the Vice Chancellor & Central Security Council',
      docVerificationCode: `RBAC-AUTH-${user.id.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      contentBody: `Dear ${user.name},\n\nIn accordance with institutional governance directives and university statutory powers, you have been designated and confirmed in the authorized portal domain roles outlined below.\n\nYou are empowered to exercise the full administrative, operational, and auditing capabilities granted by your delegated role templates while upholding utmost confidentiality, data integrity, and compliance with institutional standards.\n\nACTIVE PORTAL DOMAIN DELEGATIONS:\n${activeAssignmentsSummary || 'No active portal domains assigned.'}`,
      tableData: {
        headers: ['Portal Domain', 'Assigned Role Template', 'Privilege Scope', 'Security Clearance'],
        rows: user.portalAssignments.length > 0 
          ? user.portalAssignments.map((a, i) => [
              a.portalId,
              a.roleName,
              a.isAdmin ? 'Full Administrative Right' : a.isMonitor ? 'Read-Only Audit Scope' : 'Operational Scope',
              'LEVEL-4 VERIFIED'
            ])
          : [['No Active Domains', 'Unassigned', 'None', 'REVOKED']],
        summaryRow: ['TOTAL', `${user.portalAssignments.length} Domain Bindings`, 'Status: OPERATIONAL', 'MANDATE ACTIVE']
      },
      metadata: {
        staffDesignation: user.portalAssignments[0]?.roleName || 'Staff Member',
        securityOfficer: 'Prof. Walter Sterling (University Registrar)',
        auditClassification: 'Confidential Internal Memo',
        governanceStandard: 'Institutional RBAC Policy'
      }
    });
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesQuery = log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesPortal = auditFilterPortal === 'ALL' || log.portalId === auditFilterPortal;
    return matchesQuery && matchesPortal;
  });

  return (
    <div className="space-y-6">
      
      {/* Super Admin Console Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-purple-950/60 border border-blue-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Security & Administration
          </h1>
        </div>

        {/* Action quick links */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsSecuritySuiteOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Security Suite (A–O)</span>
          </button>

          <button
            onClick={() => setIsRoleBuilderOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
          >
            <Sliders className="w-4 h-4" />
            <span>Role Builder</span>
          </button>
        </div>
      </div>

      {assignSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{assignSuccess}</span>
        </div>
      )}

      {/* ============================================================= */}
      {/* 1. DASHBOARD OVERVIEW */}
      {/* ============================================================= */}
      {(activeNavTab === 'dashboard' || !activeNavTab) && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Micro-Portals</span>
              <div className="text-white text-xl font-bold">{portals.length} Isolated</div>
              <span className="text-emerald-400 text-[10px]">100% Operational</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Registered Users</span>
              <div className="text-blue-400 text-xl font-bold">{users.length} Users</div>
              <span className="text-slate-400 text-[10px]">Multi-Tenant RBAC</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Event Bus Telemetry</span>
              <div className="text-purple-400 text-xl font-bold">{events.length} Events</div>
              <span className="text-emerald-400 text-[10px]">Sync OK</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Compliance Tests</span>
              <div className="text-emerald-400 text-xl font-bold">15/15 Passed</div>
              <span className="text-emerald-400 text-[10px]">A-O Invariants Passing</span>
            </div>
          </div>

          {/* Quick System Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveNavTab('settings')}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition text-left space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm group-hover:text-amber-400 transition">
                  School Settings & Details
                </span>
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Manage campuses, departments, terms & institutional profiles
              </div>
            </button>

            <button
              onClick={() => setIsSecuritySuiteOpen(true)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition text-left space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                  Security Suite (A–O)
                </span>
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Automated regression & isolation verification
              </div>
            </button>

            <button
              onClick={() => setIsRoleBuilderOpen(true)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition text-left space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm group-hover:text-purple-400 transition">
                  Role Builder
                </span>
                <Sliders className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Granular capability definitions & assignments
              </div>
            </button>

            <button
              onClick={() => setIsEventsModalOpen(true)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition text-left space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm group-hover:text-blue-400 transition">
                  Cross-Portal Event Bus
                </span>
                <Radio className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Real-time pub/sub telemetry streams
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 1.4. INSTITUTIONAL & SCHOOL SETTINGS MANAGER (FULL CRUD) */}
      {/* ============================================================= */}
      {(activeNavTab === 'settings' || activeNavTab === 'institutional_settings' || activeNavTab === 'school_settings') && (
        <InstitutionalSettingsManager />
      )}

      {/* ============================================================= */}
      {/* 1.5. DATA GOVERNANCE & MASTER LIFECYCLE (ADMIN CRUD) */}
      {/* ============================================================= */}
      {activeNavTab === 'data_governance' && (
        <PortalDataLifecycleManager
          portalId="ADMIN"
          allowedEntityTypes={[
            'COURSE',
            'STUDENT',
            'LECTURER',
            'ASSIGNMENT',
            'QUESTION_BANK',
            'EXAM_RESULT',
            'GRADE_CHANGE_REQUEST',
            'LIBRARY_BOOK',
            'INVOICE',
            'RESEARCH_PROJECT',
            'ACADEMIC_YEAR'
          ]}
          title="Master Data & Record Governance"
        />
      )}

      {/* ============================================================= */}
      {/* 2. PORTAL REGISTRY & STATUS */}
      {/* ============================================================= */}
      {activeNavTab === 'portals' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400" />
                Portal Registry & Status
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {portals.map(portal => (
                <div
                  key={portal.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{portal.name}</span>
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ONLINE
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{portal.description}</p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span>ID: {portal.id}</span>
                    <span className="text-blue-400">Domain Isolated</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 3. VISUAL RBAC MATRIX & ROLES */}
      {/* ============================================================= */}
      {activeNavTab === 'rbac_matrix' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Role Definitions & Permissions
              </h2>

              <button
                onClick={() => setIsRoleBuilderOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Role</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-950/60 border-y border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Role ID & Name</th>
                    <th className="py-3 px-4">Target Domain</th>
                    <th className="py-3 px-4">Admin Right</th>
                    <th className="py-3 px-4">Monitor Role</th>
                    <th className="py-3 px-4">Capabilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {roles.map(r => (
                    <tr key={r.id} className="hover:bg-slate-850">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white font-sans">{r.name}</div>
                        <div className="text-[10px] text-slate-500">{r.id}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-400">{r.portalId}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          r.isAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {r.isAdmin ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          r.isMonitor ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {r.isMonitor ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(r.permissions || {}).slice(0, 3).map((resKey, i) => (
                            <span key={i} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                              {resKey}
                            </span>
                          ))}
                          {Object.keys(r.permissions || {}).length > 3 && (
                            <span className="text-[10px] font-mono text-slate-400">
                              +{Object.keys(r.permissions || {}).length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 4. INSTITUTIONAL BRANDING, LOGO & LETTERHEAD SETTINGS */}
      {/* ============================================================= */}
      {activeNavTab === 'institutional_settings' && (
        <div className="animate-in fade-in duration-150">
          <InstitutionalSettingsManager />
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. CENTRAL STAFF & USER ASSIGNMENT MANAGER (STUDENTS REMOVED) */}
      {/* ============================================================= */}
      {(activeNavTab === 'users' || !activeNavTab) && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Header & Metric Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-400 font-sans text-xs">Total Staff Accounts</div>
              <div className="text-xl font-bold text-white font-mono">{staffUsers.length} Staff</div>
              <div className="text-[11px] text-slate-500 font-sans">Students managed in Registry</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-400 font-sans text-xs">Super Administrators</div>
              <div className="text-xl font-bold text-purple-400 font-mono">
                {staffUsers.filter(u => u.portalAssignments.some(a => a.isAdmin)).length}
              </div>
              <div className="text-[11px] text-purple-400/80 font-sans">Full governance rights</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-400 font-sans text-xs">Audit & Monitors</div>
              <div className="text-xl font-bold text-amber-400 font-mono">
                {staffUsers.filter(u => u.portalAssignments.some(a => a.isMonitor)).length}
              </div>
              <div className="text-[11px] text-amber-400/80 font-sans">Read-only oversight</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-400 font-sans text-xs">Academic & Admin Depts</div>
              <div className="text-xl font-bold text-emerald-400 font-mono">{uniqueDepartments.length} Depts</div>
              <div className="text-[11px] text-emerald-400/80 font-sans">Multi-domain coverage</div>
            </div>
          </div>

          {/* Search & Comprehensive Filters Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">Staff RBAC Management Filters</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({filteredStaffUsers.length} of {staffUsers.length} staff displayed)
                </span>
              </div>

              {(staffSearch || staffDeptFilter !== 'ALL' || staffPortalFilter !== 'ALL' || staffPrivilegeFilter !== 'ALL' || staffStatusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setStaffSearch('');
                    setStaffDeptFilter('ALL');
                    setStaffPortalFilter('ALL');
                    setStaffPrivilegeFilter('ALL');
                    setStaffStatusFilter('ALL');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search staff name, ID, email..."
                  value={staffSearch}
                  onChange={e => setStaffSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Department Filter */}
              <div>
                <select
                  value={staffDeptFilter}
                  onChange={e => setStaffDeptFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Departments</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Portal Filter */}
              <div>
                <select
                  value={staffPortalFilter}
                  onChange={e => setStaffPortalFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Portal Domains</option>
                  {portals.filter(p => p.id !== 'STUDENT').map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Privilege Filter */}
              <div>
                <select
                  value={staffPrivilegeFilter}
                  onChange={e => setStaffPrivilegeFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Privilege Levels</option>
                  <option value="ADMIN">Super Admins Only</option>
                  <option value="MONITOR">Monitors / Auditors Only</option>
                  <option value="REGULAR">Standard Staff Only</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={staffStatusFilter}
                  onChange={e => setStaffStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Account Statuses</option>
                  <option value="ACTIVE">Active Staff</option>
                  <option value="ON_LEAVE">On Sabbatical / Leave</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

            </div>
          </div>

          {/* Main User Assignment 2-Column Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Filtered Staff Directory (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  Academic & Administrative Staff ({filteredStaffUsers.length})
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  Role Configurable
                </span>
              </div>

              <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {filteredStaffUsers.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-slate-850 rounded-xl space-y-1">
                    <p className="font-semibold text-white">No staff matched your filters</p>
                    <p className="text-[11px]">Try adjusting your search keywords or filter dropdowns.</p>
                  </div>
                ) : (
                  filteredStaffUsers.map(u => {
                    const isSelected = targetUser && u.id === targetUser.id;
                    const isSuperAdmin = u.portalAssignments.some(a => a.isAdmin);
                    const isAuditMonitor = u.portalAssignments.some(a => a.isMonitor);
                    const status = u.status || 'ACTIVE';

                    return (
                      <button
                        key={u.id}
                        onClick={() => setSelectedUserId(u.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition text-xs space-y-2 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                            : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800/90'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isSuperAdmin && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  Admin
                                </span>
                              )}
                              {isAuditMonitor && !isSuperAdmin && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  Monitor
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {u.identifier} • {u.portalAssignments[0]?.roleName || 'Staff Member'}
                            </div>
                          </div>

                          {/* Status badge */}
                          <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded shrink-0 ${
                            status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : status === 'SUSPENDED'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                          <span className="truncate max-w-[170px]">{u.department || 'Central Office'}</span>
                          <span className="font-mono text-blue-400 font-semibold shrink-0">
                            {u.portalAssignments.length} Domain{u.portalAssignments.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Target Staff RBAC Delegation & Inspector (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
              {targetUser ? (
                <>
                  {/* Staff Profile Header Card */}
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                        {targetUser.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white">{targetUser.name}</h3>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                            {targetUser.identifier}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {targetUser.email} • Dept: <span className="text-slate-200 font-medium">{targetUser.department || 'General'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Quick Tools: Status Changer & Switch Persona */}
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={targetUser.status || 'ACTIVE'}
                        onChange={e => updateUserStatus(targetUser.id, e.target.value as any)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                      >
                        <option value="ACTIVE">Status: Active</option>
                        <option value="ON_LEAVE">Status: On Leave</option>
                        <option value="SUSPENDED">Status: Suspended</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleGenerateAppointmentMemo(targetUser)}
                        title="Generate Official Letterheaded Appointment Memo"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Letterhead Memo</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Portal Domain Bindings */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Active Portal Domain Bindings ({targetUser.portalAssignments.length})
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Instant revocation enabled
                      </span>
                    </div>

                    {targetUser.portalAssignments.length === 0 ? (
                      <div className="p-5 rounded-xl bg-slate-850 border border-dashed border-slate-700 text-center text-xs text-slate-400">
                        No active portal domain roles assigned. This staff member has no access to any portal.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {targetUser.portalAssignments.map(assign => (
                          <div
                            key={assign.portalId}
                            className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white">{assign.portalId} Portal</span>
                                <span className="font-mono text-blue-400 font-semibold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                                  {assign.roleName}
                                </span>
                                {assign.isAdmin && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                                    Admin
                                  </span>
                                )}
                                {assign.isMonitor && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                                    Monitor
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                Scope: {assign.scope ? JSON.stringify(assign.scope) : 'Global Portal Domain'}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => revokePortalRole(targetUser.id, assign.portalId)}
                              className="px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Revoke Access</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Delegate & Assign New Portal Domain Role Form */}
                  <form onSubmit={handleAssignRole} className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-750 pb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Plus className="w-4 h-4 text-emerald-400" />
                        Assign & Delegate Portal Role Domain
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Instant live sync
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-300 font-semibold">Target Portal Domain</label>
                        <select
                          value={selectedPortalToAssign}
                          onChange={e => setSelectedPortalToAssign(e.target.value as any)}
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                        >
                          {portals.filter(p => p.id !== 'STUDENT').map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-slate-300 font-semibold">Select Role Template</label>
                        <select
                          value={selectedRoleToAssign}
                          onChange={e => setSelectedRoleToAssign(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                        >
                          {availableRolesForPortal.map(r => (
                            <option key={r.id} value={r.id}>
                              {r.name} {r.isAdmin ? '(Admin Right)' : r.isMonitor ? '(Monitor Oversight)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Authorize & Grant Portal Role</span>
                    </button>
                  </form>

                </>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Select a staff member from the left directory to configure their portal assignments.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. CROSS-PORTAL AUDIT TRAIL */}
      {/* ============================================================= */}
      {activeNavTab === 'audit' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Security & Audit Log
              </h2>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search audit trail..."
                    value={auditSearch}
                    onChange={e => setAuditSearch(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <select
                  value={auditFilterPortal}
                  onChange={e => setAuditFilterPortal(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none"
                >
                  <option value="ALL">All Portals</option>
                  {portals.map(p => (
                    <option key={p.id} value={p.id}>{p.id}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-950/60 border-y border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Portal</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-850">
                      <td className="py-3 px-4 text-slate-400">{log.timestamp.replace('T', ' ').slice(0, 19)}</td>
                      <td className="py-3 px-4 font-sans font-medium text-white">{log.userName}</td>
                      <td className="py-3 px-4 font-bold text-blue-400">{log.portalId}</td>
                      <td className="py-3 px-4 text-slate-200">{log.action}</td>
                      <td className="py-3 px-4 text-slate-400 font-sans">{log.details}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          log.status === 'DENIED' || log.status === 'FLAGGED'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
