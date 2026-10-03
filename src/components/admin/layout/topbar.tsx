'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@white/ui';
import { apiClient } from '@/lib/admin/api-client';
import type { Session } from '@/lib/admin/auth';
import { NavSearch } from './nav-search';
import { NotificationBell } from './notification-bell';

export function Topbar({ session, onMenuClick }: { session: Session; onMenuClick: () => void }) {
  const router = useRouter();

  async function handleLogout() {
    await apiClient.post('/auth/logout');
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-ivory-200 bg-white/80 px-3 backdrop-blur-sm sm:gap-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-charcoal-600 hover:bg-ivory-100 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden min-w-0 flex-1 sm:block">
        <NavSearch session={session} />
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationBell session={session} />
        <div className="hidden items-center gap-3 rounded-full border border-ivory-200 bg-ivory-50 py-1 pl-1 pr-3 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-peach-500 to-peach-700 text-xs font-semibold text-white">
            {session.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium leading-tight text-charcoal-900">{session.name}</p>
            <p className="text-[11px] leading-tight text-charcoal-500">{session.roleKey.replace(/_/g, ' ')}</p>
          </div>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-peach-500 to-peach-700 text-xs font-semibold text-white sm:hidden">
          {session.name.charAt(0).toUpperCase()}
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 px-2 sm:px-3">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Log out</span>
        </Button>
      </div>
    </header>
  );
}
