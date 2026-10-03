'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Extremely subtle top progress line — no distracting color, just a quiet sense
 * of "how far through the page you are" for long content (blog/service detail). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-peach-500 via-gold-400 to-peach-500"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
