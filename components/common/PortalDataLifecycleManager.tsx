'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import {
  CrudEntityType,
  CrudOperation,
  CrudRecordMeta,
  LifecycleState,
  CrudScope,
  PortalId
} from '@/types/erp';
import {
  IMPORT_EXPORT_SCHEMAS,
  evaluateCrudPermission,
  isRecordOwner
} from '@/lib/crud-lifecycle-engine';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Play,
  X,
  Lock,
  Unlock,
  Archive,
  RotateCcw,
  Trash2,
  FileDown,
  FileUp,
  Copy,
  Edit3,
  Plus,
  Search,
  Filter,
  Layers,
  ShieldCheck,
  ArrowRight,
  History,
  FileText,
  Send,
  Check,
  CheckSquare,
  UserCheck,
  UserX
} from 'lucide-react';

interface PortalDataLifecycleManagerProps {
  portalId: PortalId;
  allowedEntityTypes: CrudEntityType[];
  title?: string;
  subtitle?: string;
  defaultEntityType?: CrudEntityType;
}

export function PortalDataLifecycleManager({
  portalId,
  allowedEntityTypes,
  title,
  subtitle,
  defaultEntityType
}: PortalDataLifecycleManagerProps) {
  const {
    crudEntities,
    currentUser,
    executeCrudOperation,
    executeBulkCrud,
    executeImportDataset,
    executeExportDataset,
    executeCloneEntity
  } = useERP();

  const [selectedEntityType, setSelectedEntityType] = useState<CrudEntityType>(
    defaultEntityType || allowedEntityTypes[0] || 'COURSE'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [ownershipFilter, setOwnershipFilter] = useState<'ALL' | 'MINE' | 'PEERS'>('ALL');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkOperation, setBulkOperation] = useState<CrudOperation>('archive');
  const [bulkReason, setBulkReason] = useState('Authorized administrative batch lifecycle update.');

  // Create / Edit modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [actionReason, setActionReason] = useState('');

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formScope, setFormScope] = useState<CrudScope>('DEPARTMENT');
  const [formAttributes, setFormAttributes] = useState<Record<string, any>>({});

  // Clone form state
  const [cloneTitle, setCloneTitle] = useState('');
  const [cloneCode, setCloneCode] = useState('');

  // Import State
  const [importJsonText, setImportJsonText] = useState('');
  const [importReport, setImportReport] = useState<any>(null);

  // In-portal notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const isSuperAdmin = currentUser.portalAssignments.some(a => a.portalId === 'ADMIN' && (a.isAdmin || a.roleId === 'ROLE_SUPER_ADMIN'));

  // Filter entities according to portal's scope, selected type, and ownership isolation
  const filteredEntities = crudEntities.filter(e => {
    const matchesType = e.entityType === selectedEntityType;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.codeOrIdentifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.departmentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'ALL' ? true : e.lifecycleState === stateFilter;
    
    const isOwner = isRecordOwner(currentUser, e);
    const matchesOwnership =
      ownershipFilter === 'ALL' ? true :
      ownershipFilter === 'MINE' ? isOwner :
      !isOwner;

    return matchesType && matchesSearch && matchesState && matchesOwnership;
  });

  const selectedEntity = crudEntities.find(e => e.id === selectedEntityId);

  // Check user permission for CREATE on this entity
  const createPerm = evaluateCrudPermission(currentUser, portalId, selectedEntityType, 'create');

  const getStateBadgeClass = (state: LifecycleState) => {
    switch (state) {
      case 'ACTIVE':
      case 'PUBLISHED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'APPROVED':
      case 'COMPLETED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'DRAFT':
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
      case 'PENDING':
      case 'MODERATED':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'LOCKED':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'ARCHIVED':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'SOFT_DELETED':
      case 'VOIDED':
      case 'REJECTED':
      case 'SUSPENDED':
      case 'DEACTIVATED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleOpenCreate = () => {
    setFormTitle('');
    setFormCode('');
    setFormScope(isSuperAdmin ? 'INSTITUTION' : currentUser.faculty ? 'FACULTY' : 'DEPARTMENT');
    setFormAttributes({});
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formCode) {
      showNotification('error', 'Title and Identifier/Code are required.');
      return;
    }

    const res = executeCrudOperation(
      selectedEntityType,
      'create',
      undefined,
      {
        title: formTitle,
        codeOrIdentifier: formCode,
        scope: formScope,
        departmentId: currentUser.department || 'DPT_CS',
        facultyId: currentUser.faculty || 'FAC_SCI',
        attributes: formAttributes
      },
      `Created via ${portalId} Portal Data Lifecycle Manager`
    );

    if (res.success) {
      showNotification('success', res.message);
      setIsCreateModalOpen(false);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleOpenEdit = (entity: CrudRecordMeta) => {
    const isOwner = isRecordOwner(currentUser, entity);
    if (!isOwner && !isSuperAdmin) {
      showNotification('error', `Ownership Isolation: You cannot edit '${entity.title}' owned by '${entity.ownerName}'. Same-role peer data is read-only.`);
      return;
    }
    setSelectedEntityId(entity.id);
    setFormTitle(entity.title);
    setFormCode(entity.codeOrIdentifier);
    setFormScope(entity.scope);
    setFormAttributes(entity.attributes || {});
    setActionReason('');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntity) return;

    const res = executeCrudOperation(
      selectedEntity.entityType,
      'edit',
      selectedEntity.id,
      {
        title: formTitle,
        scope: formScope,
        attributes: formAttributes,
        optimisticLockToken: selectedEntity.optimisticLockToken
      },
      actionReason || 'Record attributes updated'
    );

    if (res.success) {
      showNotification('success', res.message);
      setIsEditModalOpen(false);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleLifecycleTransition = (entity: CrudRecordMeta, operation: CrudOperation) => {
    const isOwner = isRecordOwner(currentUser, entity);
    if (!isOwner && !isSuperAdmin) {
      showNotification('error', `Ownership Isolation: Cannot perform '${operation.toUpperCase()}' on '${entity.title}' owned by '${entity.ownerName}'. Peer data is protected.`);
      return;
    }

    const reason = prompt(`Enter justification for '${operation.toUpperCase()}' on ${entity.title}:`, `Authorized status transition in ${portalId} portal.`);
    if (reason === null) return;

    const res = executeCrudOperation(
      entity.entityType,
      operation,
      entity.id,
      { optimisticLockToken: entity.optimisticLockToken },
      reason
    );

    if (res.success) {
      showNotification('success', res.message);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleOpenClone = (entity: CrudRecordMeta) => {
    setSelectedEntityId(entity.id);
    setCloneTitle(`Copy of ${entity.title}`);
    setCloneCode(`${entity.codeOrIdentifier}_COPY`);
    setIsCloneModalOpen(true);
  };

  const handleCloneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntity) return;

    const res = executeCloneEntity(selectedEntity.id, cloneTitle, cloneCode);
    if (res.success) {
      showNotification('success', res.message);
      setIsCloneModalOpen(false);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleBulkExecute = () => {
    if (selectedIds.length === 0) {
      showNotification('error', 'Select at least one record to execute batch action.');
      return;
    }

    const res = executeBulkCrud({
      entityType: selectedEntityType,
      operation: bulkOperation,
      targetIds: selectedIds,
      reason: bulkReason,
      confirmed: true
    });

    if (res.successCount > 0) {
      showNotification('success', `Batch ${bulkOperation} succeeded on ${res.successCount} of ${res.totalRequested} records.`);
      setSelectedIds([]);
    } else {
      showNotification('error', `Batch action failed: ${res.errors[0]?.error || 'Operation rejected.'}`);
    }
  };

  const handleExport = (format: 'CSV' | 'JSON') => {
    const res = executeExportDataset(selectedEntityType, format);
    if (!res.allowed) {
      showNotification('error', res.message);
      return;
    }

    const blob = new Blob([res.data], { type: res.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = res.fileName;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('success', `Exported ${res.fileName} successfully.`);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) {
      showNotification('error', 'Paste valid JSON records or load a template.');
      return;
    }

    try {
      const parsed = JSON.parse(importJsonText);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      const res = executeImportDataset(selectedEntityType, rows);
      setImportReport(res.result);
      if (res.success) {
        showNotification('success', `Successfully imported ${res.createdCount} records into DRAFT state.`);
        setIsImportModalOpen(false);
      } else {
        showNotification('error', `Validation errors found in import dataset.`);
      }
    } catch (err: any) {
      showNotification('error', `JSON Parse Error: ${err.message}`);
    }
  };

  const loadTemplate = () => {
    const schema = IMPORT_EXPORT_SCHEMAS[selectedEntityType] || [];
    const templateRow: Record<string, any> = {};
    schema.forEach(field => {
      templateRow[field.key] = field.defaultValue !== undefined ? field.defaultValue : (field.options ? field.options[0] : `Sample_${field.key}`);
    });
    setImportJsonText(JSON.stringify([templateRow], null, 2));
  };

  const userAssignment = currentUser.portalAssignments.find(a => a.portalId === portalId);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      
      {/* Header & RBAC Policy HUD */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {portalId} Data & Lifecycle Hub
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Active Role: <strong className="text-white">{userAssignment?.roleName || (isSuperAdmin ? 'Super Admin' : 'Authorized Staff')}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {title || `${portalId} Record Governance & Data Operations`}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            {subtitle || 'Manage lifecycle transitions, draft submissions, approvals, optimistic concurrency locks, and version histories with role-based scope verification.'}
          </p>
        </div>

        {/* User Scope Badge */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono shrink-0 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Scope: {isSuperAdmin ? 'INSTITUTION (Global)' : currentUser.faculty ? `FACULTY (${currentUser.faculty})` : `DEPARTMENT (${currentUser.department})`}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Create Perm: {createPerm.allowed ? <span className="text-emerald-400">Authorized</span> : <span className="text-rose-400">Restricted</span>}
          </div>
        </div>
      </div>

      {/* In-portal Notification Banner */}
      {notification && (
        <div className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
          notification.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' :
          notification.type === 'error' ? 'bg-rose-950/80 text-rose-300 border-rose-800/50' :
          'bg-blue-950/80 text-blue-300 border-blue-800/50'
        }`}>
          <div className="flex items-center gap-2 font-medium">
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            {notification.type === 'info' && <Layers className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Entity Type Switcher & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Domain:</span>
          {allowedEntityTypes.map(type => (
            <button
              key={type}
              onClick={() => {
                setSelectedEntityType(type);
                setSelectedIds([]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition border ${
                selectedEntityType === type
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {createPerm.allowed && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create {selectedEntityType.replace(/_/g, ' ')}</span>
            </button>
          )}

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="Batch Import records"
          >
            <FileUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import</span>
          </button>

          <button
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            title="Export to CSV Spreadsheet"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => handleExport('JSON')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            title="Export to JSON"
          >
            <FileDown className="w-3.5 h-3.5 text-purple-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${selectedEntityType.replace(/_/g, ' ')} records...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Lifecycle States</option>
            <option value="ACTIVE">ACTIVE / LIVE</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="DRAFT">DRAFT</option>
            <option value="SUBMITTED">SUBMITTED / PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="LOCKED">LOCKED</option>
            <option value="ARCHIVED">ARCHIVED</option>
            <option value="SOFT_DELETED">SOFT DELETED</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <select
            value={ownershipFilter}
            onChange={e => setOwnershipFilter(e.target.value as any)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="ALL">All Records</option>
            <option value="MINE">👤 My Records Only</option>
            <option value="PEERS">🔒 Peer Records (Isolated)</option>
          </select>
        </div>
      </div>

      {/* Bulk Operations Action Bar (Shows when 1+ selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <span>{selectedIds.length} records selected for batch operation:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={bulkOperation}
              onChange={e => setBulkOperation(e.target.value as CrudOperation)}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200"
            >
              <option value="archive">Batch Archive</option>
              <option value="activate">Batch Activate</option>
              <option value="lock">Batch Lock</option>
              <option value="unlock">Batch Unlock</option>
              <option value="soft_delete">Batch Soft Delete</option>
              <option value="restore">Batch Restore</option>
            </select>

            <button
              onClick={handleBulkExecute}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
            >
              Apply Batch {bulkOperation.toUpperCase()}
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Entity Data Matrix Table */}
      <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-inner">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-700/80 text-slate-300 font-semibold">
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filteredEntities.length}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(filteredEntities.map(x => x.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                  className="rounded bg-slate-950 border-slate-700"
                />
              </th>
              <th className="p-3">Identifier & Title</th>
              <th className="p-3">Lifecycle State</th>
              <th className="p-3">Version & Scope</th>
              <th className="p-3">Owner / Updated</th>
              <th className="p-3 text-right">Lifecycle Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredEntities.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No records found in &apos;{selectedEntityType}&apos; matching the selected filters.
                </td>
              </tr>
            ) : (
              filteredEntities.map(entity => {
                const isSelected = selectedIds.includes(entity.id);
                const isOwner = isRecordOwner(currentUser, entity);
                const canMutate = isOwner || isSuperAdmin;
                return (
                  <tr
                    key={entity.id}
                    className={`hover:bg-slate-800/40 transition ${
                      isSelected ? 'bg-blue-900/20' : ''
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, entity.id]);
                          } else {
                            setSelectedIds(prev => prev.filter(x => x !== entity.id));
                          }
                        }}
                        className="rounded bg-slate-950 border-slate-700"
                      />
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5 flex-wrap">
                        <span>{entity.title}</span>
                        {isOwner ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium flex items-center gap-1" title="You are the verified owner of this record">
                            <UserCheck className="w-2.5 h-2.5" /> My Record
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1" title={`Isolated Peer Record (Owned by ${entity.ownerName}). Same-role isolation policy prevents unauthorized peer tampering.`}>
                            <Lock className="w-2.5 h-2.5" /> Peer: {entity.ownerName}
                          </span>
                        )}
                        {entity.isProtected && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20" title="Protected Historical Record">
                            Protected
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Code: <strong>{entity.codeOrIdentifier}</strong></span>
                        <span>•</span>
                        <span className="text-slate-500">Dept: {entity.departmentId}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStateBadgeClass(entity.lifecycleState)}`}>
                        {entity.lifecycleState}
                      </span>
                      {entity.deletedReason && (
                        <p className="text-[10px] text-rose-400 mt-0.5 truncate max-w-xs" title={entity.deletedReason}>
                          Reason: {entity.deletedReason}
                        </p>
                      )}
                    </td>

                    <td className="p-3 font-mono text-[11px]">
                      <div className="text-slate-200">v{entity.version}</div>
                      <div className="text-[10px] text-slate-400">Scope: {entity.scope}</div>
                    </td>

                    <td className="p-3 text-[11px]">
                      <div className="text-slate-200 font-medium flex items-center gap-1">
                        {entity.ownerName}
                      </div>
                      <div className="text-[10px] text-slate-500">{new Date(entity.updatedAt).toLocaleDateString()}</div>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(entity)}
                          disabled={!canMutate}
                          className={`p-1 rounded border transition ${
                            canMutate
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                              : 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                          }`}
                          title={canMutate ? 'Edit Attributes' : `Peer isolation active: Only ${entity.ownerName} or Administrator can edit`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Lifecycle Contextual Quick Actions */}
                        {entity.lifecycleState === 'DRAFT' && (
                          <button
                            onClick={() => handleLifecycleTransition(entity, 'submit')}
                            disabled={!canMutate}
                            className={`p-1 rounded border transition ${
                              canMutate
                                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30'
                                : 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                            }`}
                            title={canMutate ? 'Submit for Approval' : 'Peer record: submit restricted'}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {(entity.lifecycleState === 'SUBMITTED' || entity.lifecycleState === 'PENDING') && (
                          <button
                            onClick={() => handleLifecycleTransition(entity, 'approve')}
                            disabled={!canMutate}
                            className={`p-1 rounded border transition ${
                              canMutate
                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                            }`}
                            title={canMutate ? 'Approve Record' : 'Peer record: approve restricted'}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {entity.lifecycleState === 'APPROVED' && (
                          <button
                            onClick={() => handleLifecycleTransition(entity, 'publish')}
                            disabled={!canMutate}
                            className={`p-1 rounded border transition ${
                              canMutate
                                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30'
                                : 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                            }`}
                            title={canMutate ? 'Publish Officially' : 'Peer record: publish restricted'}
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {entity.lifecycleState === 'PUBLISHED' && (
                          <button
                            onClick={() => handleLifecycleTransition(entity, 'lock')}
                            disabled={!canMutate}
                            className={`p-1 rounded border transition ${
                              canMutate
                                ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/30'
                                : 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                            }`}
                            title={canMutate ? 'Lock against modifications' : 'Peer record: lock restricted'}
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {entity.lifecycleState === 'LOCKED' && (
                          <button
                            onClick={() => handleLifecycleTransition(entity, 'unlock')}
                            disabled={!canMutate}
                            className={`p-1 rounded border transition ${
                              canMutate
                                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600'
                                : 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                            }`}
                            title={canMutate ? 'Unlock' : 'Peer record: unlock restricted'}
                          >
                            <Unlock className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {(entity.lifecycleState === 'ARCHIVED' || entity.lifecycleState === 'SOFT_DELETED') ? (
                          <button
                            onClick={() => handleLifecycleTransition(entity, 'restore')}
                            disabled={!canMutate}
                            className={`p-1 rounded border transition ${
                              canMutate
                                ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                            }`}
                            title={canMutate ? 'Restore from Archive/Trash' : 'Peer record: restore restricted'}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleLifecycleTransition(entity, 'archive')}
                            disabled={!canMutate}
                            className={`p-1 rounded border transition ${
                              canMutate
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                                : 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                            }`}
                            title={canMutate ? 'Archive Record' : 'Peer record: archive restricted'}
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Clone Button */}
                        <button
                          onClick={() => handleOpenClone(entity)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                          title="Clone Record (Permitted for templates)"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Soft Delete */}
                        {entity.lifecycleState !== 'SOFT_DELETED' && (
                          <button
                            onClick={() => handleLifecycleTransition(entity, 'soft_delete')}
                            disabled={!canMutate}
                            className={`p-1 rounded border transition ${
                              canMutate
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'
                                : 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                            }`}
                            title={canMutate ? 'Soft Delete' : 'Peer record: delete restricted'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Version History */}
                        <button
                          onClick={() => {
                            setSelectedEntityId(entity.id);
                            setIsHistoryModalOpen(true);
                          }}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700"
                          title="Version Audit Trail"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Create New {selectedEntityType.replace(/_/g, ' ')}</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title / Name *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Advanced Distributed Systems"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Code / Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    placeholder="e.g. CSC401"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Scope Level</label>
                  <select
                    value={formScope}
                    onChange={e => setFormScope(e.target.value as CrudScope)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="DEPARTMENT">DEPARTMENT</option>
                    <option value="FACULTY">FACULTY</option>
                    {isSuperAdmin && <option value="INSTITUTION">INSTITUTION</option>}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                Initial State: <strong className="text-slate-200">DRAFT</strong> • Owner: <strong className="text-slate-200">{currentUser.name}</strong> • Concurrency Token initialized.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-400" />
                <span>Edit {selectedEntity.title} (v{selectedEntity.version})</span>
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title / Name</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Audit Reason for Update *</label>
                <input
                  type="text"
                  required
                  value={actionReason}
                  onChange={e => setActionReason(e.target.value)}
                  placeholder="e.g. Updated course syllabus learning outcomes"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div>Optimistic Token: <code className="text-slate-300 font-mono">{selectedEntity.optimisticLockToken}</code></div>
                <div>Submitting will increment version to <strong>v{selectedEntity.version + 1}</strong>.</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save & Increment Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLONE MODAL */}
      {isCloneModalOpen && selectedEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Copy className="w-4 h-4 text-purple-400" />
                <span>Clone Record: {selectedEntity.title}</span>
              </h3>
              <button onClick={() => setIsCloneModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCloneSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Cloned Title</label>
                <input
                  type="text"
                  required
                  value={cloneTitle}
                  onChange={e => setCloneTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Identifier / Code</label>
                <input
                  type="text"
                  required
                  value={cloneCode}
                  onChange={e => setCloneCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                Creates an isolated copy in <strong className="text-slate-200">DRAFT</strong> state with fresh version v1 and lineage tracking back to {selectedEntity.id}.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCloneModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Create Cloned Copy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileUp className="w-4 h-4 text-emerald-400" />
                <span>Batch Import {selectedEntityType.replace(/_/g, ' ')} Records</span>
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Paste JSON array of records or generate template:</span>
                <button
                  onClick={loadTemplate}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700"
                >
                  Generate Schema Template
                </button>
              </div>

              <textarea
                rows={7}
                value={importJsonText}
                onChange={e => setImportJsonText(e.target.value)}
                placeholder='[{"code": "CSC301", "title": "Data Structures", "creditUnits": 3}]'
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />

              {importReport && (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>Validation Status:</span>
                    <span className={importReport.isValid ? 'text-emerald-400' : 'text-rose-400'}>
                      {importReport.validRowsCount} valid / {importReport.totalRows} total
                    </span>
                  </div>
                  {importReport.errors.map((err: any, i: number) => (
                    <div key={i} className="text-[11px] text-rose-400">• Row {err.row} ({err.field}): {err.message}</div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportSubmit}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Validate & Import Batch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERSION HISTORY MODAL */}
      {isHistoryModalOpen && selectedEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <span>Version Audit History: {selectedEntity.title}</span>
              </h3>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-300 font-mono">
                <span>Current State: <strong className="text-white">{selectedEntity.lifecycleState}</strong></span>
                <span>Version: <strong className="text-blue-400">v{selectedEntity.version}</strong></span>
                <span>Lock: <strong className="text-slate-400">{selectedEntity.optimisticLockToken}</strong></span>
              </div>

              <div className="space-y-2">
                {(selectedEntity.versionHistory || []).map((vh, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-blue-400 font-mono">Version v{vh.version}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{new Date(vh.changedAt).toLocaleString()}</span>
                    </div>
                    <div className="text-slate-300">Author: <strong className="text-white">{vh.changedBy}</strong></div>
                    <div className="text-slate-400 text-[11px]">Justification: {vh.changeReason}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
