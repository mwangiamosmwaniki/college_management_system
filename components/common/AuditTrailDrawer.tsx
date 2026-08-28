'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalId } from '@/types/erp';
import {
  FileText,
  X,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Calendar,
  Layers
} from 'lucide-react';

export function AuditTrailDrawer() {
  const {
    isAuditDrawerOpen,
    setIsAuditDrawerOpen,
    auditLogs,
    activePortalId,
    portals
  } = useERP();

  const [selectedPortalFilter, setSelectedPortalFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuditDrawerOpen) return null;

  const filteredLogs = auditLogs.filter(log => {
    if (selectedPortalFilter !== 'ALL' && log.portalId !== selectedPortalFilter) return false;
    if (selectedStatusFilter !== 'ALL' && log.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.userIdentifier.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.resource.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-700 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Central Security Audit Trail</h3>
              <p className="text-xs text-slate-400">
                Immutable record identifying originating portal, identity, permission resolution, and outcome.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuditDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user, identifier, action, or details..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <select
              value={selectedPortalFilter}
              onChange={e => setSelectedPortalFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Portals ({auditLogs.length})</option>
              {portals.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Outcomes</option>
              <option value="GRANTED">Granted Only</option>
              <option value="DENIED">Denied Only</option>
              <option value="FLAGGED">Flagged</option>
            </select>

            <span className="text-[11px] text-slate-500 font-mono ml-auto">
              Showing {filteredLogs.length} entries
            </span>
          </div>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredLogs.map(log => {
            const isGranted = log.status === 'GRANTED';
            const isDenied = log.status === 'DENIED';

            return (
              <div
                key={log.id}
                className={`p-3.5 rounded-xl border transition text-xs space-y-1.5 ${
                  isDenied
                    ? 'bg-rose-950/20 border-rose-900/60'
                    : 'bg-slate-850 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        isGranted
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="font-mono font-bold text-slate-200">{log.action}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-blue-300">
                      {log.portalId}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>

                <div className="text-slate-300 text-xs font-mono">
                  <span className="text-slate-400">User: </span>
                  <strong className="text-white">{log.userName}</strong> ({log.userIdentifier}) • Role: <span className="text-blue-300">{log.roleName}</span>
                </div>

                <div className="text-slate-400 text-xs">
                  <span className="text-slate-500">Resource: </span>
                  <span className="font-mono text-slate-200">{log.resource}</span>
                </div>

                <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300">
                  {log.details}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            Originating Node IP: 192.168.10.x (Sandboxed)
          </span>
          <button
            onClick={() => setIsAuditDrawerOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
