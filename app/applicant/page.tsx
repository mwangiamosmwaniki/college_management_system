'use client';

import React from 'react';
import { ERPProvider } from '@/context/erp-context';
import ApplicantPortalView from '@/components/portals/applicant/ApplicantPortalView';

export default function ApplicantPage() {
  return (
    <ERPProvider>
      <ApplicantPortalView />
    </ERPProvider>
  );
}
