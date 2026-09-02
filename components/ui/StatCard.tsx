'use client';

import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon?: React.ReactNode;
  badge?: string;
  badgeVariant?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  onClick?: () => void;
  accentColor?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  trend,
  icon,
  badge,
  badgeVariant = 'neutral',
  onClick,
  accentColor
}: StatCardProps) {
  const getBadgeClasses = () => {
    switch (badgeVariant) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'danger':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-sm transition flex flex-col justify-between text-left ${
        onClick ? 'hover:border-slate-700 hover:bg-slate-900 cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeClasses()}`}
            >
              {badge}
            </span>
          )}
          {icon && (
            <div className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60">
              {icon}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono"
            style={accentColor ? { color: accentColor } : undefined}
          >
            {value}
          </span>
          {trend && (
            <span
              className={`text-xs font-semibold font-mono ${
                trend.isNeutral
                  ? 'text-slate-400'
                  : trend.isPositive
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
        {subtext && (
          <p className="text-xs text-slate-400 font-medium line-clamp-1">
            {subtext}
          </p>
        )}
      </div>
    </Component>
  );
}
