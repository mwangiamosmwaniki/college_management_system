'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; onClick?: () => void }[];
}

export function PageHeader({
  title,
  description,
  badge,
  badgeVariant = 'brand',
  actions,
  breadcrumbs
}: PageHeaderProps) {
  const getBadgeClasses = () => {
    switch (badgeVariant) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'danger':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'info':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'neutral':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'brand':
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 mb-6">
      <div className="space-y-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-600">/</span>}
                {crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    className="hover:text-slate-300 transition cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-slate-400">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {title}
          </h1>
          {badge && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getBadgeClasses()}`}
            >
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 sm:self-center shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}
