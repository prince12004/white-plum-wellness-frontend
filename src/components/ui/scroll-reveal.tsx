'use client';

import { motion } from 'framer-motion';
import { EASE, DURATION } from '@/lib/motion';

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: DURATION.normal, delay: delay / 1000, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
