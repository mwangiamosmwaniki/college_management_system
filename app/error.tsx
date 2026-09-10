'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error safely
    console.error('Next.js Client Boundary Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">Application Refresh Required</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            A temporary client session error or cache sync occurred. You can reload the application view to restore state.
          </p>
          {error?.message && (
            <p className="text-xs font-mono text-slate-500 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 break-words text-left">
              {error.message}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Home Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
