'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, Phone, User, X } from 'lucide-react';
import { cn } from '@white/ui';
import { primaryNav } from '@/data/nav';
import { siteConfig } from '@/data/site';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { WhatsappIcon } from '@/components/ui/whatsapp-icon';
import { Logo } from '@/components/logo';
import { EASE } from '@/lib/motion';
import { MobileMenu } from './mobile-menu';

/** tel: links can't carry spaces/parens — strip everything but digits and a leading +. */
const telHref = `tel:${siteConfig.contactPhone.replace(/[^\d+]/g, '')}`;

function CallButton({ className }: { className?: string }) {
  return (
    <a
      href={telHref}
      aria-label={`Call ${siteConfig.contactPhone}`}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full border border-peach-300 text-peach-600 transition-colors hover:bg-peach-50',
        className,
      )}
    >
      <motion.span
        className="flex"
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Phone className="h-[1.15rem] w-[1.15rem]" />
      </motion.span>
      <motion.span
        className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold-500"
        animate={{ opacity: [1, 0.25, 1], scale: [1, 1.35, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
    </a>
  );
}

function AccountButton({ name, className }: { name: string | null; className?: string }) {
  return (
    <Link
      href="/dashboard"
      aria-label={name ? `${name}'s account` : 'My account'}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full border border-ivory-200 text-charcoal-700 transition-colors hover:border-peach-300 hover:text-peach-600',
        className,
      )}
    >
      <User className="h-[1.1rem] w-[1.1rem]" />
    </Link>
  );
}

const headerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const headerItem = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/customer-auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCustomerName(data ? (data.name ?? '') : null))
      .catch(() => setCustomerName(null));
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          scrolled ? 'border-ivory-200 bg-ivory-50/95 shadow-sm backdrop-blur' : 'border-transparent bg-ivory-50',
        )}
      >
        <motion.div
          className={cn('mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-500 sm:px-6 lg:px-8', scrolled ? 'h-16 lg:h-[4.5rem]' : 'h-16 lg:h-20')}
          initial="hidden"
          animate="visible"
          variants={headerStagger}
        >
          <motion.div variants={headerItem}>
            <Link href="/">
              <Logo />
            </Link>
          </motion.div>

          <motion.nav variants={headerItem} className="hidden items-center gap-0.5 lg:flex" onMouseLeave={() => setOpenMega(null)}>
            {primaryNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <div key={item.href} className="group relative" onMouseEnter={() => setOpenMega(item.megaMenu ? item.label : null)}>
                  <Link
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-1 rounded-lg px-3.5 py-2 font-display text-[0.95rem] font-medium transition-colors',
                      isActive ? 'text-peach-600' : 'text-charcoal-700 hover:text-peach-600',
                    )}
                  >
                    {item.label}
                    {item.megaMenu && (
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
                    )}
                    {isActive ? (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-peach-500 to-gold-400" />
                    ) : (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-peach-500 to-gold-400 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                    )}
                  </Link>

                  <AnimatePresence>
                    {item.megaMenu && openMega === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-3"
                      >
                        <div className="grid grid-cols-3 gap-6 rounded-2xl border border-ivory-200 bg-white p-6 shadow-xl">
                          {item.megaMenu.columns.map((col) => (
                            <div key={col.heading}>
                              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-charcoal-300">
                                {col.heading}
                              </p>
                              <ul className="flex flex-col gap-2">
                                {col.links.map((link) => (
                                  <li key={link.href}>
                                    <Link
                                      href={link.href}
                                      className="group/link relative inline-flex text-sm text-charcoal-700 transition-colors hover:text-peach-600"
                                    >
                                      {link.label}
                                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-peach-500 transition-all duration-300 group-hover/link:w-full" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.nav>

          <motion.div variants={headerItem} className="hidden items-center gap-3 lg:flex">
            <CallButton />
            {customerName !== undefined && customerName !== null && <AccountButton name={customerName} />}
            <WhatsappCtaLink className="gap-1.5">
              <WhatsappIcon className="h-4 w-4" />
              WhatsApp
            </WhatsappCtaLink>
            <BookAppointmentButton size="md">Book Appointment</BookAppointmentButton>
          </motion.div>

          <motion.div variants={headerItem} className="flex items-center gap-2 lg:hidden">
            <CallButton className="h-9 w-9" />
            {customerName !== undefined && customerName !== null && (
              <AccountButton name={customerName} className="h-9 w-9" />
            )}
            <WhatsappCtaLink variant="icon" aria-label="WhatsApp">
              <WhatsappIcon className="h-[1.4rem] w-[1.4rem]" />
            </WhatsappCtaLink>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-charcoal-700 hover:bg-ivory-100"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex items-center justify-center"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </motion.div>
        </motion.div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
