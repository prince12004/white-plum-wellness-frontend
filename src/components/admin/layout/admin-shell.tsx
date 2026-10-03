'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Session } from '@/lib/admin/auth';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { PageTransition } from './page-transition';

/** Owns the mobile sidebar-drawer open/close state — the layout itself is a Server
 * Component (needs the session fetch), so this client boundary is where Sidebar and
 * Topbar actually coordinate the hamburger toggle. */
export function AdminShell({ session, children }: { session: Session; children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer automatically on navigation, so tapping a nav link doesn't
  // leave the overlay sitting open behind the new page.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-ivory-50">
      <Sidebar session={session} mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar session={session} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
