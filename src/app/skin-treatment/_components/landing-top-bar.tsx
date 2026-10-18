'use client';

import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { cn } from '@white/ui';
import { siteConfig } from '@/data/site';
import { Logo } from '@/components/logo';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { WhatsappIcon } from '@/components/ui/whatsapp-icon';

const telHref = `tel:${siteConfig.contactPhone.replace(/[^\d+]/g, '')}`;

/** Deliberately nav-free — this is a Google Ads landing page, not the main
 * site shell, so there's nothing here to click except the two conversion
 * actions (call / WhatsApp). No menu, no links away from the page. */
export function LandingTopBar() {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 border-b border-ivory-200 bg-white/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo className="h-9 sm:h-10" />
        <div className="flex items-center gap-2.5">
          <a
            href={telHref}
            aria-label={`Call ${siteConfig.contactPhone}`}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border border-peach-300 text-peach-600 transition-colors hover:bg-peach-50',
            )}
          >
            <Phone className="h-[1.15rem] w-[1.15rem]" />
          </a>
          <WhatsappCtaLink
            context={{ service: 'Skin Treatment' }}
            variant="icon"
            aria-label="Chat on WhatsApp"
            className="h-10 w-10"
          >
            <WhatsappIcon className="h-5 w-5" />
          </WhatsappCtaLink>
        </div>
      </div>
    </motion.header>
  );
}
