'use client';

import React from 'react';
import { ERPProvider } from '@/context/erp-context';
import PublicLandingPageView from '@/components/portals/public/PublicLandingPageView';

export default function PublicPage() {
  return (
    <ERPProvider>
      <PublicLandingPageView />
    </ERPProvider>
  );
}
