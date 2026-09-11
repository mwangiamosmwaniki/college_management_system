'use client';

import React from 'react';
import { ERPProvider, useERP } from '@/context/erp-context';
import { CentralHeader } from '@/components/layout/CentralHeader';
import { PortalNavigation } from '@/components/layout/PortalNavigation';
import { SecurityTestSuiteModal } from '@/components/common/SecurityTestSuiteModal';
import { CustomRoleBuilderModal } from '@/components/common/CustomRoleBuilderModal';
import { CrossPortalEventsModal } from '@/components/common/CrossPortalEventsModal';
import { AuditTrailDrawer } from '@/components/common/AuditTrailDrawer';
import { PortalHealthModal } from '@/components/common/PortalHealthModal';
import { AccessDeniedView } from '@/components/common/AccessDeniedView';
import { UnifiedLoginModal } from '@/components/common/UnifiedLoginModal';

// Portal Views
import { StudentPortalView } from '@/components/portals/student/StudentPortalView';
import { ELearningPortalView } from '@/components/portals/learning/ELearningPortalView';
import { ELibraryPortalView } from '@/components/portals/elibrary/ELibraryPortalView';
import { FinancePortalView } from '@/components/portals/finance/FinancePortalView';
import { ExamPortalView } from '@/components/portals/exam/ExamPortalView';
import { AdminPortalView } from '@/components/portals/admin/AdminPortalView';
import { HrPortalView } from '@/components/portals/hr/HrPortalView';
import { AdmissionsPortalView } from '@/components/portals/admissions/AdmissionsPortalView';
import { HostelPortalView } from '@/components/portals/hostel/HostelPortalView';
import { LecturerPortalView } from '@/components/portals/lecturer/LecturerPortalView';
import PublicLandingPageView from '@/components/portals/public/PublicLandingPageView';
import ApplicantPortalView from '@/components/portals/applicant/ApplicantPortalView';
import HODPortalView from '@/components/portals/hod/HODPortalView';
import RegistrarPortalView from '@/components/portals/registrar/RegistrarPortalView';
import AttachmentPortalView from '@/components/portals/attachment/AttachmentPortalView';
import ProcurementPortalView from '@/components/portals/procurement/ProcurementPortalView';
import PrincipalExecutiveDashboardView from '@/components/portals/principal/PrincipalExecutiveDashboardView';

function ERPAppContent() {
  const {
    activePortalId,
    currentUser,
    checkPortalAccess
  } = useERP();

  // Evaluate portal access permission for current user
  const accessEvaluation = checkPortalAccess(activePortalId);

  // Render the appropriate portal view
  const renderPortalView = () => {
    // If user lacks permission for the active portal, show the RBAC Access Denied boundary intercept
    if (!accessEvaluation.allowed) {
      return <AccessDeniedView portalId={activePortalId} reason={accessEvaluation.reason} />;
    }

    switch (activePortalId) {
      case 'PUBLIC':
        return <PublicLandingPageView />;
      case 'APPLICANT':
        return <ApplicantPortalView />;
      case 'HOD':
        return <HODPortalView />;
      case 'REGISTRAR':
        return <RegistrarPortalView />;
      case 'ATTACHMENT':
        return <AttachmentPortalView />;
      case 'PROCUREMENT':
        return <ProcurementPortalView />;
      case 'PRINCIPAL':
        return <PrincipalExecutiveDashboardView />;
      case 'STUDENT':
        return <StudentPortalView />;
      case 'ELEARNING':
        return <ELearningPortalView />;
      case 'ELIBRARY':
        return <ELibraryPortalView />;
      case 'FINANCE':
        return <FinancePortalView />;
      case 'EXAMINATIONS':
        return <ExamPortalView />;
      case 'LECTURER':
        return <LecturerPortalView />;
      case 'ADMIN':
        return <AdminPortalView />;
      case 'HR':
        return <HrPortalView />;
      case 'ADMISSIONS':
        return <AdmissionsPortalView />;
      case 'HOSTEL':
        return <HostelPortalView />;
      default:
        return <StudentPortalView />;
    }
  };

  const isAdminUser = currentUser.portalAssignments.some(
    a => a.portalId === 'ADMIN' && (a.isAdmin || a.roleId.includes('ADMIN') || a.roleId === 'ROLE_SUPER_ADMIN')
  );

  // If active portal is the PUBLIC landing page, render dedicated institutional public layout
  if (activePortalId === 'PUBLIC') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
        <PublicLandingPageView />
        <UnifiedLoginModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. Central Global SSO Header */}
      <CentralHeader />

      {/* 2. Main Portal Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Portal-Specific Sidebar Navigation */}
        <PortalNavigation />

        {/* Dynamic Portal Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-slate-950/80">
          <div className="max-w-7xl mx-auto">
            {renderPortalView()}
          </div>
        </main>
      </div>

      {/* 3. Global Interactive Modals */}
      <UnifiedLoginModal />

      {/* 4. Restricted Admin Diagnostic Tools (Section 36: Only rendered for authorized administrators) */}
      {isAdminUser && (
        <>
          <SecurityTestSuiteModal />
          <CustomRoleBuilderModal />
          <CrossPortalEventsModal />
          <AuditTrailDrawer />
          <PortalHealthModal />
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <ERPProvider>
      <ERPAppContent />
    </ERPProvider>
  );
}
