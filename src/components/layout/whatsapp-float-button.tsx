'use client';

import { motion } from 'framer-motion';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { EASE } from '@/lib/motion';

export function WhatsappFloatButton() {
  return (
    <div className="fixed bottom-6 right-6 z-30 hidden lg:block">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1, ease: EASE }}
      >
        {/* Slow, infrequent pulse ring — a heartbeat, not a strobe */}
        <motion.span
          className="absolute inset-0 rounded-full bg-whatsapp/50"
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: 'easeOut' }}
          aria-hidden="true"
        />
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
          <WhatsappCtaLink aria-label="Chat on WhatsApp" className="h-14 w-14 shadow-lg hover:scale-[1.08]" variant="icon">
            <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current" aria-hidden="true">
              <path d="M16.001 2.667c-7.364 0-13.334 5.97-13.334 13.333 0 2.352.615 4.646 1.781 6.666L2.667 29.333l6.84-1.746a13.26 13.26 0 0 0 6.494 1.68h.006c7.363 0 13.333-5.97 13.333-13.334 0-3.56-1.387-6.907-3.905-9.427a13.24 13.24 0 0 0-9.434-3.839Zm0 24.4h-.005a11.06 11.06 0 0 1-5.638-1.544l-.404-.24-4.06 1.035 1.084-3.958-.264-.407a11.05 11.05 0 0 1-1.7-5.885c0-6.113 4.975-11.088 11.09-11.088a11.02 11.02 0 0 1 7.842 3.25 11.02 11.02 0 0 1 3.246 7.845c0 6.114-4.976 11.088-11.09 11.088Zm6.083-8.302c-.334-.167-1.97-.972-2.274-1.083-.305-.11-.527-.166-.75.167-.222.333-.86 1.083-1.055 1.305-.194.222-.388.25-.722.083-.333-.167-1.406-.518-2.678-1.652-.99-.883-1.658-1.973-1.852-2.306-.194-.334-.02-.514.146-.68.15-.15.334-.389.5-.583.167-.194.222-.334.334-.556.111-.222.055-.417-.028-.583-.083-.167-.75-1.807-1.028-2.474-.271-.65-.546-.562-.75-.573l-.639-.011c-.222 0-.583.083-.889.417-.305.333-1.167 1.14-1.167 2.78s1.195 3.226 1.362 3.448c.166.222 2.35 3.587 5.694 5.03.795.343 1.416.548 1.9.7.798.254 1.524.218 2.098.132.64-.095 1.97-.805 2.248-1.583.278-.777.278-1.444.194-1.583-.083-.14-.305-.222-.639-.389Z" />
            </svg>
          </WhatsappCtaLink>
        </motion.div>
      </motion.div>
    </div>
  );
}
