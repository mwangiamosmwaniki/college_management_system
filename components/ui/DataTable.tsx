'use client';

import React from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalRecords?: number;
    pageSize?: number;
  };
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onRowClick?: (row: T) => void;
  className?: string;
  compact?: boolean;
  selectedIds?: string[];
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  searchPlaceholder = 'Search records...',
  searchQuery,
  onSearchChange,
  filters,
  actions,
  pagination,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filters to find what you are looking for.',
  emptyActionLabel,
  onEmptyAction,
  onRowClick,
  className = '',
  compact = false
}: DataTableProps<T>) {
  const hasControls = Boolean(onSearchChange || filters || actions);

  return (
    <div className={`rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-sm overflow-hidden flex flex-col ${className}`}>
      {/* Control Bar: Search & Filters */}
      {hasControls && (
        <div className="p-3 sm:p-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40">
          <div className="flex flex-1 items-center gap-2.5 flex-wrap">
            {onSearchChange && (
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            )}
            {filters}
          </div>

          {actions && (
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-semibold ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                    Loading dataset...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={keyExtractor(row, idx)}
                  onClick={() => onRowClick?.(row)}
                  className={`transition group ${
                    onRowClick ? 'cursor-pointer hover:bg-slate-800/50' : 'hover:bg-slate-800/30'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 ${compact ? 'py-2.5' : 'py-3.5'} text-slate-200 ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      } ${col.className || ''}`}
                    >
                      {col.render ? col.render(row, idx) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="p-3 sm:px-4 sm:py-2.5 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div>
            {pagination.totalRecords !== undefined ? (
              <span>
                Showing <strong className="text-slate-200">{data.length}</strong> of{' '}
                <strong className="text-slate-200">{pagination.totalRecords}</strong> records
              </span>
            ) : (
              <span>
                Page <strong className="text-slate-200">{pagination.currentPage}</strong> of{' '}
                <strong className="text-slate-200">{pagination.totalPages || 1}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300">
              {pagination.currentPage}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
