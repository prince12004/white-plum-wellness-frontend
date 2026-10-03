'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@white/ui';
import { NAV_SECTIONS } from './nav-config';
import type { Session } from '@/lib/admin/auth';
import { hasPermission } from '@/lib/admin/permissions';
import { Logo } from '@/components/logo';

const EASE = [0.22, 1, 0.36, 1] as const;

interface SidebarProps {
  session: Session;
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ session, mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const nav = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-6">
      {NAV_SECTIONS.map((section, sectionIndex) => {
        const visibleItems = section.items.filter((item) => hasPermission(session, item.permission));
        if (visibleItems.length === 0) return null;

        return (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: sectionIndex * 0.04, ease: EASE }}
          >
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/35">
              {section.label}
            </p>
            <div className="mt-2 flex flex-col gap-0.5">
              {visibleItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative flex items-center gap-2.5 overflow-hidden rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-white' : 'text-white/70 hover:text-white',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-nav-pill"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-peach-500 to-peach-600 shadow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-lg bg-white/0 transition-colors duration-200 group-hover:bg-white/5" />
                    )}
                    <Icon
                      className={cn(
                        'relative h-[18px] w-[18px] shrink-0 transition-colors',
                        isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80',
                      )}
                    />
                    <span className="relative flex-1 truncate">{item.label}</span>
                    {item.status === 'placeholder' && (
                      <span className="relative rounded-full bg-gold-400/20 px-2 py-0.5 text-[10px] font-semibold text-gold-300">
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop — always-visible static column */}
      <aside className="hidden h-full w-56 shrink-0 flex-col border-r border-charcoal-900/10 bg-charcoal-900 md:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-6">
          <div className="rounded-xl bg-white p-1.5">
            <Logo className="h-8 sm:h-8 lg:h-8" />
          </div>
        </div>
        {nav}
      </aside>

      {/* Mobile — slide-in drawer + backdrop, only mounted when open */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-charcoal-900/60 md:hidden"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: EASE }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-charcoal-900 shadow-2xl md:hidden"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
                <div className="rounded-xl bg-white p-1.5">
                  <Logo className="h-8 sm:h-8 lg:h-8" />
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {nav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
