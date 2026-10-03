'use client';

import { MotionConfig } from 'framer-motion';

/** Site-wide reduced-motion handling: framer-motion still commits every animation's
 * final visible state, it just skips the transform/transition for users who have
 * `prefers-reduced-motion` set — one switch instead of checking it in every component. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
