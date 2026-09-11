'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalId, PermissionAction, RoleDefinition } from '@/types/erp';
import {
  Sliders,
  X,
  Plus,
  Check,
  Shield,
  Layers,
  Info,
  CheckSquare,
  Square
} from 'lucide-react';

const ACTIONS: PermissionAction[] = [
  'view',
  'create',
  'edit',
  'delete',
  'approve',
  'export',
  'configure',
  'grade',
  'moderate',
  'publish',
  'reconcile',
  'verify',
  'download',
  'read_online',
  'monitor'
];

export function CustomRoleBuilderModal() {
  const {
    isRoleBuilderOpen,
    setIsRoleBuilderOpen,
    portals,
    roles,
    createCustomRole,
    currentUser
  } = useERP();

  const [selectedPortal, setSelectedPortal] = useState<PortalId>('ELEARNING');
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [isMonitor, setIsMonitor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [resourceKey, setResourceKey] = useState('courses');
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionAction[]>(['view']);
  const [successMessage, setSuccessMessage] = useState('');

  const isAdminUser = currentUser?.portalAssignments?.some(
    a => a.portalId === 'ADMIN' && (a.roleId === 'ROLE_ADMIN' || a.roleId === 'ROLE_SUPER_ADMIN' || a.isAdmin)
  );

  if (!isRoleBuilderOpen || !isAdminUser) return null;

  const togglePermission = (action: PermissionAction) => {
    setSelectedPermissions(prev =>
      prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action]
    );
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    const newRole: RoleDefinition = {
      id: `ROLE_CUSTOM_${Date.now()}`,
      portalId: selectedPortal,
      name: roleName.trim(),
      description: roleDescription.trim() || `Custom defined role for ${selectedPortal} portal.`,
      isSystemDefault: false,
      isMonitor,
      isAdmin,
      permissions: {
        [resourceKey]: selectedPermissions
      }
    };

    createCustomRole(newRole);
    setSuccessMessage(`Custom role "${newRole.name}" created and registered under ${selectedPortal} portal!`);
    setTimeout(() => {
      setSuccessMessage('');
      setRoleName('');
      setRoleDescription('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Visual RBAC Matrix & Role Builder</h3>
              <p className="text-xs text-slate-400">
                Define and grant fine-grained portal capabilities adhering to the principle of least privilege.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRoleBuilderOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleCreateRole} className="space-y-4">
            
            {/* Target Portal Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Portal Domain
              </label>
              <select
                value={selectedPortal}
                onChange={e => setSelectedPortal(e.target.value as PortalId)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {portals.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) — {p.ownerDepartment}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Name & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Role Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Assessment Coordinator"
                  value={roleName}
                  onChange={e => setRoleName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Resource Domain Key
                </label>
                <input
                  type="text"
                  placeholder="e.g. assignments, marks_entry, loans"
                  value={resourceKey}
                  onChange={e => setResourceKey(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Role Description & Scope
              </label>
              <input
                type="text"
                placeholder="Brief summary of duties and organizational boundaries"
                value={roleDescription}
                onChange={e => setRoleDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Flags */}
            <div className="flex items-center gap-6 py-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMonitor}
                  onChange={e => setIsMonitor(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4 bg-slate-800"
                />
                <span>Set as <strong>Monitor Role</strong> (Oversight / Read-Only telemetry)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={e => setIsAdmin(e.target.checked)}
                  className="rounded border-slate-700 text-purple-500 focus:ring-purple-500 w-4 h-4 bg-slate-800"
                />
                <span>Set as <strong>Portal Administrator</strong></span>
              </label>
            </div>

            {/* Visual Permission Action Matrix */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Permission Matrix for Resource: <code className="text-blue-400 font-mono">{resourceKey}</code>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                {ACTIONS.map(act => {
                  const isChecked = selectedPermissions.includes(act);
                  return (
                    <button
                      type="button"
                      key={act}
                      onClick={() => togglePermission(act)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-mono text-left transition ${
                        isChecked
                          ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="capitalize">{act}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRoleBuilderOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Register Custom Role</span>
              </button>
            </div>

          </form>

          {/* Registered Roles in Selected Portal */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Currently Registered Roles in {selectedPortal} ({roles.filter(r => r.portalId === selectedPortal).length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {roles
                .filter(r => r.portalId === selectedPortal)
                .map(r => (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 flex items-center gap-2">
                        <span>{r.name}</span>
                        {r.isMonitor && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-mono">
                            Monitor
                          </span>
                        )}
                        {r.isAdmin && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded font-mono">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{r.description}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400">
                        {Object.keys(r.permissions).length} Resources
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
