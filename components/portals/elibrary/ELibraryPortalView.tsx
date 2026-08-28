'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalDataLifecycleManager } from '@/components/common/PortalDataLifecycleManager';
import {
  Library,
  BookOpenCheck,
  GraduationCap,
  Clock,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  BookMarked,
  ShieldCheck,
  Activity,
  FileText,
  RotateCw,
  Plus
} from 'lucide-react';

export function ELibraryPortalView() {
  const {
    currentUser,
    activeNavTab,
    libraryBooks,
    libraryLoans,
    digitalResources,
    libraryReservations,
    borrowBook,
    returnBook,
    reserveBook,
    accessDigitalResource,
    navigateToPortal
  } = useERP();

  const assignment = currentUser.portalAssignments.find(a => a.portalId === 'ELIBRARY');
  const roleName = assignment ? assignment.roleName : 'Library User';
  const isMonitor = assignment?.isMonitor;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [borrowFeedback, setBorrowFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [drmFeedback, setDrmFeedback] = useState<{ allowed: boolean; message: string } | null>(null);

  const filteredBooks = libraryBooks.filter(book => {
    if (selectedCategory !== 'ALL' && book.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(q) ||
        book.isbn.toLowerCase().includes(q) ||
        book.authors.some(a => a.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleBorrow = (bookId: string) => {
    const res = borrowBook(bookId);
    setBorrowFeedback(res);
    setTimeout(() => setBorrowFeedback(null), 3500);
  };

  const handleDigitalAccess = (resourceId: string, action: 'read_online' | 'download') => {
    const res = accessDigitalResource(resourceId, action);
    setDrmFeedback(res);
    setTimeout(() => setDrmFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. LIBRARY DASHBOARD */}
      {/* ------------------------------------------------------------- */}
      {(activeNavTab === 'dashboard' || !activeNavTab) && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Welcome Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/70 border border-amber-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Separate University Library Portal
                </span>
                <span className="text-xs text-slate-400 font-mono">Role: {roleName}</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                E-Library & Digital Resource Repository
              </h1>
              <p className="text-xs text-slate-300 max-w-xl">
                Integrated physical catalogue management, automated circulation loans, digital thesis archives, and license DRM enforcement.
              </p>
            </div>

            {/* Cross-Portal Bridges */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigateToPortal('STUDENT')}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                <GraduationCap className="w-4 h-4 text-white" />
                <span>Return to Student Portal</span>
              </button>

              <button
                onClick={() => navigateToPortal('ELEARNING')}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                <BookOpenCheck className="w-4 h-4 text-white" />
                <span>Open E-Learning LMS</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Active Loans</span>
              <div className="text-2xl font-black text-white font-mono">
                {libraryLoans.filter(l => l.userId === currentUser.id && l.status === 'ACTIVE').length} Books
              </div>
              <span className="text-[10px] text-emerald-400">All within loan period</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Fines Accrued</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">$0.00</div>
              <span className="text-[10px] text-slate-400">No overdue sanctions</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Digital Access Tier</span>
              <div className="text-base font-bold text-amber-300 font-mono">Institutional Open</div>
              <span className="text-[10px] text-slate-400">Full journal rights</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Physical Catalog Total</span>
              <div className="text-2xl font-black text-white font-mono">14,280</div>
              <span className="text-[10px] text-slate-400">Across 3 campus libraries</span>
            </div>
          </div>

          {/* Active Loans & Digital Hub Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Active User Loans */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Your Borrowed Physical Books
              </h3>

              <div className="space-y-3">
                {libraryLoans.filter(l => l.userId === currentUser.id && l.status !== 'RETURNED').length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-850 text-center text-xs text-slate-400">
                    You currently have no checked-out physical books.
                  </div>
                ) : (
                  libraryLoans
                    .filter(l => l.userId === currentUser.id && l.status !== 'RETURNED')
                    .map(loan => (
                      <div
                        key={loan.id}
                        className="p-3.5 rounded-xl bg-slate-850 border border-slate-700/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-white block">{loan.bookTitle}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Borrowed: {loan.borrowedAt} • Due: <strong className="text-amber-400">{loan.dueDate}</strong>
                          </span>
                        </div>
                        <button
                          onClick={() => returnBook(loan.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
                        >
                          Check In
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Featured Digital Research Papers */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Featured Digital Research Subscriptions
              </h3>

              <div className="space-y-3">
                {digitalResources.map(res => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{res.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-blue-300 border border-slate-800">
                        {res.fileFormat} • {res.fileSize}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{res.authors.join(', ')} ({res.year})</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-emerald-400">
                        License: {res.licenseType}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDigitalAccess(res.id, 'read_online')}
                          className="px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30"
                        >
                          Read Online
                        </button>
                        <button
                          onClick={() => handleDigitalAccess(res.id, 'download')}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${
                            res.permissions.canDownload
                              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                              : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                          }`}
                        >
                          <Download className="w-3 h-3" />
                          <span>{res.permissions.canDownload ? 'Download' : 'DRM Restricted'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1.5. BOOK & RESOURCE LIFECYCLE MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'data_lifecycle' && (
        <PortalDataLifecycleManager
          portalId="ELIBRARY"
          allowedEntityTypes={['LIBRARY_BOOK']}
          title="Library Catalog & ISBN Asset Lifecycle Governance"
          subtitle="Manage book titles, cataloging draft records, accession numbers, Dewey decimal taxonomy, and circulation states."
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. PHYSICAL BOOK CATALOGUE */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'catalog' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Library className="w-5 h-5 text-amber-400" />
                  Physical Library Book Catalogue & Circulation
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Search university book stacks across computing, engineering, and pure sciences.
                </p>
              </div>

              {/* Search & Category filter */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by title, author, ISBN..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {borrowFeedback && (
              <div
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  borrowFeedback.success
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                }`}
              >
                {borrowFeedback.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{borrowFeedback.message}</span>
              </div>
            )}

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {filteredBooks.map(book => (
                <div
                  key={book.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800">
                        {book.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          book.availableCopies > 0
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {book.availableCopies > 0 ? `${book.availableCopies} Copies Available` : 'Checked Out'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{book.title}</h4>
                    <p className="text-[11px] text-slate-400">{book.authors.join(', ')} ({book.year})</p>
                    
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-300 space-y-0.5">
                      <div>Call No: <strong className="text-slate-200">{book.callNumber}</strong></div>
                      <div>Shelf: <strong className="text-emerald-400">{book.shelfLocation}</strong></div>
                      <div>ISBN: <span className="text-slate-400">{book.isbn}</span></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    {book.availableCopies > 0 ? (
                      <button
                        onClick={() => handleBorrow(book.id)}
                        className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        Borrow Physical Copy (14 Days)
                      </button>
                    ) : (
                      <button
                        onClick={() => reserveBook(book.id)}
                        className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition"
                      >
                        Place in Reservation Queue
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2.5 LOANS & CIRCULATION DESK */}
      {/* ------------------------------------------------------------- */}
      {(activeNavTab === 'my_loans' || activeNavTab === 'loans') && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Header Summary */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Physical Circulation, Active Loans & Book Returns
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track your borrowed volumes, renew checkout durations, inspect overdue grace periods, and return library stacks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {libraryLoans.filter(l => l.status !== 'RETURNED').length} Active Checked-Out Books
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Active Loans</span>
                <div className="text-white text-lg font-bold">
                  {libraryLoans.filter(l => l.status !== 'RETURNED').length} / 4 Items
                </div>
                <span className="text-emerald-400 text-[10px]">Undergrad Quota Active</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Overdue Items</span>
                <div className="text-emerald-400 text-lg font-bold">0 Overdue</div>
                <span className="text-slate-400 text-[10px]">Good Standing</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Accrued Fines</span>
                <div className="text-white text-lg font-bold">$0.00</div>
                <span className="text-slate-400 text-[10px]">No Bursary Blocks</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Lifetime Loans</span>
                <div className="text-blue-300 text-lg font-bold">{libraryLoans.length} Volumes</div>
                <span className="text-slate-400 text-[10px]">Circulation History</span>
              </div>
            </div>
          </div>

          {/* Active Borrowed Books Table */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpenCheck className="w-4 h-4 text-emerald-400" />
                Active Circulation Checkouts
              </h3>
              <span className="text-xs text-slate-400 font-mono">RFID Barcode Verified</span>
            </div>

            <div className="space-y-3">
              {libraryLoans.length === 0 ? (
                <div className="p-8 rounded-xl bg-slate-850 text-center text-xs text-slate-400">
                  No books currently on loan. Visit the Physical Book Catalogue to check out stacks.
                </div>
              ) : (
                libraryLoans.map(loan => {
                  const isReturned = loan.status === 'RETURNED';
                  return (
                    <div
                      key={loan.id}
                      className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                        isReturned
                          ? 'bg-slate-900/60 border-slate-800 opacity-60'
                          : 'bg-slate-850 border-slate-700/80'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-white text-sm">{loan.bookTitle}</span>
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                              isReturned
                                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {loan.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-3">
                          <span>Loan ID: <strong className="text-slate-300">{loan.id}</strong></span>
                          <span>•</span>
                          <span>Borrowed Date: {loan.borrowedAt}</span>
                          <span>•</span>
                          <span>Due Date: <strong className={isReturned ? 'text-slate-400' : 'text-amber-400'}>{loan.dueDate}</strong></span>
                          <span>•</span>
                          <span>Fine: {loan.fineAccrued > 0 ? `$${loan.fineAccrued}` : '$0.00'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {!isReturned ? (
                          <>
                            <button
                              onClick={() => {
                                setBorrowFeedback({
                                  success: true,
                                  message: `Successfully renewed "${loan.bookTitle}" for an additional 14 days!`
                                });
                                setTimeout(() => setBorrowFeedback(null), 3000);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                            >
                              Renew Loan (+14d)
                            </button>
                            <button
                              onClick={() => returnBook(loan.id)}
                              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                            >
                              Check In / Return Book
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Returned & Inspected
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Self-Service RFID Terminal Simulator */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-blue-400" />
                Library Smart RFID Drop-Box & Fast Return Station
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                Hardware Node: LIB-KIOSK-04
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Drop any university library physical book onto the high-frequency RFID reader plate for instant magnetic desensitization, automated ledger update, and real-time fine calculation.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-dashed border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Central Library Circulation Desk</div>
                  <div className="text-[11px] text-slate-400 font-mono">Open Mon–Sat (08:00 – 21:00) • Floor 1 Main Lobby</div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (libraryLoans.some(l => l.status !== 'RETURNED')) {
                    const unreturned = libraryLoans.find(l => l.status !== 'RETURNED');
                    if (unreturned) returnBook(unreturned.id);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
              >
                Scan & Check In Stack at Drop-Box
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. DIGITAL RESOURCES & DRM HUB */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'digital_drm' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              Digital Library & Granular DRM Policy Hub
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Granular access controls separating view rights, online reading, and offline downloads per publisher license.
            </p>
          </div>

          {drmFeedback && (
            <div
              className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                drmFeedback.allowed
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              }`}
            >
              {drmFeedback.allowed ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{drmFeedback.message}</span>
            </div>
          )}

          <div className="space-y-4">
            {digitalResources.map(res => (
              <div
                key={res.id}
                className="p-5 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3 text-xs">
                  <div>
                    <span className="font-bold text-white text-sm">{res.title}</span>
                    <p className="text-[11px] text-slate-400">{res.authors.join(', ')} • {res.publisher} ({res.year})</p>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 text-blue-300 border border-slate-700">
                    License: {res.licenseType}
                  </span>
                </div>

                {/* Granular Permission Matrix for this Resource */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                  <div className={`p-2 rounded-lg border ${res.permissions.canView ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300' : 'bg-rose-950/20 border-rose-800 text-rose-400'}`}>
                    View Metadata: {res.permissions.canView ? '✓ Allowed' : '✗ Denied'}
                  </div>
                  <div className={`p-2 rounded-lg border ${res.permissions.canReadOnline ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300' : 'bg-rose-950/20 border-rose-800 text-rose-400'}`}>
                    Read Online: {res.permissions.canReadOnline ? '✓ Allowed' : '✗ Denied'}
                  </div>
                  <div className={`p-2 rounded-lg border ${res.permissions.canDownload ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300' : 'bg-rose-950/20 border-rose-800 text-rose-400'}`}>
                    Download PDF: {res.permissions.canDownload ? '✓ Allowed' : '✗ DRM Blocked'}
                  </div>
                  <div className={`p-2 rounded-lg border ${res.permissions.canPrint ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300' : 'bg-rose-950/20 border-rose-800 text-rose-400'}`}>
                    Print Copy: {res.permissions.canPrint ? '✓ Allowed' : '✗ Restricted'}
                  </div>
                  <div className={`p-2 rounded-lg border ${res.permissions.canShare ? 'bg-emerald-950/20 border-emerald-800 text-emerald-300' : 'bg-rose-950/20 border-rose-800 text-rose-400'}`}>
                    Share DRM Link: {res.permissions.canShare ? '✓ Allowed' : '✗ Restricted'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400 font-mono">
                    Total Digital Reads: <strong className="text-white">{res.totalReads}</strong> • Downloads: <strong className="text-white">{res.totalDownloads}</strong>
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDigitalAccess(res.id, 'read_online')}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                    >
                      Launch Reader
                    </button>
                    <button
                      onClick={() => handleDigitalAccess(res.id, 'download')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Offline</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. RESERVATIONS QUEUE */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'reservations' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-amber-400" />
                Physical Book Reservation & Hold Queue
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Active circulation queue positions, hold collection deadlines, and pickup desk locations.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {libraryReservations.length} Active Holds
            </span>
          </div>

          <div className="space-y-3">
            {libraryReservations.map((res, idx) => (
              <div
                key={res.id}
                className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{res.bookTitle}</span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      res.status === 'READY_FOR_PICKUP'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {res.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-3">
                    <span>Queue Position: <strong className="text-white">#{res.queuePosition ?? (idx + 1)}</strong></span>
                    <span>•</span>
                    <span>Reserved on: {res.reservedAt}</span>
                    <span>•</span>
                    <span>Expiry: {res.expiresAt}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-[11px] space-y-1">
                  <span className="text-slate-400 block">Pickup Location: <strong className="text-blue-300">Central Circulation Desk (Ground Fl)</strong></span>
                  <span className="text-emerald-400 font-semibold block">Notification sent via SMS/SSO</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. CIRCULATION POLICIES & FINES */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'policies' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              Circulation Lending Rules, Limits & Fine Structures
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Institutional borrowing limits, overdue fine rate schedules, and cross-portal bursary block sanctions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
              <span className="text-slate-400 font-bold block uppercase">Undergraduate Students</span>
              <div className="text-white text-base font-bold">Max 4 Physical Books</div>
              <p className="text-[11px] text-slate-400">14-day borrowing duration with 1 online renewal permitted.</p>
              <div className="text-amber-400 font-bold">$0.50 / day overdue fine</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
              <span className="text-slate-400 font-bold block uppercase">Postgraduate / Researchers</span>
              <div className="text-white text-base font-bold">Max 8 Physical Books</div>
              <p className="text-[11px] text-slate-400">30-day borrowing duration with 2 online renewals permitted.</p>
              <div className="text-amber-400 font-bold">$0.75 / day overdue fine</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
              <span className="text-slate-400 font-bold block uppercase">Faculty / Lecturers</span>
              <div className="text-white text-base font-bold">Max 15 Physical Books</div>
              <p className="text-[11px] text-slate-400">Full semester loan with automatic renewal upon department request.</p>
              <div className="text-emerald-400 font-bold">Exempt from standard daily fine</div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. LIBRARY MONITOR OVERVIEW */}
      {/* ------------------------------------------------------------- */}
      {activeNavTab === 'monitor' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              Library Operational Monitor & Circulation Telemetry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Read-only oversight of active loans, overdue items, reservation queues, and fine ledgers (e.g. Karen Vance).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Current Active Loans</span>
              <div className="text-2xl font-black text-white font-mono">{libraryLoans.filter(l => l.status === 'ACTIVE').length} Books</div>
              <span className="text-[10px] text-emerald-400">Circulation rate 88%</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Overdue Items Alert</span>
              <div className="text-2xl font-black text-rose-400 font-mono">{libraryLoans.filter(l => l.status === 'OVERDUE').length} Books</div>
              <span className="text-[10px] text-slate-400">Sanction notifications dispatched</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Digital Bandwidth Consumed</span>
              <div className="text-2xl font-black text-blue-400 font-mono">1.84 TB</div>
              <span className="text-[10px] text-slate-400">ACM & IEEE DRM Streams</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
