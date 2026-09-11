'use client';

import React, { useState } from 'react';
import { useERP } from '@/context/erp-context';
import { PortalId, UserIdentity } from '@/types/erp';
import {
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpenCheck,
  Library,
  Receipt,
  FileSpreadsheet,
  Users,
  UserCheck,
  Layers,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  X
} from 'lucide-react';

export function UnifiedLoginModal() {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginTargetPortal,
    loginUser,
    institutionalSettings
  } = useERP();

  const [identifierInput, setIdentifierInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Authenticated user awaiting portal selection (if multiple assigned)
  const [authenticatedUser, setAuthenticatedUser] = useState<UserIdentity | null>(null);

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    setErrorMsg(null);
    setShowForgotPassword(false);
    setAuthenticatedUser(null);
    setIsLoginModalOpen(false);
  };

  const getPortalInfo = (id: PortalId) => {
    switch (id) {
      case 'STUDENT':
        return {
          name: 'Student Portal',
          desc: 'Academic records, courses, semester results and student fees',
          icon: <GraduationCap className="w-5 h-5 text-blue-600" />
        };
      case 'ELEARNING':
        return {
          name: 'E-Learning Environment',
          desc: 'Course modules, lecture materials, assignments and tests',
          icon: <BookOpenCheck className="w-5 h-5 text-emerald-600" />
        };
      case 'ELIBRARY':
        return {
          name: 'Digital Library & Catalog',
          desc: 'Academic textbooks, journal papers, borrowings and reservations',
          icon: <Library className="w-5 h-5 text-amber-600" />
        };
      case 'LECTURER':
        return {
          name: 'Faculty & Lecturer Portal',
          desc: 'Class teaching, attendance rosters, assessments and gradebook',
          icon: <BookOpenCheck className="w-5 h-5 text-blue-600" />
        };
      case 'FINANCE':
        return {
          name: 'Finance & Bursary',
          desc: 'Tuition fees, payment registers, invoicing and reconciliation',
          icon: <Receipt className="w-5 h-5 text-purple-600" />
        };
      case 'EXAMINATIONS':
        return {
          name: 'Examinations Directorate',
          desc: 'Marks verification, Senate moderation and gazette transcripts',
          icon: <FileSpreadsheet className="w-5 h-5 text-rose-600" />
        };
      case 'ADMISSIONS':
        return {
          name: 'Admissions & Registry',
          desc: 'Candidate applications, verification and provisional offers',
          icon: <UserCheck className="w-5 h-5 text-teal-600" />
        };
      case 'HR':
        return {
          name: 'Human Resources',
          desc: 'Staff administration, faculty leaves and institutional payroll',
          icon: <Users className="w-5 h-5 text-indigo-600" />
        };
      case 'ADMIN':
        return {
          name: 'Administration & Governance',
          desc: 'System governance, user access controls, audit ledger and policy',
          icon: <ShieldCheck className="w-5 h-5 text-slate-800" />
        };
      default:
        return {
          name: `${id} Workspace`,
          desc: 'Institutional academic workspace',
          icon: <Layers className="w-5 h-5 text-slate-600" />
        };
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedId = identifierInput.trim();
    if (!trimmedId) {
      setErrorMsg('Please enter your Admission Number, Staff ID, or institutional Email.');
      return;
    }

    if (!passwordInput) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          identifier: trimmedId,
          password: passwordInput,
          tenantId: institutionalSettings.institutionCode || institutionalSettings.code || 'inst_apex_tvet'
        })
      });

      if (res.status === 401) {
        setErrorMsg('Invalid credentials.');
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        setErrorMsg('Unable to sign you in right now. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        setErrorMsg('Unable to sign you in right now. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      if (!data.success || !data.data) {
        setErrorMsg(res.status === 401 ? 'Invalid credentials.' : 'Unable to sign you in right now. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const serverData = data.data;

      // Store session ID if provided
      if (serverData.sessionId && typeof window !== 'undefined') {
        sessionStorage.setItem('erp_session_id', serverData.sessionId);
      }

      // Verify that backend returned complete authoritative identity information
      // Do NOT invent missing fields or construct synthetic identity
      if (
        (!serverData.id && !serverData.userId) ||
        !serverData.identifier ||
        !serverData.roles ||
        !Array.isArray(serverData.roles)
      ) {
        setErrorMsg('Unable to sign you in right now. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Construct UserIdentity STRICTLY from the backend authoritative attributes
      const authoritativeUser: UserIdentity = {
        id: serverData.id || serverData.userId,
        identifier: serverData.identifier,
        name: serverData.fullName || serverData.name || serverData.identifier,
        email: serverData.email || '',
        avatarUrl: serverData.avatarUrl || '',
        institution: serverData.institution || institutionalSettings.name,
        department: serverData.department || '',
        faculty: serverData.faculty || '',
        campus: serverData.campus || '',
        status: (serverData.status as any) || 'ACTIVE',
        portalAssignments: serverData.portalAssignments && serverData.portalAssignments.length > 0
          ? serverData.portalAssignments
          : serverData.roles.map((r: string) => {
              const roleUpper = r.toUpperCase();
              const portalId: PortalId =
                roleUpper === 'ADMIN' ? 'ADMIN' :
                roleUpper === 'STUDENT' ? 'STUDENT' :
                roleUpper === 'LECTURER' ? 'LECTURER' :
                roleUpper === 'FINANCE' ? 'FINANCE' :
                roleUpper === 'DEAN' ? 'EXAMINATIONS' :
                roleUpper === 'APPLICANT' ? 'ADMISSIONS' : 'STUDENT';
              return {
                portalId,
                roleId: `ROLE_${roleUpper}`,
                roleName: r,
                isAdmin: roleUpper === 'ADMIN',
                isMonitor: false,
                assignedAt: new Date().toISOString()
              };
            })
      };

      proceedAfterAuthentication(authoritativeUser);
    } catch {
      // Backend unavailable or network error: STRICTLY show standard failure message, NEVER authenticate locally
      setErrorMsg('Unable to sign you in right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const proceedAfterAuthentication = (user: UserIdentity) => {
    const assignedPortals = user.portalAssignments.map(a => a.portalId);
    const uniqueAssignedPortals = Array.from(new Set(assignedPortals));

    // If only one portal is assigned, navigate directly
    if (uniqueAssignedPortals.length === 1) {
      loginUser(user, uniqueAssignedPortals[0]);
      handleClose();
      return;
    }

    // If target portal is already specified and assigned to user, navigate directly
    if (loginTargetPortal && uniqueAssignedPortals.includes(loginTargetPortal as PortalId)) {
      loginUser(user, loginTargetPortal as PortalId);
      handleClose();
      return;
    }

    // If multiple portals are assigned, show clean Workspace Selector
    setAuthenticatedUser(user);
  };

  const handleSelectWorkspace = (portalId: PortalId) => {
    if (!authenticatedUser) return;
    loginUser(authenticatedUser, portalId);
    handleClose();
  };

  return (
    <div
      id="unified-login-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        id="unified-login-modal-content"
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {institutionalSettings.name || 'Apex Institute'}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Enterprise Academic Workspace
              </span>
            </div>
          </div>

          <button
            id="btn_close_login_modal"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {authenticatedUser ? (
            /* ------------------------------------------------------------- */
            /* WORKSPACE SELECTOR (Section 51)                               */
            /* ------------------------------------------------------------- */
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Welcome back, {authenticatedUser.name.split(' ')[0]}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select an authorized workspace to begin your session:
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {Array.from(new Set(authenticatedUser.portalAssignments.map(a => a.portalId))).map(portalId => {
                  const info = getPortalInfo(portalId);
                  return (
                    <button
                      key={portalId}
                      onClick={() => handleSelectWorkspace(portalId)}
                      className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white shrink-0 mt-0.5">
                          {info.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                            {info.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {info.desc}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition shrink-0 ml-2" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : showForgotPassword ? (
            /* ------------------------------------------------------------- */
            /* FORGOT PASSWORD SCREEN                                        */
            /* ------------------------------------------------------------- */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold">Credential Recovery</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                For security and institutional compliance, password resets and institutional PIN renewals are governed by the Registrar and Directorate of ICT.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-slate-700">
                <div>
                  <span className="font-semibold text-slate-800">Students:</span> Present your national ID or student identification card at the Academic Registry help desk.
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Staff & Faculty:</span> Contact ICT Support at <span className="font-mono text-slate-800">support@{institutionalSettings.shortName?.toLowerCase() || 'apex'}.edu</span> using your institutional mailbox.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            /* ------------------------------------------------------------- */
            /* STANDARD LOGIN FORM (Section 49)                              */
            /* ------------------------------------------------------------- */
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Institutional Identifier or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifierInput}
                    onChange={e => setIdentifierInput(e.target.value)}
                    placeholder="Admission No., Staff ID, or Email"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition min-h-[42px]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="Enter your institutional password"
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition min-h-[42px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                id="btn_submit_login"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[42px]"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Institutional Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Protected by Institutional Access Governance
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
