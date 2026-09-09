'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { financeApi } from '@/lib/api';
import { PortalDataLifecycleManager } from '@/components/common/PortalDataLifecycleManager';
import {
  CreditCard,
  DollarSign,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Download,
  Calendar,
  Layers,
  ShieldCheck,
  TrendingUp,
  RotateCw,
  Plus,
  Search,
  Printer,
  FileSpreadsheet,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Building,
  UserCheck,
  Check,
  Sliders
} from 'lucide-react';

export function FinancePortalView() {
  const {
    currentUser,
    activeNavTab,
    studentInvoices,
    reconcileTransaction,
    publishCrossPortalEvent,
    openInstitutionalDocument
  } = useERP();

  const [reconcileFeedback, setReconcileFeedback] = useState<string | null>(null);
  const [activeWorkflowStage, setActiveWorkflowStage] = useState<number>(2);
  const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState<string | null>(null);
  const [paymentSearch, setPaymentSearch] = useState('');
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState('ALL');

  const handleOpenPaymentReceipt = (inv: typeof studentInvoices[0]) => {
    openInstitutionalDocument({
      title: 'OFFICIAL BURSARY PAYMENT RECEIPT & SETTLEMENT VOUCHER',
      documentNumber: `RCT-${inv.invoiceNumber}-2026`,
      date: 'August 24, 2026',
      recipientName: 'Prof. Walter Sterling (Student Account STU-2026-00124)',
      recipientId: 'STU-2026-00124',
      recipientDept: 'Faculty of Computing • Computer Science',
      metadata: {
        'Invoice Reference': inv.invoiceNumber,
        'Fee Description': inv.title,
        'Academic Session': inv.session,
        'Payment Channel': 'Central Interswitch / NIBSS Direct Settlement',
        'Transaction Status': 'CLEARED & RECONCILED',
        'Amount Paid': `$${inv.amount.toFixed(2)} USD`
      },
      bodyParagraphs: [
        `This document serves as conclusive legal proof of fee payment to the University Bursary treasury. The funds have been cleared and credited to the student's sub-ledger account.`,
        `The transaction was reconciled through the automated interbank gateway and qualifies the candidate for academic clearance, examination card validation, and LMS access.`
      ],
      tableData: {
        headers: ['Item / Fee Description', 'Session', 'Due Date', 'Billed Amount', 'Paid Amount', 'Balance'],
        rows: [
          [inv.title, inv.session, inv.dueDate, `$${inv.amount.toFixed(2)}`, `$${inv.paidAmount.toFixed(2)}`, `$${inv.balance.toFixed(2)}`]
        ]
      },
      signatoryTitle: 'Bursar & Chief Financial Officer',
      signatoryName: 'Dr. Gregory Finch, FCA, ACTI',
      status: 'VERIFIED',
      verificationHash: `APX-RCT-BURSARY-${inv.invoiceNumber}-88192`
    });
  };

  // Interactive 4-stage vouchers
  const [vouchers, setVouchers] = useState([
    {
      id: 'VCH-2026-0891',
      title: 'Department of Computing High-Performance Server Cluster',
      amount: 45000,
      initiator: 'Dr. Marcus Henderson (HOD)',
      currentStage: 3, // 1: Initiated, 2: Internal Audit, 3: Bursar Approval, 4: Treasury Disbursed
      status: 'AWAITING_BURSAR',
      date: '2026-08-20'
    },
    {
      id: 'VCH-2026-0892',
      title: 'E-Library ScienceDirect Digital Subscriptions Renewal',
      amount: 18500,
      initiator: 'Karen Vance (Chief Librarian)',
      currentStage: 2,
      status: 'INTERNAL_AUDIT',
      date: '2026-08-22'
    },
    {
      id: 'VCH-2026-0890',
      title: 'Campus Central Hostel Solar Inverter Maintenance',
      amount: 12400,
      initiator: 'Hostel Maintenance Directorate',
      currentStage: 4,
      status: 'DISBURSED',
      date: '2026-08-18'
    }
  ]);

  const handleAdvanceVoucher = (vId: string) => {
    setVouchers(prev =>
      prev.map(v => {
        if (v.id !== vId) return v;
        const nextStage = Math.min(4, v.currentStage + 1);
        const nextStatus = nextStage === 4 ? 'DISBURSED' : nextStage === 3 ? 'AWAITING_BURSAR' : 'INTERNAL_AUDIT';
        return { ...v, currentStage: nextStage, status: nextStatus };
      })
    );
    setReconcileFeedback(`Voucher ${vId} approved and advanced to next Segregation-of-Duties stage!`);
    setTimeout(() => setReconcileFeedback(null), 3000);
  };

  const handleReconcile = async (invoiceId: string) => {
    reconcileTransaction(invoiceId);
    try {
      await financeApi.runReconciliation();
    } catch {
      // Graceful fallback if offline
    }
    setReconcileFeedback(`Transaction reconciled successfully with Central Treasury! Cross-portal TUITION_FEES_CLEARED event published.`);
    setTimeout(() => setReconcileFeedback(null), 3500);
  };

  const filteredInvoices = studentInvoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(paymentSearch.toLowerCase()) ||
    inv.title.toLowerCase().includes(paymentSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Institutional Finance & Bursary
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Semester Revenue Inflow</span>
            <span className="text-xl font-black text-emerald-400 font-mono">$4,850,200.00</span>
          </div>
        </div>
      </div>

      {reconcileFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{reconcileFeedback}</span>
        </div>
      )}

      {/* ============================================================= */}
      {/* 1. BURSARY DASHBOARD */}
      {/* ============================================================= */}
      {(activeNavTab === 'dashboard' || !activeNavTab) && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Total Collections</span>
              <div className="text-white text-xl font-bold">$4,850,200</div>
              <div className="text-emerald-400 text-[10px] flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +14.2% vs last session
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Unreconciled Invoices</span>
              <div className="text-amber-400 text-xl font-bold">
                {studentInvoices.filter(i => i.status !== 'PAID').length} Outstanding
              </div>
              <span className="text-slate-400 text-[10px]">Awaiting Teller Match</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">4-Stage Vouchers</span>
              <div className="text-purple-400 text-xl font-bold">
                {vouchers.filter(v => v.status !== 'DISBURSED').length} Pending
              </div>
              <span className="text-slate-400 text-[10px]">Dual-Custody Active</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Treasury Reserve</span>
              <div className="text-emerald-400 text-xl font-bold">$1,240,000</div>
              <span className="text-slate-400 text-[10px]">Central Bank Liquidity</span>
            </div>
          </div>

          {/* Ledger Snapshot & Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-purple-400" />
                  Recent Bursary Inflow & Transactions
                </h3>
                <span className="text-xs text-slate-400 font-mono">Live Automated Reconciliation</span>
              </div>

              <div className="space-y-3">
                {studentInvoices.slice(0, 4).map(inv => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-xl bg-slate-850 border border-slate-700/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{inv.title}</span>
                        <span className="font-mono text-[10px] text-blue-400">({inv.invoiceNumber})</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{inv.session} • Student: STU-2026-00124</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-emerald-400">${inv.amount.toFixed(2)}</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Segregation of Duties Compliance
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All financial disbursements exceeding $5,000 must pass strict 4-stage cryptographic validation without single-party authority.
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between text-emerald-400">
                  <span>Stage 1: Department Initiation</span>
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between text-emerald-400">
                  <span>Stage 2: Audit Pre-Checking</span>
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between text-purple-400 font-bold">
                  <span>Stage 3: Bursar Warrant</span>
                  <span>PENDING</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-between text-slate-500">
                  <span>Stage 4: Treasury Disbursement</span>
                  <span>LOCKED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 2.5. FINANCIAL INVOICE & ASSET DATA LIFECYCLE */}
      {/* ============================================================= */}
      {activeNavTab === 'data_lifecycle' && (
        <PortalDataLifecycleManager
          portalId="FINANCE"
          allowedEntityTypes={['INVOICE']}
          title="Bursary Ledger & Invoice Operations"
        />
      )}

      {/* ============================================================= */}
      {/* 2. SEGREGATION OF DUTIES PIPELINE */}
      {/* ============================================================= */}
      {(activeNavTab === 'workflow' || activeNavTab === 'segregation') && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  4-Stage Segregation of Duties Disbursement Pipeline
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Institutional controls preventing unilateral expenditures. Sequential multi-signatory cryptographic authorization.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Active Policy: DUAL_CUSTODY_v4
              </span>
            </div>

            <div className="space-y-4">
              {vouchers.map(v => (
                <div
                  key={v.id}
                  className="p-5 rounded-xl bg-slate-850 border border-slate-700/80 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3 text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">{v.title}</span>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Voucher: <strong className="text-blue-300">{v.id}</strong> • Initiated by: {v.initiator} ({v.date})
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-base font-bold text-emerald-400">${v.amount.toLocaleString()}.00</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        v.status === 'DISBURSED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {v.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* 4-Stage Visual Stepper */}
                  <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
                    <div className={`p-2.5 rounded-lg border text-center ${v.currentStage >= 1 ? 'bg-emerald-950/30 border-emerald-700 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <div className="font-bold">1. Initiation</div>
                      <div className="text-[10px] text-slate-400">Department Head</div>
                    </div>
                    <div className={`p-2.5 rounded-lg border text-center ${v.currentStage >= 2 ? 'bg-emerald-950/30 border-emerald-700 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <div className="font-bold">2. Audit Pre-Check</div>
                      <div className="text-[10px] text-slate-400">Internal Auditor</div>
                    </div>
                    <div className={`p-2.5 rounded-lg border text-center ${v.currentStage >= 3 ? 'bg-emerald-950/30 border-emerald-700 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <div className="font-bold">3. Bursar Warrant</div>
                      <div className="text-[10px] text-slate-400">University Bursar</div>
                    </div>
                    <div className={`p-2.5 rounded-lg border text-center ${v.currentStage >= 4 ? 'bg-emerald-950/30 border-emerald-700 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      <div className="font-bold">4. Disbursement</div>
                      <div className="text-[10px] text-slate-400">Central Treasury</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Current Gate: <strong className="text-white">Stage {v.currentStage} of 4</strong>
                    </span>
                    {v.currentStage < 4 ? (
                      <button
                        onClick={() => handleAdvanceVoucher(v.id)}
                        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        Authorize & Advance Voucher (Stage {v.currentStage + 1})
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Disbursement Completed & Telemetry Emitted
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 3. CASHIER & PAYMENT REGISTER */}
      {/* ============================================================= */}
      {activeNavTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-purple-400" />
                  Cashier Desk & Student Payment Register
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Search live payment transactions, verify bank teller drafts, and issue official stamp receipts.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search invoice or reference..."
                    value={paymentSearch}
                    onChange={e => setPaymentSearch(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-950/60 border-y border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Invoice / Ref No</th>
                    <th className="py-3 px-4">Student & Session</th>
                    <th className="py-3 px-4">Fee Item</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment Channel</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-850">
                      <td className="py-3 px-4 font-bold text-blue-400">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 font-sans text-slate-300">
                        <div>STU-2026-00124</div>
                        <div className="text-[10px] text-slate-500">{inv.session}</div>
                      </td>
                      <td className="py-3 px-4 font-sans font-medium text-white">{inv.title}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">${inv.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-400 font-sans">Bank Transfer / Paystack</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenPaymentReceipt(inv)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 ml-auto cursor-pointer transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Letterhead Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 4. LEDGER RECONCILIATION */}
      {/* ============================================================= */}
      {activeNavTab === 'reconciliation' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  Automated Bank Statement Ledger Reconciliation
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reconciling an invoice automatically emits the <code className="text-emerald-400 font-mono">TUITION_FEES_CLEARED</code> cross-portal event to Student & Exams.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-950/60 border-y border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Invoice No</th>
                    <th className="py-3 px-4">Session / Semester</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4 text-right">Segregated Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {studentInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-850">
                      <td className="py-3 px-4 font-bold text-blue-400">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 text-slate-300">{inv.session}</td>
                      <td className="py-3 px-4 font-sans font-medium text-white">{inv.title}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">${inv.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleReconcile(inv.id)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
                        >
                          Reconcile & Clear
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. FEE STRUCTURES & SCHEDULES */}
      {/* ============================================================= */}
      {activeNavTab === 'fee_structures' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-purple-400" />
                Approved University Fee Schedules & Levies
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Itemized academic session fees approved by the University Governing Council.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 font-bold block uppercase">Faculty of Computing</span>
                <div className="text-white text-base font-bold">$1,200.00 / Semester</div>
                <div className="text-slate-400 space-y-1 text-[11px] pt-1 border-t border-slate-800">
                  <div>• Tuition: $850.00</div>
                  <div>• Software Lab Levy: $150.00</div>
                  <div>• ICT & Broadband: $100.00</div>
                  <div>• Medical & Insurance: $100.00</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 font-bold block uppercase">Faculty of Engineering</span>
                <div className="text-white text-base font-bold">$1,450.00 / Semester</div>
                <div className="text-slate-400 space-y-1 text-[11px] pt-1 border-t border-slate-800">
                  <div>• Tuition: $950.00</div>
                  <div>• Workshop & Machinery: $250.00</div>
                  <div>• Safety Gear & PPE: $150.00</div>
                  <div>• Medical & Insurance: $100.00</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 font-bold block uppercase">Postgraduate / Doctoral</span>
                <div className="text-white text-base font-bold">$2,100.00 / Semester</div>
                <div className="text-slate-400 space-y-1 text-[11px] pt-1 border-t border-slate-800">
                  <div>• Research Bench Fee: $1,200.00</div>
                  <div>• Thesis Supervision: $500.00</div>
                  <div>• Journal Access: $250.00</div>
                  <div>• Defense Examination: $150.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 6. FINANCE MONITOR & AUDITS */}
      {/* ============================================================= */}
      {activeNavTab === 'monitor' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Real-Time Fiscal Telemetry & Anti-Fraud Audit Engine
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live monitoring of payment gateways, cashier transaction streams, and automated dual-custody audit logs.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Audit Stream: HEALTHY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">Payment Gateway Status</span>
                <div className="text-emerald-400 text-sm font-bold">M-Pesa Daraja / Bank Gateway</div>
                <p className="text-[11px] text-slate-400">Webhook endpoints active</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">Transaction Integrity</span>
                <div className="text-white text-sm font-bold">Idempotency Enforced</div>
                <p className="text-[11px] text-slate-400">PostgreSQL Transactional Isolation</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
                <span className="text-slate-400 uppercase font-bold block">Disbursement Velocity</span>
                <div className="text-blue-300 text-sm font-bold">&lt; 2.4 Hours Avg Turnaround</div>
                <p className="text-[11px] text-slate-400">4-Stage Workflow Throughput</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
