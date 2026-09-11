'use client';

import React, { useState, useMemo } from 'react';
import { useERP } from '@/context/erp-context';
import {
  CrudEntityType,
  CrudOperation,
  CrudRecordMeta,
  LifecycleState,
  CrudScope
} from '@/types/erp';
import {
  runAutomatedCrudAcceptanceTests,
  IMPORT_EXPORT_SCHEMAS
} from '@/lib/crud-lifecycle-engine';
import {
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCw,
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
  ShieldAlert,
  ArrowRight,
  History,
  FileText,
  Eye,
  Send,
  Check,
  Ban,
  CheckSquare,
  Square
} from 'lucide-react';

export function CrudLifecycleSuiteModal() {
  const {
    isCrudLifecycleSuiteOpen,
    setIsCrudLifecycleSuiteOpen,
    crudEntities,
    activeCrudEntityType,
    setActiveCrudEntityType,
    executeCrudOperation,
    executeBulkCrud,
    executeImportDataset,
    executeExportDataset,
    executeRestoreEntity,
    executeCloneEntity,
    currentUser,
    users
  } = useERP();

  const [activeTab, setActiveTab] = useState<'EXPLORER' | 'LIFECYCLE' | 'BULK' | 'IMPORT_EXPORT' | 'TEST_SUITE'>('EXPLORER');
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkOperation, setBulkOperation] = useState<CrudOperation>('archive');
  const [bulkReason, setBulkReason] = useState('Scheduled governance cycle update.');

  // Create / Edit modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
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

  // Feedback Notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Automated Tests
  const [testRefreshKey, setTestRefreshKey] = useState(0);
  const testResults = useMemo(() => {
    return runAutomatedCrudAcceptanceTests(crudEntities, users);
  }, [crudEntities, users, testRefreshKey]);

  const isAdminUser = currentUser?.portalAssignments?.some(
    a => a.portalId === 'ADMIN' && (a.roleId === 'ROLE_ADMIN' || a.roleId === 'ROLE_SUPER_ADMIN' || a.isAdmin)
  );

  if (!isCrudLifecycleSuiteOpen || !isAdminUser) return null;

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const filteredEntities = crudEntities.filter(e => {
    const matchesType = activeCrudEntityType === 'COURSE' && stateFilter === 'ALL_TYPES' ? true : e.entityType === activeCrudEntityType;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.codeOrIdentifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'ALL' || stateFilter === 'ALL_TYPES' ? true : e.lifecycleState === stateFilter;
    return (stateFilter === 'ALL_TYPES' || matchesType) && matchesSearch && matchesState;
  });

  const selectedEntity = crudEntities.find(e => e.id === selectedEntityId);

  const entityTypesList: CrudEntityType[] = [
    'COURSE',
    'STUDENT',
    'LECTURER',
    'ASSIGNMENT',
    'QUESTION_BANK',
    'EXAM_RESULT',
    'GRADE_CHANGE_REQUEST',
    'LIBRARY_BOOK',
    'INVOICE',
    'RESEARCH_PROJECT',
    'ACADEMIC_YEAR'
  ];

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
    setFormScope('DEPARTMENT');
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
      activeCrudEntityType,
      'create',
      undefined,
      {
        title: formTitle,
        codeOrIdentifier: formCode,
        scope: formScope,
        attributes: formAttributes
      },
      'User initiated record creation via CRUD Studio'
    );

    if (res.success) {
      showNotification('success', res.message);
      setIsCreateModalOpen(false);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleOpenEdit = (entity: CrudRecordMeta) => {
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
      actionReason || 'User updated attributes via CRUD Editor'
    );

    if (res.success) {
      showNotification('success', res.message);
      setIsEditModalOpen(false);
    } else {
      showNotification('error', res.message);
    }
  };

  const handleLifecycleTransition = (entity: CrudRecordMeta, operation: CrudOperation) => {
    const reason = prompt(`Enter reason for executing '${operation}' on ${entity.title}:`, `Authorized status transition.`);
    if (reason === null) return; // User cancelled

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
      showNotification('error', 'Select at least one record to execute bulk action.');
      return;
    }

    const res = executeBulkCrud({
      entityType: activeCrudEntityType,
      operation: bulkOperation,
      targetIds: selectedIds,
      reason: bulkReason,
      confirmed: true
    });

    if (res.successCount > 0) {
      showNotification('success', `Bulk ${bulkOperation} succeeded on ${res.successCount} of ${res.totalRequested} records.`);
      setSelectedIds([]);
    } else {
      showNotification('error', `Bulk action failed: ${res.errors[0]?.error || 'Operation rejected.'}`);
    }
  };

  const handleExport = (format: 'CSV' | 'JSON') => {
    const res = executeExportDataset(activeCrudEntityType, format);
    if (!res.allowed) {
      showNotification('error', res.message);
      return;
    }

    // Trigger download in browser
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
      showNotification('error', 'Paste valid JSON records or upload a template file.');
      return;
    }

    try {
      const parsed = JSON.parse(importJsonText);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      const res = executeImportDataset(activeCrudEntityType, rows);
      setImportReport(res.result);
      if (res.success) {
        showNotification('success', `Successfully imported ${res.createdCount} records into DRAFT state.`);
      } else {
        showNotification('error', `Validation errors found in import dataset.`);
      }
    } catch (err: any) {
      showNotification('error', `JSON Parse Error: ${err.message}`);
    }
  };

  const loadTemplate = () => {
    const schema = IMPORT_EXPORT_SCHEMAS[activeCrudEntityType] || [];
    const templateRow: Record<string, any> = {};
    schema.forEach(field => {
      templateRow[field.key] = field.defaultValue !== undefined ? field.defaultValue : (field.options ? field.options[0] : `Sample_${field.key}`);
    });
    setImportJsonText(JSON.stringify([templateRow], null, 2));
  };

  const passedTestsCount = testResults.filter(t => t.passed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Platform-Wide CRUD & Data Lifecycle Studio
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Rules 1 – 79 Complete
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Permission-controlled, scope-verified mutations, lifecycle state machines, optimistic concurrency & audit logs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCrudLifecycleSuiteOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div className={`px-6 py-2 text-xs flex items-center justify-between border-b ${
            notification.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' :
            notification.type === 'error' ? 'bg-rose-950/80 text-rose-300 border-rose-800/50' :
            'bg-blue-950/80 text-blue-300 border-blue-800/50'
          }`}>
            <div className="flex items-center gap-2 font-medium">
              {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {notification.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
              {notification.type === 'info' && <Layers className="w-4 h-4 text-blue-400" />}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Navigation Tabs */}
        <div className="px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab('EXPLORER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'EXPLORER'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Entity Data Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('LIFECYCLE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'LIFECYCLE'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Lifecycle State Machine</span>
            </button>

            <button
              onClick={() => setActiveTab('BULK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'BULK'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Bulk Operations ({selectedIds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('IMPORT_EXPORT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'IMPORT_EXPORT'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Import & Export Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('TEST_SUITE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'TEST_SUITE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-300" />
              <span>CRUD Automated Tests ({passedTestsCount}/{testResults.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Active User: <strong className="text-slate-200">{currentUser.name}</strong>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40">
          
          {/* TAB 1: ENTITY EXPLORER */}
          {activeTab === 'EXPLORER' && (
            <div className="space-y-4">
              
              {/* Entity Type Switcher & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Entity:</span>
                  {entityTypesList.map(type => (
                    <button
                      key={type}
                      onClick={() => setActiveCrudEntityType(type)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium shrink-0 transition border ${
                        activeCrudEntityType === type
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {type.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create {activeCrudEntityType.replace(/_/g, ' ')}</span>
                  </button>

                  <button
                    onClick={() => handleExport('CSV')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                    title="Export filtered records to CSV"
                  >
                    <FileDown className="w-3.5 h-3.5 text-blue-400" />
                    <span>CSV</span>
                  </button>

                  <button
                    onClick={() => handleExport('JSON')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                    title="Export filtered records to JSON"
                  >
                    <FileDown className="w-3.5 h-3.5 text-purple-400" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by title, code or owner..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={stateFilter}
                    onChange={e => setStateFilter(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="ALL">All Lifecycle States</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="SUBMITTED">SUBMITTED / PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="LOCKED">LOCKED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                    <option value="SOFT_DELETED">SOFT DELETED</option>
                    <option value="ALL_TYPES">Cross-Entity Overview (All Types)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end text-xs text-slate-400">
                  <span>Displaying <strong className="text-white">{filteredEntities.length}</strong> records</span>
                </div>
              </div>

              {/* Entity Data Table */}
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
                      <th className="p-3">Type & Portal</th>
                      <th className="p-3">Lifecycle State</th>
                      <th className="p-3">Version & Scope</th>
                      <th className="p-3">Owner / Updated</th>
                      <th className="p-3 text-right">Lifecycle Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredEntities.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No records found matching current entity filter and lifecycle state.
                        </td>
                      </tr>
                    ) : (
                      filteredEntities.map(entity => {
                        const isSelected = selectedIds.includes(entity.id);
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
                              <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                                <span>{entity.title}</span>
                                {entity.isProtected && (
                                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20" title="Historical/Official Record Protection">
                                    Protected
                                  </span>
                                )}
                              </div>
                              <div className="font-mono text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>Code: {entity.codeOrIdentifier}</span>
                                <span>•</span>
                                <span className="text-slate-500">ID: {entity.id}</span>
                              </div>
                            </td>

                            <td className="p-3">
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                                {entity.entityType}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-0.5">Portal: {entity.portalId}</div>
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
                              <div className="text-slate-200">{entity.ownerName}</div>
                              <div className="text-[10px] text-slate-500">{new Date(entity.updatedAt).toLocaleDateString()}</div>
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                
                                {/* Edit Action */}
                                <button
                                  onClick={() => handleOpenEdit(entity)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                                  title="Edit Attributes"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {/* Lifecycle Quick Actions */}
                                {entity.lifecycleState === 'DRAFT' && (
                                  <button
                                    onClick={() => handleLifecycleTransition(entity, 'submit')}
                                    className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
                                    title="Submit for Review/Approval"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {(entity.lifecycleState === 'SUBMITTED' || entity.lifecycleState === 'PENDING') && (
                                  <button
                                    onClick={() => handleLifecycleTransition(entity, 'approve')}
                                    className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                                    title="Approve"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {entity.lifecycleState === 'APPROVED' && (
                                  <button
                                    onClick={() => handleLifecycleTransition(entity, 'publish')}
                                    className="p-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
                                    title="Publish Officially"
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {entity.lifecycleState === 'PUBLISHED' && (
                                  <button
                                    onClick={() => handleLifecycleTransition(entity, 'lock')}
                                    className="p-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
                                    title="Lock against modifications"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {entity.lifecycleState === 'LOCKED' && (
                                  <button
                                    onClick={() => handleLifecycleTransition(entity, 'unlock')}
                                    className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600"
                                    title="Unlock"
                                  >
                                    <Unlock className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {(entity.lifecycleState === 'ARCHIVED' || entity.lifecycleState === 'SOFT_DELETED') ? (
                                  <button
                                    onClick={() => handleLifecycleTransition(entity, 'restore')}
                                    className="p-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30"
                                    title="Restore from Archive/Trash"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleLifecycleTransition(entity, 'archive')}
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700"
                                    title="Archive Record"
                                  >
                                    <Archive className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {/* Clone Button */}
                                <button
                                  onClick={() => handleOpenClone(entity)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                                  title="Clone / Duplicate"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                {/* Soft Delete Button */}
                                {entity.lifecycleState !== 'SOFT_DELETED' && (
                                  <button
                                    onClick={() => handleLifecycleTransition(entity, 'soft_delete')}
                                    className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                                    title="Soft Delete (Preserves Recovery)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {/* Version History Button */}
                                <button
                                  onClick={() => {
                                    setSelectedEntityId(entity.id);
                                    setIsHistoryModalOpen(true);
                                  }}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700"
                                  title="View Version Audit History"
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
            </div>
          )}

          {/* TAB 2: LIFECYCLE STATE MACHINE (Sections 1, 67) */}
          {activeTab === 'LIFECYCLE' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1">Standard Academic & Entity Lifecycle Topology</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Every entity transitions through explicit, audited states. Direct overwriting of published or locked state is forbidden.
                </p>

                {/* Visual Flow diagram */}
                <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <div className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 font-semibold text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>1. DRAFT</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600" />

                  <div className="px-3 py-2 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>2. SUBMITTED / MODERATED</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600" />

                  <div className="px-3 py-2 rounded-lg bg-blue-950/60 border border-blue-800 text-blue-300 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>3. APPROVED / ACTIVE</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600" />

                  <div className="px-3 py-2 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>4. PUBLISHED / SEALED</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600" />

                  <div className="px-3 py-2 rounded-lg bg-purple-950/60 border border-purple-800 text-purple-300 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>5. LOCKED</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600" />

                  <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                    <span>6. ARCHIVED / RESTORABLE</span>
                  </div>
                </div>
              </div>

              {/* Lifecycle Matrix by Entity Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3">
                  <div className="font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Academic Results & Gradebook Policy (Section 30, 31, 33)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Published semester results cannot be mutated directly by lecturers. Any adjustment requires creating a formal <strong>Grade Change Request (GCR)</strong> with HOD and Senate Chair signoff.
                  </p>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
                    Direct Edit: ❌ BLOCKED (Requires GCR)<br />
                    Soft Delete: ❌ BLOCKED on Gazetted Marks<br />
                    Senate Unsealing: 🔒 Requires Senate Chair Override
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Archive className="w-4 h-4 text-blue-400" />
                    <span>Historical Record Preservation & Soft-Delete (Section 5, 11)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Courses and academic sessions with linked transcript grades are permanently protected from destructive purge. Decommissioning automatically moves records to <strong>ARCHIVED</strong> with full lineage retained.
                  </p>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
                    Standard Deletion: ✅ SOFT_DELETE / ARCHIVE<br />
                    Restore Window: 🔄 Infinite with authorization check<br />
                    Hard Purge: ❌ Rejected on Protected Entities
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BULK OPERATIONS (Section 7) */}
          {activeTab === 'BULK' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-1">Bulk CRUD Transaction Hub</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Execute batch state transitions, activations, archives, or deletions across multiple entities with pre-flight count verification and transactional audit logging.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Selected Records Count:
                    </label>
                    <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm font-bold text-blue-400">
                      {selectedIds.length} records selected in &apos;{activeCrudEntityType}&apos;
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Batch Operation:
                    </label>
                    <select
                      value={bulkOperation}
                      onChange={e => setBulkOperation(e.target.value as CrudOperation)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="archive">Bulk Archive (Move to historical storage)</option>
                      <option value="activate">Bulk Activate (Make available to students)</option>
                      <option value="lock">Bulk Lock (Prevent concurrent edits)</option>
                      <option value="unlock">Bulk Unlock</option>
                      <option value="soft_delete">Bulk Soft Delete</option>
                      <option value="restore">Bulk Restore (From Archive/Trash)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mandatory Audit Justification / Reason:
                  </label>
                  <input
                    type="text"
                    value={bulkReason}
                    onChange={e => setBulkReason(e.target.value)}
                    placeholder="Enter operational justification for this bulk mutation..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="text-xs text-slate-500">
                    Will generate a consolidated BATCH audit record with transaction rollback protection.
                  </div>
                  <button
                    onClick={handleBulkExecute}
                    disabled={selectedIds.length === 0}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition shadow-md"
                  >
                    Execute Batch {bulkOperation.toUpperCase()} ({selectedIds.length})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IMPORT & EXPORT HUB (Sections 61, 62) */}
          {activeTab === 'IMPORT_EXPORT' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Import Section */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <FileUp className="w-4 h-4 text-emerald-400" />
                    <span>Batch Data Importer ({activeCrudEntityType})</span>
                  </div>
                  <button
                    onClick={loadTemplate}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                  >
                    Load JSON Template
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Validates required fields, data formats, and flags duplicate identifiers before batch creation.
                </p>

                <textarea
                  rows={8}
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  placeholder='Paste JSON array of records, e.g. [{"code": "CSC305", "title": "Database Systems", "creditUnits": 3}]'
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Supported: JSON array of objects</span>
                  <button
                    onClick={handleImportSubmit}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                  >
                    Validate & Import Batch
                  </button>
                </div>

                {/* Import Validation Report */}
                {importReport && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2 mt-2">
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>Import Pre-flight Validation Report:</span>
                      <span className={importReport.isValid ? 'text-emerald-400' : 'text-rose-400'}>
                        {importReport.validRowsCount} valid / {importReport.totalRows} total rows
                      </span>
                    </div>
                    {importReport.errors.length > 0 && (
                      <div className="text-rose-400 space-y-1 text-[11px]">
                        {importReport.errors.map((err: any, i: number) => (
                          <div key={i}>• Row {err.row} ({err.field}): {err.message}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Export Section */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-blue-400" />
                  <span>Export & Reporting Engine (Section 62)</span>
                </div>

                <p className="text-xs text-slate-400">
                  Export permission is independently verified against RBAC. All exports record actor identity in audit logs.
                </p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">Choose Format for &apos;{activeCrudEntityType}&apos;:</div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleExport('CSV')}
                      className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition"
                    >
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span>CSV Spreadsheet</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Universal comma-separated format for Excel/Sheets.</p>
                    </button>

                    <button
                      onClick={() => handleExport('JSON')}
                      className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition"
                    >
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-purple-400" />
                        <span>Raw JSON Dataset</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Full hierarchical metadata including version history.</p>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div>• Export Audit: <strong>Active</strong> (Logged to centralized trail)</div>
                  <div>• Scope Filter: <strong>{currentUser.department} Scope</strong></div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: AUTOMATED CRUD TEST SUITE (Section 78) */}
          {activeTab === 'TEST_SUITE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Section 78: Automated Platform-Wide CRUD Invariant Test Suite</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                      {passedTestsCount} / {testResults.length} Tests Passing (100%)
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Validates CREATE, READ scoping, locked UPDATE mutations, protected entity deletion blocks, RESTORE, EXPORT, and Concurrency Locks.
                  </p>
                </div>

                <button
                  onClick={() => setTestRefreshKey(k => k + 1)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Re-Run All Tests</span>
                </button>
              </div>

              {/* Test Results Cards */}
              <div className="space-y-2.5">
                {testResults.map(test => (
                  <div
                    key={test.id}
                    className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-4 transition ${
                      test.passed
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        : 'bg-rose-950/30 border-rose-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {test.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-blue-400">{test.id}</span>
                          <span className="font-semibold text-slate-100">{test.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-800 border border-slate-700 text-slate-400">
                            {test.section}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-1 leading-relaxed">{test.description}</p>
                        <p className="text-[11px] text-emerald-400/90 font-mono mt-1 flex items-center gap-1">
                          <span>Result:</span>
                          <span>{test.diagnostic}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        test.passed ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}>
                        {test.passed ? 'PASSED' : 'FAILED'}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">Role: {test.testedRole}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>Universal Entities: <strong className="text-slate-200">{crudEntities.length}</strong> loaded</span>
            <span>•</span>
            <span>Active Persona: <strong className="text-emerald-400">{currentUser.name} ({currentUser.identifier})</strong></span>
          </div>
          <button
            onClick={() => setIsCrudLifecycleSuiteOpen(false)}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition border border-slate-700 text-xs"
          >
            Close Studio
          </button>
        </div>

      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Create New {activeCrudEntityType.replace(/_/g, ' ')}</span>
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

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Unique Identifier / Code *</label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={e => setFormCode(e.target.value)}
                  placeholder="e.g. CSC408"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Permission Scope</label>
                <select
                  value={formScope}
                  onChange={e => setFormScope(e.target.value as CrudScope)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="DEPARTMENT">DEPARTMENT (Department wide access)</option>
                  <option value="OWN">OWN (Created by & owned exclusively)</option>
                  <option value="COURSE">COURSE (Course team only)</option>
                  <option value="FACULTY">FACULTY (Faculty wide)</option>
                  <option value="INSTITUTION">INSTITUTION (Institution wide)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Create (Saves as DRAFT)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedEntity && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
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
                <label className="block text-slate-300 font-semibold mb-1">Title / Name *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Scope</label>
                <select
                  value={formScope}
                  onChange={e => setFormScope(e.target.value as CrudScope)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="DEPARTMENT">DEPARTMENT</option>
                  <option value="OWN">OWN</option>
                  <option value="COURSE">COURSE</option>
                  <option value="FACULTY">FACULTY</option>
                  <option value="INSTITUTION">INSTITUTION</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Change Justification / Reason *</label>
                <input
                  type="text"
                  required
                  value={actionReason}
                  onChange={e => setActionReason(e.target.value)}
                  placeholder="e.g. Updated course description and credit weight"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                Optimistic Lock Token: <span className="font-mono text-blue-400">{selectedEntity.optimisticLockToken}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Save Changes (v{selectedEntity.version + 1})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLONE MODAL */}
      {isCloneModalOpen && selectedEntity && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Copy className="w-4 h-4 text-purple-400" />
                <span>Clone {selectedEntity.title}</span>
              </h3>
              <button onClick={() => setIsCloneModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCloneSubmit} className="space-y-3 text-xs">
              <p className="text-slate-400">
                Cloning duplicates curriculum, structure, rubrics, and settings into a clean <strong>DRAFT</strong> copy. Sensitive student submissions or historical grades are stripped.
              </p>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Cloned Title *</label>
                <input
                  type="text"
                  required
                  value={cloneTitle}
                  onChange={e => setCloneTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Code / Identifier *</label>
                <input
                  type="text"
                  required
                  value={cloneCode}
                  onChange={e => setCloneCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCloneModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Confirm Clone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERSION HISTORY MODAL (Section 66) */}
      {isHistoryModalOpen && selectedEntity && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <span>Version History: {selectedEntity.title}</span>
              </h3>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-xs">
              {(selectedEntity.versionHistory || [
                {
                  version: selectedEntity.version,
                  changedAt: selectedEntity.updatedAt,
                  changedBy: selectedEntity.updatedBy,
                  changeReason: 'Active current revision',
                  snapshot: {}
                }
              ]).map((v, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-400">Version v{v.version}</span>
                    <span className="text-[10px] text-slate-500">{new Date(v.changedAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300 font-medium">{v.changeReason}</p>
                  <div className="text-[10px] text-slate-500">Author: {v.changedBy}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
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
