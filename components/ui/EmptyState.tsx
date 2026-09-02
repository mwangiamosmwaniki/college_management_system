'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No records found',
  description,
  icon,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800/80 ${className}`}
    >
      <div className="p-3 rounded-full bg-slate-800 text-slate-400 border border-slate-700/80 mb-3">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-200 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
