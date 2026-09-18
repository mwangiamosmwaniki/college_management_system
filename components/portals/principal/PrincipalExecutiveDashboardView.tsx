'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Users,
  DollarSign,
  Award,
  Building,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { useERP } from '@/context/erp-context';

export default function PrincipalExecutiveDashboardView() {
  const { institutionalSettings, openInstitutionalDocument, activeNavTab, setActiveNavTab } = useERP();

  const activeTab: 'OVERVIEW' | 'FINANCIALS' | 'ACADEMIC_KPIS' | 'GOVERNANCE' = 
    activeNavTab === 'academics' ? 'ACADEMIC_KPIS' :
    activeNavTab === 'financials' || activeNavTab === 'finance' ? 'FINANCIALS' :
    activeNavTab === 'governance' || activeNavTab === 'reports' ? 'GOVERNANCE' : 'OVERVIEW';

  const setActiveTab = (tab: 'OVERVIEW' | 'FINANCIALS' | 'ACADEMIC_KPIS' | 'GOVERNANCE') => {
    const tabMap: Record<string, string> = {
      ACADEMIC_KPIS: 'academics',
      FINANCIALS: 'financials',
      GOVERNANCE: 'governance',
      OVERVIEW: 'dashboard'
    };
    setActiveNavTab(tabMap[tab] || 'dashboard');
  };

  const handlePrintExecutiveReport = () => {
    openInstitutionalDocument({
      docType: 'CUSTOM_REPORT',
      title: 'EXECUTIVE INSTITUTIONAL PERFORMANCE & FINANCIAL REPORT',
      subtitle: `${institutionalSettings.name} • 2026/2027 Academic Year`,
      recipientName: 'Board of Governors / Principal Executive Council',
      issueDate: new Date().toISOString().split('T')[0],
      academicSession: '2026/2027 Academic Year',
      contentBody: `Comprehensive institutional intelligence summary presented by the Principal & CEO.\n\nInstitutional Health Index: 98.4%\nTotal Active Trainee Population: 3,420 Trainees across 3 Campuses.\nFee Collection Rate: 88.2% of Projected Annual Target.\nTVETA & KNEC Compliance: 100% Accredited.`,
      tableData: {
        headers: ['Performance Metric', 'Current Value', 'Target', 'Status'],
        rows: [
          ['Total Trainee Enrollment', '3,420 Trainees', '3,500 Trainees', '97.7% of Target'],
          ['Term 1 Fee Revenue Collected', 'KES 48,250,000', 'KES 52,000,000', '92.8% Collected'],
          ['KNEC / CDACC Examination Pass Rate', '94.8%', '90.0%', 'Exceeded Target (+4.8%)'],
          ['Industrial Attachment Placement Rate', '100%', '100%', '100% Placed'],
          ['Government Capitation & HELB Inflow', 'KES 18,400,000', 'KES 20,000,000', 'Disbursed by MoE']
        ]
      },
      signatoryName: institutionalSettings.viceChancellorName,
      signatoryTitle: institutionalSettings.viceChancellorTitle
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
                Executive Leadership & Governance
              </span>
              <h1 className="text-xl font-bold">Principal & CEO Strategic Dashboard</h1>
              <p className="text-xs text-slate-400">
                Institutional Executive Intelligence • Principal: {institutionalSettings.viceChancellorName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
              <button
                onClick={() => { setActiveTab('OVERVIEW'); setActiveNavTab('dashboard'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'OVERVIEW' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Executive Overview
              </button>
              <button
                onClick={() => { setActiveTab('FINANCIALS'); setActiveNavTab('finance'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'FINANCIALS' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Financial Intelligence
              </button>
              <button
                onClick={() => { setActiveTab('ACADEMIC_KPIS'); setActiveNavTab('academics'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'ACADEMIC_KPIS' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Academic & TVETA KPIs
              </button>
              <button
                onClick={() => { setActiveTab('GOVERNANCE'); setActiveNavTab('reports'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'GOVERNANCE' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Governance & Gazettes
              </button>
            </div>

            <button
              onClick={handlePrintExecutiveReport}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Gazette PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* KPI Cards (Always visible at glance) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrollment</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">3,420</div>
            <div className="flex items-center text-xs text-emerald-600 font-semibold gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.4% vs 2025</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue Collected</span>
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">KES 48.2M</div>
            <div className="flex items-center text-xs text-purple-600 font-semibold gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>92.8% of Term Target</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">KNEC / CDACC Pass</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">94.8%</div>
            <div className="text-xs text-slate-500">
              Ranked Top 3 TVET Nationally
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attachment Rate</span>
              <ShieldCheck className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">100%</div>
            <div className="text-xs text-slate-500">
              410 Trainees placed in industry
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & BREAKDOWNS */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Performance */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Departmental Enrollment & Revenue Performance</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Computing & Applied Sciences (1,240 Trainees)</span>
                    <span className="text-emerald-700">KES 18.6M</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full w-[85%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Electrical & Electronics Engineering (890 Trainees)</span>
                    <span className="text-emerald-700">KES 14.2M</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full w-[70%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Building & Civil Engineering (680 Trainees)</span>
                    <span className="text-emerald-700">KES 9.8M</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full w-[55%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Business, Accounting & Management (610 Trainees)</span>
                    <span className="text-emerald-700">KES 5.6M</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full w-[45%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Channels */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Revenue Inflow Channels (Term 1 2026)</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <div className="text-emerald-800 font-semibold">Lipa na M-Pesa (Paybill 247247)</div>
                  <div className="text-lg font-bold text-emerald-950">KES 26.4M</div>
                  <div className="text-[11px] text-emerald-700">Direct real-time trainee settlements</div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                  <div className="text-blue-800 font-semibold">HELB & GoK Capitation</div>
                  <div className="text-lg font-bold text-blue-950">KES 14.8M</div>
                  <div className="text-[11px] text-blue-700">State Department for TVET</div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="text-amber-800 font-semibold">County Bursaries & CDF</div>
                  <div className="text-lg font-bold text-amber-950">KES 4.2M</div>
                  <div className="text-[11px] text-amber-700">Disbursed by NG-CDF & Counties</div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                  <div className="text-purple-800 font-semibold">Direct Bank Transfers</div>
                  <div className="text-lg font-bold text-purple-950">KES 2.8M</div>
                  <div className="text-[11px] text-purple-700">Corporate & sponsor EFTs</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINANCIAL INTELLIGENCE */}
        {activeTab === 'FINANCIALS' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Institutional Financial Position & Operating Cash Flow</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-semibold text-emerald-800">Total Billed Tuition & Amenities</span>
                <div className="text-2xl font-bold text-emerald-950">KES 52,000,000</div>
                <p className="text-emerald-700">Annual projected tuition revenue</p>
              </div>
              <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <span className="font-semibold text-blue-800">Net Collections Realized</span>
                <div className="text-2xl font-bold text-blue-950">KES 48,250,000</div>
                <p className="text-blue-700">92.8% collection efficiency rate</p>
              </div>
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-semibold text-amber-800">Outstanding Trainee Fee Balances</span>
                <div className="text-2xl font-bold text-amber-950">KES 3,750,000</div>
                <p className="text-amber-700">Under structured fee-recovery plans</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACADEMIC & TVETA KPIS */}
        {activeTab === 'ACADEMIC_KPIS' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Academic Quality & TVETA Compliance Standards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 text-sm">KNEC / CDACC Accreditation & Pass Series</div>
                <p className="text-slate-600">All 14 diploma and certificate programs are fully approved and compliant with TVETA Kenya standards.</p>
                <div className="font-semibold text-emerald-700">Pass Rate: 94.8% • Drop-out Rate: &lt; 1.2%</div>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 text-sm">Industrial Liaison & Attachment Placements</div>
                <p className="text-slate-600">100% of eligible trainees placed with leading Kenyan engineering firms, county offices, and tech enterprises.</p>
                <div className="font-semibold text-teal-700">410 Active Placements • 100% Placement Record</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GOVERNANCE & GAZETTES */}
        {activeTab === 'GOVERNANCE' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Board of Governors Reports & Statutory Gazettes</h3>
                <p className="text-xs text-slate-500">Official certified executive summaries prepared for council and Ministry of Education oversight.</p>
              </div>
              <button
                onClick={handlePrintExecutiveReport}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Council Gazette</span>
              </button>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
              <strong>Institutional Gazette 2026/2027:</strong> All institutional audits, staffing records, and TVET capitation allocations are certified for presentation to the Board of Governors.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
