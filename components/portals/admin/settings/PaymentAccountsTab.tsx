'use client';

import React, { useState } from 'react';
import { SchoolPaymentAccount, InstitutionalSettings } from '@/types/erp';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Edit2,
  Trash2,
  X,
  Save,
  Building,
  Smartphone
} from 'lucide-react';

interface PaymentAccountsTabProps {
  settings: InstitutionalSettings;
  onUpdate: (updated: Partial<InstitutionalSettings>, message: string) => void;
}

export function PaymentAccountsTab({ settings, onUpdate }: PaymentAccountsTabProps) {
  const accounts = settings.paymentAccounts || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SchoolPaymentAccount | null>(null);
  const [formData, setFormData] = useState<Partial<SchoolPaymentAccount>>({
    label: '',
    bankOrProvider: 'Kenya Commercial Bank (KCB)',
    accountNumber: '',
    accountName: 'Kenya TVET College',
    branch: '',
    paybillOrTill: '',
    purpose: 'TUITION_FEES',
    status: 'ACTIVE'
  });

  const filteredAccounts = accounts.filter(a => {
    return (
      a.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.bankOrProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleOpenAddModal = () => {
    setEditingAccount(null);
    setFormData({
      id: `acc_${Date.now().toString().slice(-6)}`,
      label: 'New Payment Collection A/C',
      bankOrProvider: 'Kenya Commercial Bank (KCB)',
      accountNumber: '',
      accountName: settings.name || 'Kenya TVET College Operations',
      branch: 'Main Nairobi Branch',
      paybillOrTill: '',
      purpose: 'TUITION_FEES',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (acc: SchoolPaymentAccount) => {
    setEditingAccount(acc);
    setFormData({ ...acc });
    setIsModalOpen(true);
  };

  const handleDeleteAccount = (id: string, label: string) => {
    if (confirm(`Are you sure you want to delete payment account "${label}"? This action cannot be undone.`)) {
      const updated = accounts.filter(a => a.id !== id);
      onUpdate({ paymentAccounts: updated }, `Payment account "${label}" deleted.`);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = accounts.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        return { ...a, status: nextStatus as 'ACTIVE' | 'INACTIVE' };
      }
      return a;
    });
    onUpdate({ paymentAccounts: updated }, 'Payment account status toggled.');
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label?.trim() || !formData.accountNumber?.trim()) {
      alert('Please provide an account label and account number.');
      return;
    }

    let updated: SchoolPaymentAccount[];
    if (editingAccount) {
      updated = accounts.map(a => (a.id === editingAccount.id ? ({ ...a, ...formData } as SchoolPaymentAccount) : a));
      onUpdate({ paymentAccounts: updated }, `Payment account "${formData.label}" updated.`);
    } else {
      const newAcc: SchoolPaymentAccount = {
        id: formData.id || `acc_${Date.now().toString().slice(-6)}`,
        label: formData.label || '',
        bankOrProvider: formData.bankOrProvider || 'Commercial Bank',
        accountNumber: formData.accountNumber || '',
        accountName: formData.accountName || settings.name,
        branch: formData.branch || '',
        paybillOrTill: formData.paybillOrTill || '',
        purpose: formData.purpose || 'TUITION_FEES',
        status: formData.status || 'ACTIVE'
      };
      updated = [...accounts, newAcc];
      onUpdate({ paymentAccounts: updated }, `Payment account "${newAcc.label}" added.`);
    }
    setIsModalOpen(false);
  };

  const getPurposeBadge = (purpose: SchoolPaymentAccount['purpose']) => {
    switch (purpose) {
      case 'TUITION_FEES':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">Tuition & Capitation</span>;
      case 'EXAMINATION_FEES':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">KNEC / Examination</span>;
      case 'ACCOMMODATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">Hostel & Housing</span>;
      case 'APPLICATION_FEE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Admissions & Processing</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">General Operations</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search bank, account number or purpose..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Payment Account
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAccounts.map(acc => (
          <div
            key={acc.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400">
                    {acc.bankOrProvider.toLowerCase().includes('mpesa') || acc.bankOrProvider.toLowerCase().includes('safaricom') ? (
                      <Smartphone className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Building className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{acc.label}</h4>
                      {getPurposeBadge(acc.purpose)}
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{acc.bankOrProvider}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(acc.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                    acc.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {acc.status}
                </button>
              </div>

              {/* Account Number Box with copy */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">Account / Paybill Number</div>
                  <div className="text-base font-mono font-black text-white tracking-wider mt-0.5">
                    {acc.accountNumber}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(acc.accountNumber, acc.id)}
                  className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition cursor-pointer"
                  title="Copy Account Number"
                >
                  {copiedId === acc.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500">Account Name:</span>{' '}
                  <strong className="text-slate-200">{acc.accountName}</strong>
                </div>
                {acc.branch && (
                  <div>
                    <span className="text-slate-500">Branch:</span>{' '}
                    <strong className="text-slate-200">{acc.branch}</strong>
                  </div>
                )}
                {acc.paybillOrTill && (
                  <div>
                    <span className="text-slate-500">Paybill/Till:</span>{' '}
                    <strong className="text-amber-400">{acc.paybillOrTill}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleOpenEditModal(acc)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDeleteAccount(acc.id, acc.label)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredAccounts.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-3">
            <CreditCard className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No payment accounts found</p>
            <p className="text-xs text-slate-500">Register an institutional bank account or official M-Pesa paybill.</p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              Add Payment Account
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                {editingAccount ? 'Edit Payment Account' : 'Register Payment Account'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-300">Account Label / Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.label || ''}
                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g. KCB Main Tuition Collection Account"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Bank or Provider *</label>
                  <input
                    type="text"
                    required
                    value={formData.bankOrProvider || ''}
                    onChange={e => setFormData({ ...formData, bankOrProvider: e.target.value })}
                    placeholder="e.g. Kenya Commercial Bank (KCB)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Account / Paybill Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.accountNumber || ''}
                    onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="e.g. 1102938475"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Account Holder Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.accountName || ''}
                    onChange={e => setFormData({ ...formData, accountName: e.target.value })}
                    placeholder="e.g. Kenya TVET College Operations"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Bank Branch</label>
                  <input
                    type="text"
                    value={formData.branch || ''}
                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="e.g. Moi Avenue Branch, Nairobi"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Purpose Category</label>
                  <select
                    value={formData.purpose || 'TUITION_FEES'}
                    onChange={e => setFormData({ ...formData, purpose: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="TUITION_FEES">Tuition & Capitation Fees</option>
                    <option value="EXAMINATION_FEES">KNEC / Examination Fees</option>
                    <option value="ACCOMMODATION">Accommodation & Hostel</option>
                    <option value="APPLICATION_FEE">Admissions & Application Fee</option>
                    <option value="GENERAL">General Operational Collection</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Operational Status</label>
                  <select
                    value={formData.status || 'ACTIVE'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">Active & Accepting Payments</option>
                    <option value="INACTIVE">Inactive / Reconciling</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {editingAccount ? 'Save Changes' : 'Register Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
