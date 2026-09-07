import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'College ERP Multi-Portal Platform',
  description: 'Enterprise-grade multi-portal College ERP with isolated domain portals, contextual RBAC/ABAC security, complete governed CRUD & data lifecycle management (drafts, approvals, locks, soft deletes, versioning, rollback), segregation of duties, and cross-portal event pipelines.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
