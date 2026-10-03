'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@white/ui';

const TABS = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/saved', label: 'Saved' },
];

export function DashboardTabs() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex gap-1 border-b border-ivory-200">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'relative px-4 py-2.5 font-display text-sm font-medium transition-colors',
              isActive ? 'text-peach-600' : 'text-charcoal-600 hover:text-peach-600',
            )}
          >
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-peach-500 to-gold-400" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
