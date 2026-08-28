'use client';

import React from 'react';
import { useERP } from '@/context/erp-context';
import {
  Radio,
  X,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Database,
  Share2
} from 'lucide-react';

export function CrossPortalEventsModal() {
  const {
    isEventsModalOpen,
    setIsEventsModalOpen,
    events,
    currentUser
  } = useERP();

  if (!isEventsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Controlled Cross-Portal Event Bus</h3>
              <p className="text-xs text-slate-400">
                Asynchronous event synchronization maintaining strict data boundaries and domain decoupling.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEventsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Architectural Concept Banner */}
        <div className="px-6 py-3 bg-purple-950/20 border-b border-purple-900/40 text-xs text-purple-200 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            <strong>Architectural Rule:</strong> Portals never execute direct SQL writes across domains. All inter-portal sync occurs via published domain events.
          </span>
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {events.map(evt => (
            <div
              key={evt.id}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 text-xs space-y-2 hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-bold text-[10px]">
                    {evt.sourcePortal}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <div className="flex items-center gap-1">
                    {evt.targetPortals.map(tp => (
                      <span
                        key={tp}
                        className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold text-[10px]"
                      >
                        {tp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                  <span>{evt.timestamp}</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> {evt.status}
                  </span>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-100 text-xs font-mono">{evt.eventType}</div>
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{evt.description}</p>
              </div>

              {/* Payload payload preview */}
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-400 overflow-x-auto">
                <span className="text-slate-500">Payload: </span>
                <span className="text-emerald-300">{JSON.stringify(evt.payload)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsEventsModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
