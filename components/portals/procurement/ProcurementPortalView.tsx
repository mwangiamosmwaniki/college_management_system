'use client';

import React, { useState } from 'react';
import {
  PackageCheck,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Building,
  DollarSign,
  FileSpreadsheet,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useERP } from '@/context/erp-context';
import { INITIAL_PROCUREMENT_REQUISITIONS, INITIAL_STORE_INVENTORY } from '@/lib/kenyan-tvet-data';
import { ProcurementRequisition, StoreInventoryItem } from '@/types/erp';

export default function ProcurementPortalView() {
  const { institutionalSettings, openInstitutionalDocument, currentUser } = useERP();

  const [activeTab, setActiveTab] = useState<'REQUISITIONS' | 'INVENTORY' | 'PURCHASE_ORDERS'>('REQUISITIONS');
  const [requisitions, setRequisitions] = useState<ProcurementRequisition[]>(INITIAL_PROCUREMENT_REQUISITIONS);
  const [inventory, setInventory] = useState<StoreInventoryItem[]>(INITIAL_STORE_INVENTORY);

  // New Requisition Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newReq, setNewReq] = useState({
    title: '',
    departmentName: 'Department of Computing & Applied Sciences',
    estimatedCost: 45000,
    justification: ''
  });

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const nextSeq = requisitions.length + 1;
    const created: ProcurementRequisition = {
      id: `req_custom_${nextSeq}`,
      requisitionNumber: `REQ-2026-${String(nextSeq).padStart(3, '0')}`,
      departmentId: 'dept_computing',
      departmentName: newReq.departmentName,
      requisitionerId: currentUser.id,
      requisitionerName: currentUser.name,
      title: newReq.title || 'General Laboratory Supplies',
      items: [
        {
          id: `item_${nextSeq}_1`,
          itemName: newReq.title || 'Technical Supplies',
          specification: newReq.justification || 'Required for training workshops',
          quantityRequested: 10,
          unitOfMeasure: 'Units',
          estimatedUnitPrice: newReq.estimatedCost / 10,
          totalPrice: newReq.estimatedCost
        }
      ],
      totalEstimatedCost: newReq.estimatedCost,
      status: 'SUBMITTED',
      createdAt: '2026-05-18',
      hodApprovalStatus: 'APPROVED'
    };

    setRequisitions(prev => [created, ...prev]);
    setIsNewModalOpen(false);
    setNewReq({ title: '', departmentName: 'Department of Computing & Applied Sciences', estimatedCost: 45000, justification: '' });
  };

  const handleApproveRequisition = (id: string, status: ProcurementRequisition['status']) => {
    setRequisitions(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handlePrintLPO = (req: ProcurementRequisition) => {
    openInstitutionalDocument({
      docType: 'CUSTOM_REPORT',
      title: 'LOCAL PURCHASE ORDER (LPO)',
      subtitle: `Procurement & Supplies Directorate • LPO Ref: LPO/2026/${req.requisitionNumber}`,
      recipientName: 'Approved Contracted Institutional Vendor',
      issueDate: new Date().toISOString().split('T')[0],
      contentBody: `Please supply and deliver the following workshop and training supplies to Kenya Technical & Vocational Training College Central Stores pursuant to requisition ${req.requisitionNumber} for ${req.departmentName}.`,
      tableData: {
        headers: ['Item Name', 'Specification', 'Qty', 'Unit Price (KES)', 'Total Amount (KES)'],
        rows: req.items.map(i => [
          i.itemName,
          i.specification || i.purpose || 'Institutional use',
          `${i.quantityRequested || i.quantity || 1} ${i.unitOfMeasure || 'Units'}`,
          `KES ${(i.estimatedUnitPrice || i.estimatedUnitCost || 0).toLocaleString()}`,
          `KES ${(i.totalPrice || (i.estimatedUnitCost || 0) * (i.quantity || 1)).toLocaleString()}`
        ])
      },
      signatoryName: 'Head of Procurement',
      signatoryTitle: 'Procurement & Supplies Directorate'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xl shadow">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-orange-400 font-semibold">
                Procurement & Stores Directorate
              </span>
              <h1 className="text-xl font-bold">Procurement, Stores & Inventory Portal</h1>
              <p className="text-xs text-slate-400">
                Departmental Requisitions, Purchase Orders & Store Stock Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('REQUISITIONS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'REQUISITIONS' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Requisitions Queue
            </button>
            <button
              onClick={() => setActiveTab('INVENTORY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'INVENTORY' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Store Inventory
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* TAB 1: REQUISITIONS QUEUE */}
        {activeTab === 'REQUISITIONS' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Department Procurement Requisitions</h2>
                <p className="text-xs text-slate-500">Track multi-tier approval workflow from HOD to Procurement & Bursary.</p>
              </div>

              <button
                onClick={() => setIsNewModalOpen(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Requisition</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-y border-slate-200 text-slate-600 font-bold uppercase">
                    <th className="p-3">Req No</th>
                    <th className="p-3">Department & Title</th>
                    <th className="p-3">Requisitioner</th>
                    <th className="p-3">Estimated Cost</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {requisitions.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-orange-900">{req.requisitionNumber}</td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{req.title}</span>
                        <span className="text-[11px] text-slate-500">{req.departmentName}</span>
                      </td>
                      <td className="p-3 font-semibold">{req.requisitionerName}</td>
                      <td className="p-3 font-bold text-emerald-700">KES {req.totalEstimatedCost.toLocaleString()}</td>
                      <td className="p-3 text-slate-500">{req.createdAt}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          req.status === 'PO_ISSUED' || req.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'APPROVED_PROCUREMENT'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {req.status === 'SUBMITTED' && (
                            <button
                              onClick={() => handleApproveRequisition(req.id, 'APPROVED_PROCUREMENT')}
                              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-[11px]"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handlePrintLPO(req)}
                            className="px-2.5 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded font-semibold text-[11px] flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>LPO</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: STORE INVENTORY */}
        {activeTab === 'INVENTORY' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Institutional Central Stores Inventory</h2>
              <p className="text-xs text-slate-500">Live stock ledger for workshop consumables, electrical components, and stationery.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-y border-slate-200 text-slate-600 font-bold uppercase">
                    <th className="p-3">Item Code & Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Stock Available</th>
                    <th className="p-3">Reorder Threshold</th>
                    <th className="p-3">Unit Valuation</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {inventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <span className="font-mono font-bold text-slate-900 block">{item.itemCode}</span>
                        <span className="font-semibold text-slate-900">{item.itemName}</span>
                      </td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3 font-bold text-slate-900">{item.quantityInStock} {item.unitOfMeasure}</td>
                      <td className="p-3 text-slate-500">{item.reorderLevel} {item.unitOfMeasure}</td>
                      <td className="p-3 font-semibold text-emerald-700">KES {item.unitCost.toLocaleString()}</td>
                      <td className="p-3">
                        {item.quantityInStock <= item.reorderLevel ? (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[11px]">
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            SUFFICIENT
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* NEW REQUISITION MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Create Departmental Requisition</h3>
            <form onSubmit={handleCreateRequisition} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requisition Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Training Boards & Breadboards"
                  value={newReq.title}
                  onChange={e => setNewReq({ ...newReq, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Budget (KES) *</label>
                <input
                  type="number"
                  required
                  value={newReq.estimatedCost}
                  onChange={e => setNewReq({ ...newReq, estimatedCost: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Justification</label>
                <textarea
                  rows={3}
                  placeholder="Explain why this purchase is essential for training or workshop sessions..."
                  value={newReq.justification}
                  onChange={e => setNewReq({ ...newReq, justification: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
