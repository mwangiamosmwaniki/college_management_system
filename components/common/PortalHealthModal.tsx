'use client';

import React from 'react';
import { useERP } from '@/context/erp-context';
import { PortalId, PortalStatus } from '@/types/erp';
import {
  Activity,
  X,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  PowerOff,
  Server,
  Layers,
  ShieldCheck
} from 'lucide-react';

export function PortalHealthModal() {
  const {
    isHealthModalOpen,
    setIsHealthModalOpen,
    currentUser,
    portals,
    togglePortalStatus
  } = useERP();

  const isAdminUser = currentUser?.portalAssignments?.some(
    a => a.portalId === 'ADMIN' && (a.roleId === 'ROLE_ADMIN' || a.roleId === 'ROLE_SUPER_ADMIN' || a.isAdmin)
  );

  if (!isHealthModalOpen || !isAdminUser) return null;

  const getStatusBadge = (status: PortalStatus) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ONLINE (99.98%)
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            <Wrench className="w-3 h-3" />
            MAINTENANCE
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
            <AlertTriangle className="w-3 h-3" />
            DEGRADED
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
            <PowerOff className="w-3 h-3" />
            OFFLINE
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Institutional Portal Health & Uptime Dashboard</h3>
              <p className="text-xs text-slate-400">
                Operational oversight of independent micro-portals, API runtimes, and isolated maintenance windows.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsHealthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Cluster Summary */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 text-[11px] block">Total Registered Portals</span>
              <strong className="text-white text-sm font-bold">{portals.length} Isolated Environments</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Database Sharding</span>
              <strong className="text-emerald-400 text-sm font-bold">Isolated Domain Schemas</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Central SSO Gateway</span>
              <strong className="text-blue-400 text-sm font-bold">Operational</strong>
            </div>
          </div>
        </div>

        {/* Portals Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {portals.map(portal => (
            <div
              key={portal.id}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/70 hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{portal.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {portal.version}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {`${portal.urlPrefix}/*`}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{portal.description}</p>
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-3">
                  <span>Owner: <strong className="text-slate-300">{portal.ownerDepartment}</strong></span>
                  <span>•</span>
                  <span>Admin Role: <strong className="text-slate-300">{portal.adminRole}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {getStatusBadge(portal.status)}

                {/* Maintenance status toggle */}
                <select
                  value={portal.status}
                  onChange={e => togglePortalStatus(portal.id, e.target.value as PortalStatus)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium focus:outline-none"
                >
                  <option value="ONLINE">Set Online</option>
                  <option value="MAINTENANCE">Set Maintenance</option>
                  <option value="DEGRADED">Set Degraded</option>
                  <option value="OFFLINE">Set Offline</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsHealthModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
