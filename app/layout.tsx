import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'College ERP Multi-Portal Platform',
  description: 'Enterprise university multi-portal ERP with isolated domain architectures, fine-grained contextual RBAC, and segregation of duties.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
