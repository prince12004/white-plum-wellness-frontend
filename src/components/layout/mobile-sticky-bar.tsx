'use client';

import { motion } from 'framer-motion';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { EASE } from '@/lib/motion';

export function MobileStickyBar() {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
      className="fixed inset-x-0 bottom-0 z-30 flex gap-2.5 border-t border-ivory-200 bg-white/90 p-3 shadow-[0_-8px_24px_-4px_rgba(33,26,23,0.1)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <WhatsappCtaLink className="h-11 flex-1">WhatsApp</WhatsappCtaLink>
      <BookAppointmentButton className="h-11 flex-1">Book Appointment</BookAppointmentButton>
    </motion.div>
  );
}
