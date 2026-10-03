'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@white/ui';
import { primaryNav } from '@/data/nav';
import { siteConfig } from '@/data/site';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { EASE } from '@/lib/motion';

const menuStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const menuItem = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
};

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          'absolute inset-0 bg-charcoal-900/50 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-ivory-200 px-5 py-4">
          <span className="font-display text-base font-semibold text-charcoal-900">{siteConfig.businessName}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-charcoal-700 hover:bg-ivory-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <motion.nav
          className="flex-1 overflow-y-auto px-3 py-4"
          initial="hidden"
          animate={open ? 'visible' : 'hidden'}
          variants={menuStagger}
        >
          {primaryNav.map((item) => (
            <motion.div key={item.href} variants={menuItem} className="border-b border-ivory-100 last:border-none">
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex-1 px-2 py-3 text-sm font-medium text-charcoal-800 transition-colors hover:text-peach-600"
                >
                  {item.label}
                </Link>
                {item.megaMenu && (
                  <button
                    type="button"
                    aria-label={`Toggle ${item.label} submenu`}
                    onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                    className="flex h-9 w-9 items-center justify-center text-charcoal-400"
                  >
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                        expanded === item.label && 'rotate-180',
                      )}
                    />
                  </button>
                )}
              </div>
              {item.megaMenu && (
                <div
                  className={cn(
                    'grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    expanded === item.label ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-3 px-2 pb-4">
                      {item.megaMenu.columns.map((col) => (
                        <div key={col.heading}>
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-charcoal-300">
                            {col.heading}
                          </p>
                          <div className="flex flex-col gap-1.5 pl-2">
                            {col.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
                                className="text-sm text-charcoal-600 transition-colors hover:text-peach-600"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.nav>

        <div className="border-t border-ivory-200 p-4">
          <BookAppointmentButton className="w-full">Book Appointment</BookAppointmentButton>
        </div>
      </div>
    </div>
  );
}
