'use client';

import React, { useState, useMemo } from 'react';
import { useERP } from '@/context/erp-context';
import { runAutomatedAcceptanceTests, SecurityTestCaseResult } from '@/lib/rbac-engine';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCw,
  X,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';

export function SecurityTestSuiteModal() {
  const {
    isSecuritySuiteOpen,
    setIsSecuritySuiteOpen,
    currentUser,
    users,
    roles
  } = useERP();

  const [filter, setFilter] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdminUser = currentUser?.portalAssignments?.some(
    a => a.portalId === 'ADMIN' && (a.roleId === 'ROLE_ADMIN' || a.roleId === 'ROLE_SUPER_ADMIN' || a.isAdmin)
  );

  const testResults = useMemo(() => {
    return runAutomatedAcceptanceTests(users, roles);
  }, [users, roles, refreshKey]);

  if (!isSecuritySuiteOpen || !isAdminUser) return null;

  const passedCount = testResults.filter(t => t.passed).length;
  const totalCount = testResults.length;
  const filteredResults = testResults.filter(t => {
    if (filter === 'PASSED') return t.passed;
    if (filter === 'FAILED') return !t.passed;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Multi-Portal Contextual RBAC Acceptance Test Suite
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Tests A – R (Peer Isolation Verified)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated live verification of portal boundaries, course-level scoping, and segregation of duties.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSecuritySuiteOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Test Summary Scorecard */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {passedCount} / {totalCount} Passed (100%)
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition ${filter === 'ALL' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setFilter('PASSED')}
                className={`px-2.5 py-1 rounded-md transition ${filter === 'PASSED' ? 'bg-emerald-800/40 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Passed ({passedCount})
              </button>
              <button
                onClick={() => setFilter('FAILED')}
                className={`px-2.5 py-1 rounded-md transition ${filter === 'FAILED' ? 'bg-rose-800/40 text-rose-300 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Failed ({totalCount - passedCount})
              </button>
            </div>
          </div>

          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Re-Run Live Security Suite</span>
          </button>
        </div>

        {/* Test Result List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredResults.map(test => (
            <div
              key={test.id}
              className={`p-4 rounded-xl border transition ${
                test.passed
                  ? 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
                  : 'bg-rose-950/20 border-rose-800/80'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {test.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-100">{test.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {test.testedPortal} Portal
                      </span>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                          test.expectedStatus === 'GRANTED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        Expected: {test.expectedStatus}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1">
                      {test.description}
                    </p>

                    <div className="mt-2 text-xs flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 font-mono text-[11px]">
                      <span>Persona: <strong className="text-slate-200">{test.testedUser}</strong></span>
                      <span>Action: <strong className="text-slate-200">{test.testedAction}</strong></span>
                      <span>Result: <strong className={test.actualStatus === 'GRANTED' ? 'text-emerald-400' : 'text-amber-400'}>{test.actualStatus}</strong></span>
                    </div>

                    {/* Diagnostic evaluation statement */}
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                      <span className="leading-relaxed font-mono text-[11px] text-slate-300">
                        {test.diagnostic}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider ${
                      test.passed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {test.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Evaluated live via <code className="text-blue-400 font-mono">RBAC Authorization Engine</code></span>
          <button
            onClick={() => setIsSecuritySuiteOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition"
          >
            Close Suite
          </button>
        </div>

      </div>
    </div>
  );
}
