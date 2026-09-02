'use client';

import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
  badge?: string;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'underline' | 'contained';
  size?: 'sm' | 'md';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'contained',
  size = 'md',
  className = ''
}: TabsProps) {
  const getBadgeClasses = (badgeVariant?: string) => {
    switch (badgeVariant) {
      case 'success':
        return 'bg-emerald-500/20 text-emerald-300';
      case 'warning':
        return 'bg-amber-500/20 text-amber-300';
      case 'danger':
        return 'bg-rose-500/20 text-rose-300';
      case 'info':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  if (variant === 'underline') {
    return (
      <div className={`border-b border-slate-800 flex items-center gap-2 overflow-x-auto ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 pb-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'border-blue-500 text-blue-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800/80 overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 rounded-lg font-medium transition whitespace-nowrap cursor-pointer ${
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs'
            } ${
              isActive
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-blue-500/30 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${getBadgeClasses(
                  tab.badgeVariant
                )}`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
