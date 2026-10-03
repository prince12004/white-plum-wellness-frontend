// Centralized animation tokens — every component in components/ui/motion.tsx
// and every hand-rolled motion.* usage across the site should read timing/easing
// from here rather than hardcoding its own numbers, so the whole site moves on
// one consistent rhythm instead of a dozen slightly-different feels.

/** Premium, decelerating ease — motion that settles rather than bounces. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.3, // micro-interactions: icon nudges, button hovers
  normal: 0.6, // default section/card reveals
  slow: 0.8, // large image/panel reveals
  hero: 1.1, // hero-scale entrances
} as const;

export const STAGGER = {
  tight: 0.04,
  normal: 0.08,
  loose: 0.12,
} as const;
