"use client";

import React from "react";
import { ERPProvider, useERP } from "@/context/erp-context";
import { CentralHeader } from "@/components/layout/CentralHeader";
import { PortalNavigation } from "@/components/layout/PortalNavigation";
import { SecurityTestSuiteModal } from "@/components/common/SecurityTestSuiteModal";
import { CustomRoleBuilderModal } from "@/components/common/CustomRoleBuilderModal";
import { CrossPortalEventsModal } from "@/components/common/CrossPortalEventsModal";
import { AuditTrailDrawer } from "@/components/common/AuditTrailDrawer";
import { PortalHealthModal } from "@/components/common/PortalHealthModal";
import { AccessDeniedView } from "@/components/common/AccessDeniedView";

import { StudentPortalView } from "@/components/portals/student/StudentPortalView";
import { ELearningPortalView } from "@/components/portals/learning/ELearningPortalView";
import { ELibraryPortalView } from "@/components/portals/elibrary/ELibraryPortalView";
import { FinancePortalView } from "@/components/portals/finance/FinancePortalView";
import { ExamPortalView } from "@/components/portals/exam/ExamPortalView";
import { AdminPortalView } from "@/components/portals/admin/AdminPortalView";
import { HrPortalView } from "@/components/portals/hr/HrPortalView";
import { AdmissionsPortalView } from "@/components/portals/admissions/AdmissionsPortalView";
import { HostelPortalView } from "@/components/portals/hostel/HostelPortalView";
import { LecturerPortalView } from "@/components/portals/lecturer/LecturerPortalView";
import PublicLandingPageView from "@/components/portals/public/PublicLandingPageView";
import ApplicantPortalView from "@/components/portals/applicant/ApplicantPortalView";
import HODPortalView from "@/components/portals/hod/HODPortalView";
import RegistrarPortalView from "@/components/portals/registrar/RegistrarPortalView";
import AttachmentPortalView from "@/components/portals/attachment/AttachmentPortalView";
import ProcurementPortalView from "@/components/portals/procurement/ProcurementPortalView";
import PrincipalExecutiveDashboardView from "@/components/portals/principal/PrincipalExecutiveDashboardView";

function ERPAppContent() {
  const { activePortalId, checkPortalAccess } = useERP();
  const accessEvaluation = checkPortalAccess(activePortalId);

  const renderPortalView = () => {
    if (!accessEvaluation.allowed) {
      return (
        <AccessDeniedView
          portalId={activePortalId}
          reason={accessEvaluation.reason}
        />
      );
    }

    switch (activePortalId) {
      case "PUBLIC":
        return <PublicLandingPageView />;
      case "APPLICANT":
        return <ApplicantPortalView />;
      case "HOD":
        return <HODPortalView />;
      case "REGISTRAR":
        return <RegistrarPortalView />;
      case "ATTACHMENT":
        return <AttachmentPortalView />;
      case "PROCUREMENT":
        return <ProcurementPortalView />;
      case "PRINCIPAL":
        return <PrincipalExecutiveDashboardView />;
      case "STUDENT":
        return <StudentPortalView />;
      case "ELEARNING":
        return <ELearningPortalView />;
      case "ELIBRARY":
        return <ELibraryPortalView />;
      case "FINANCE":
        return <FinancePortalView />;
      case "EXAMINATIONS":
        return <ExamPortalView />;
      case "LECTURER":
        return <LecturerPortalView />;
      case "ADMIN":
        return <AdminPortalView />;
      case "HR":
        return <HrPortalView />;
      case "ADMISSIONS":
        return <AdmissionsPortalView />;
      case "HOSTEL":
        return <HostelPortalView />;
      default:
        return <StudentPortalView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <CentralHeader />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <PortalNavigation />
        <main className="min-w-0 flex-1 overflow-y-auto bg-slate-950/80 p-3 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl min-w-0">
            {renderPortalView()}
          </div>
        </main>
      </div>
      <SecurityTestSuiteModal />
      <CustomRoleBuilderModal />
      <CrossPortalEventsModal />
      <AuditTrailDrawer />
      <PortalHealthModal />
    </div>
  );
}

export default function AppPage() {
  return (
    <ERPProvider>
      <ERPAppContent />
    </ERPProvider>
  );
}
