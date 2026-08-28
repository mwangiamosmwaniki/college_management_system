'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalDataLifecycleManager } from '@/components/common/PortalDataLifecycleManager';
import {
  Building2,
  Home,
  CheckCircle2,
  AlertTriangle,
  Key,
  Wrench,
  Search,
  Users,
  ShieldCheck,
  Activity,
  Plus,
  Filter,
  Layers,
  Bed,
  DoorOpen,
  Sparkles
} from 'lucide-react';

export function HostelPortalView() {
  const { currentUser, activeNavTab, publishCrossPortalEvent } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [selectedHall, setSelectedHall] = useState('Nelson Mandela Hall');

  const [hostelStats, setHostelStats] = useState({
    totalBeds: 1850,
    occupiedBeds: 1650,
    maintenanceOpen: 4
  });

  const [residents, setResidents] = useState([
    { id: 'RES-001', name: 'Sophia Chen', matric: 'MAT/2026/0125', hall: 'Queen Elizabeth Hall', block: 'Block A', room: 'Room 102', bed: 'Bed 1', keyIssued: true, clearanceStatus: 'CLEARED' },
    { id: 'RES-002', name: 'Liam Davies', matric: 'MAT/2026/0126', hall: 'Nelson Mandela Hall', block: 'Block C', room: 'Room 204', bed: 'Bed 2', keyIssued: true, clearanceStatus: 'CLEARED' },
    { id: 'RES-003', name: 'Amara Okafor', matric: 'MAT/2026/0127', hall: 'Queen Elizabeth Hall', block: 'Block B', room: 'Room 312', bed: 'Bed 4', keyIssued: true, clearanceStatus: 'PENDING' },
    { id: 'RES-004', name: 'David K. Osei', matric: 'MAT/2026/0128', hall: 'Alexander Fleming Hall', block: 'Block B', room: 'Room 310', bed: 'Bed 4', keyIssued: false, clearanceStatus: 'PENDING' },
  ]);

  const [maintenanceTickets, setMaintenanceTickets] = useState([
    { id: 'MNT-881', hall: 'Nelson Mandela Hall', room: 'Block C, Room 204', category: 'Plumbing', issue: 'Shower mixer leakage', priority: 'HIGH', status: 'IN_PROGRESS', artisan: 'John K. (Plumber)' },
    { id: 'MNT-882', hall: 'Queen Elizabeth Hall', room: 'Block A, Room 102', category: 'Electrical', issue: 'Ceiling fan capacitor replacement', priority: 'MEDIUM', status: 'OPEN', artisan: 'Unassigned' },
    { id: 'MNT-883', hall: 'Alexander Fleming Hall', room: 'Block B, Common Room', category: 'HVAC', issue: 'Air conditioning filter cleaning', priority: 'LOW', status: 'RESOLVED', artisan: 'David T. (AC Tech)' },
  ]);

  const [availableBeds, setAvailableBeds] = useState([
    { hall: 'Nelson Mandela Hall', room: 'Room 205', bed: 'Bed 1', type: 'Double Room' },
    { hall: 'Nelson Mandela Hall', room: 'Room 205', bed: 'Bed 2', type: 'Double Room' },
    { hall: 'Queen Elizabeth Hall', room: 'Room 104', bed: 'Bed 1', type: 'En-suite Quad' },
    { hall: 'Alexander Fleming Hall', room: 'Room 315', bed: 'Bed 3', type: 'Double Room' },
  ]);

  const handleAllocateBed = (bedItem: typeof availableBeds[0]) => {
    setAvailableBeds(prev => prev.filter(b => !(b.hall === bedItem.hall && b.room === bedItem.room && b.bed === bedItem.bed)));
    setFeedbackMessage(`Allocated ${bedItem.hall}, ${bedItem.room} (${bedItem.bed})! Allocation pass issued.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleResolveTicket = (tId: string) => {
    setMaintenanceTickets(prev =>
      prev.map(t => (t.id === tId ? { ...t, status: 'RESOLVED' } : t))
    );
    setFeedbackMessage(`Maintenance ticket ${tId} marked as resolved! Room condition verified.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleSignClearance = (resId: string) => {
    setResidents(prev =>
      prev.map(r => (r.id === resId ? { ...r, clearanceStatus: 'CLEARED' } : r))
    );
    setFeedbackMessage(`Hostel room clearance approved for ${resId}! Key returned and inventory intact.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const filteredResidents = residents.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.matric.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.hall.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/70 via-slate-900 to-amber-950/70 border border-orange-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Student Housing & Residence Directorate
            </span>
            <span className="text-xs text-slate-400 font-mono">Academic Year 2026/2027</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Campus Accommodation & Hostel Services
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Bed space allocations, room inventories, residential maintenance work orders, and end-of-session hall clearance.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Overall Occupancy</span>
          <span className="text-xl font-black text-orange-400 font-mono">89.2%</span>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* ============================================================= */}
      {/* 1. HOSTEL DASHBOARD */}
      {/* ============================================================= */}
      {(activeNavTab === 'dashboard' || !activeNavTab) && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Total Bed Spaces</span>
              <div className="text-white text-xl font-bold">{hostelStats.totalBeds} Beds</div>
              <span className="text-slate-400 text-[10px]">Across 4 Residence Halls</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Occupied Beds</span>
              <div className="text-orange-400 text-xl font-bold">{hostelStats.occupiedBeds} Beds</div>
              <span className="text-emerald-400 text-[10px]">Fee Clearance Verified</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Vacant Beds</span>
              <div className="text-emerald-400 text-xl font-bold">
                {hostelStats.totalBeds - hostelStats.occupiedBeds} Beds
              </div>
              <span className="text-blue-400 text-[10px]">Ready for Booking</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Maintenance Tickets</span>
              <div className="text-amber-400 text-xl font-bold">
                {maintenanceTickets.filter(t => t.status !== 'RESOLVED').length} Open
              </div>
              <span className="text-slate-400 text-[10px]">Artisans Active</span>
            </div>
          </div>

          {/* Residence Halls Capacity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Nelson Mandela Hall</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Male Undergrad
                </span>
              </div>
              <p className="text-xs text-slate-400">Capacity: 600 Beds • 540 Occupied (90%)</p>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex justify-between pt-1">
                <span>Warden: Dr. T. Adeyemi</span>
                <span className="text-emerald-400">60 Beds Vacant</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Queen Elizabeth Hall</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Female Undergrad
                </span>
              </div>
              <p className="text-xs text-slate-400">Capacity: 650 Beds • 610 Occupied (93.8%)</p>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '93.8%' }}></div>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex justify-between pt-1">
                <span>Warden: Dr. Grace Obi</span>
                <span className="text-emerald-400">40 Beds Vacant</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Alexander Fleming Hall</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Postgraduate / Mixed
                </span>
              </div>
              <p className="text-xs text-slate-400">Capacity: 600 Beds • 500 Occupied (83.3%)</p>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '83.3%' }}></div>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex justify-between pt-1">
                <span>Warden: Prof. M. K. Bello</span>
                <span className="text-emerald-400">100 Beds Vacant</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 1.5. HOSTEL INVENTORY & ASSET LIFECYCLE */}
      {/* ============================================================= */}
      {activeNavTab === 'data_lifecycle' && (
        <PortalDataLifecycleManager
          portalId="HOSTEL"
          allowedEntityTypes={['STUDENT']}
          title="Hostel Resident & Bed-Space Record Governance"
          subtitle="Governed resident allocations, room inventory states, damage reporting records, and hall clearance validations."
        />
      )}

      {/* ============================================================= */}
      {/* 2. ROOM & BED ALLOCATION */}
      {/* ============================================================= */}
      {activeNavTab === 'allocation' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bed className="w-5 h-5 text-orange-400" />
                  Room & Bed Space Allocation Studio
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Allocate available hall rooms to matriculated students with verified tuition & hostel fee clearance.
                </p>
              </div>

              <select
                value={selectedHall}
                onChange={e => setSelectedHall(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none"
              >
                <option value="Nelson Mandela Hall">Nelson Mandela Hall (Male)</option>
                <option value="Queen Elizabeth Hall">Queen Elizabeth Hall (Female)</option>
                <option value="Alexander Fleming Hall">Alexander Fleming Hall (PG)</option>
              </select>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Available Vacant Bed Spaces ({availableBeds.filter(b => b.hall === selectedHall).length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availableBeds.filter(b => b.hall === selectedHall).map((bed, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{bed.room}</span>
                      <span className="font-mono text-emerald-400 font-bold">{bed.bed}</span>
                    </div>
                    <p className="text-slate-400 font-mono text-[11px]">{bed.type} • AC & High-Speed WiFi</p>
                    <button
                      onClick={() => handleAllocateBed(bed)}
                      className="w-full mt-2 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition shadow-sm"
                    >
                      Reserve & Allocate Bed
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 3. RESIDENTS DIRECTORY */}
      {/* ============================================================= */}
      {activeNavTab === 'residents' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  Hostel Hall Residents & Key Roster
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified occupants, assigned blocks, emergency contacts, and key issuance records.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search resident or matric..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-950/60 border-y border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Resident ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Matric No</th>
                    <th className="py-3 px-4">Residence Hall</th>
                    <th className="py-3 px-4">Block & Room</th>
                    <th className="py-3 px-4">Bed Space</th>
                    <th className="py-3 px-4">Key Issued</th>
                    <th className="py-3 px-4">Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {filteredResidents.map(r => (
                    <tr key={r.id} className="hover:bg-slate-850">
                      <td className="py-3 px-4 font-bold text-blue-400">{r.id}</td>
                      <td className="py-3 px-4 font-sans font-medium text-white">{r.name}</td>
                      <td className="py-3 px-4 text-slate-300">{r.matric}</td>
                      <td className="py-3 px-4 text-slate-300 font-sans">{r.hall}</td>
                      <td className="py-3 px-4 text-slate-400">{r.block}, {r.room}</td>
                      <td className="py-3 px-4 font-bold text-orange-400">{r.bed}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          r.keyIssued
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {r.keyIssued ? 'Issued' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          r.clearanceStatus === 'CLEARED'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          {r.clearanceStatus}
                        </span>
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
      {/* 4. MAINTENANCE REQUESTS */}
      {/* ============================================================= */}
      {activeNavTab === 'maintenance' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-400" />
                  Facility Maintenance Work Orders & Repairs
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track plumbing, electrical, HVAC, and carpentry repairs across campus halls.
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {maintenanceTickets.filter(t => t.status !== 'RESOLVED').length} Active Work Orders
              </span>
            </div>

            <div className="space-y-3">
              {maintenanceTickets.map(t => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{t.issue}</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        t.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Ticket: <strong className="text-blue-300">{t.id}</strong> • Location: {t.hall} ({t.room}) • Category: {t.category} • Assigned: {t.artisan}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {t.status !== 'RESOLVED' ? (
                      <button
                        onClick={() => handleResolveTicket(t.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        Mark Work Done & Resolved
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Repaired & Closed
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
      {/* 5. HOSTEL HALL CLEARANCE */}
      {/* ============================================================= */}
      {activeNavTab === 'clearance' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
                End-of-Session Hall Inspection & Clearance Desk
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify bed condition, inspect electrical fixtures, confirm physical room key handover, and stamp final clearance.
              </p>
            </div>

            <div className="space-y-3">
              {residents.map(r => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{r.name}</span>
                      <span className="font-mono text-blue-400">({r.matric})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {r.hall} • {r.block}, {r.room} ({r.bed})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {r.clearanceStatus === 'CLEARED' ? (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Clearance Verified & Key Handed In
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSignClearance(r.id)}
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        Inspect Room & Grant Clearance
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
