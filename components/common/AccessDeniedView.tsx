'use client';

import React from 'react';
import { useERP } from '@/context/erp-context';
import { PortalId } from '@/types/erp';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  KeyRound,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface AccessDeniedViewProps {
  portalId: PortalId;
  reason?: string;
}

export function AccessDeniedView({ portalId, reason }: AccessDeniedViewProps) {
  const {
    currentUser,
    portals,
    navigateToPortal,
    setIsSecuritySuiteOpen,
    openLoginModal
  } = useERP();

  const targetPortal = portals.find(p => p.id === portalId);
  const firstAllowedPortal = currentUser.portalAssignments[0]?.portalId || 'STUDENT';

  return (
    <div className="flex-1 p-8 flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="max-w-xl w-full bg-slate-900 border border-rose-800/60 rounded-2xl p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            HTTP 403 Forbidden • RBAC Boundary Intercept
          </div>
          <h2 className="text-xl font-bold text-white">
            Access Denied to {targetPortal ? targetPortal.name : portalId}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            {reason || `User '${currentUser.name}' (${currentUser.identifier}) has not been granted an active role assignment inside the ${portalId} portal domain.`}
          </p>
        </div>

        {/* Diagnostic Box */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left font-mono text-xs space-y-2">
          <div className="text-slate-400 flex justify-between">
            <span>Attempted Target:</span>
            <span className="text-rose-400 font-bold">{portalId} ({targetPortal?.urlPrefix})</span>
          </div>
          <div className="text-slate-400 flex justify-between">
            <span>Active Persona:</span>
            <span className="text-white">{currentUser.name} ({currentUser.identifier})</span>
          </div>
          <div className="text-slate-400">
            <span>Authorized Portals for User:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {currentUser.portalAssignments.map(a => (
                <span key={a.portalId} className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px]">
                  {a.portalId} ({a.roleName})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigateToPortal(firstAllowedPortal)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Authorized Portal ({firstAllowedPortal})</span>
          </button>

          <button
            onClick={() => setIsSecuritySuiteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
          >
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>View Acceptance Test Suite</span>
          </button>
        </div>

        {/* Secure Re-authentication CTA */}
        <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col items-center gap-2">
          <span>Need access to this portal? Authenticate with an authorized institutional account:</span>
          <button
            type="button"
            onClick={() => openLoginModal(portalId)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition flex items-center gap-2 shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In with Required Credentials</span>
          </button>
        </div>

      </div>
    </div>
  );
}
