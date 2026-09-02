'use client';

import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'brand'
  | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = ''
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      case 'danger':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      case 'info':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25';
      case 'brand':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/25';
      case 'neutral':
      default:
        return 'bg-slate-800/80 text-slate-300 border-slate-700';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-[10px] px-1.5 py-0.5';
      case 'md':
      default:
        return 'text-xs px-2.5 py-0.5';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md border tracking-tight shrink-0 ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
}

export function getStatusBadgeVariant(status: string): BadgeVariant {
  const s = (status || '').toUpperCase();
  if (['ACTIVE', 'COMPLETED', 'PAID', 'APPROVED', 'VERIFIED', 'PRESENT', 'SUCCESS', 'ONLINE', 'PASSED', 'REGISTERED', 'GOOD_STANDING'].includes(s)) {
    return 'success';
  }
  if (['PENDING', 'IN_REVIEW', 'MODERATION', 'PARTIAL', 'WAITLISTED', 'DRAFT', 'INTERVENTION_REQUIRED', 'FLAGGED'].includes(s)) {
    return 'warning';
  }
  if (['FAILED', 'REJECTED', 'SUSPENDED', 'OVERDUE', 'ABSENT', 'CANCELLED', 'REVOKED', 'OFFLINE', 'LOCKED'].includes(s)) {
    return 'danger';
  }
  if (['PROCESSING', 'IN_PROGRESS', 'SCHEDULED', 'ALLOCATED'].includes(s)) {
    return 'info';
  }
  if (['DEAN_HONOURS', 'SPECIAL', 'SENATE_APPROVED'].includes(s)) {
    return 'purple';
  }
  return 'neutral';
}
