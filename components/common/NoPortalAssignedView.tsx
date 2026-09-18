'use client';

import React from 'react';
import { useERP } from '@/context/erp-context';
import { ShieldAlert, LogOut, Building2, User, Mail, Hash } from 'lucide-react';

export function NoPortalAssignedView() {
  const { currentUser, logout, institutionalSettings } = useERP();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl space-y-6">
        {/* Institution Branding */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">
              {institutionalSettings?.name || 'Apex Institute of Technology'}
            </h2>
            <p className="text-xs text-slate-400">Identity & Access Governance</p>
          </div>
        </div>

        {/* Warning Badge & Notice */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-4 h-4" />
            <span>Authenticated • No Application Access</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            No Portal Assigned
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your institutional credentials are verified and your account status is <strong className="text-emerald-400 font-semibold">{currentUser?.status || 'ACTIVE'}</strong>. However, no application portal or workspace has been explicitly assigned to your profile.
          </p>
          <div className="bg-slate-950/60 rounded-lg p-3.5 border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <p className="font-medium text-slate-300">Next Steps:</p>
            <p>Please contact your institution&apos;s Registrar, HR, or System Administrator to grant the appropriate portal role and permissions for your role.</p>
          </div>
        </div>

        {/* Authenticated Identity Details */}
        <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-800/60 space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </span>
            <span className="font-medium text-slate-200">{currentUser?.name}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> Identifier
            </span>
            <span className="font-mono text-slate-200">{currentUser?.identifier}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </span>
            <span className="text-slate-200">{currentUser?.email}</span>
          </div>
        </div>

        {/* Action Button: Sign Out */}
        <div className="pt-2">
          <button
            id="no-portal-logout-btn"
            onClick={logout}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out & Return to Portal Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
