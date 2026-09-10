import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-950/80 border border-blue-700/60 flex items-center justify-center text-blue-400">
          <FileQuestion className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">Portal Page Not Found</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The requested institutional path or portal route does not exist or has been relocated.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>Return to Institutional Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
