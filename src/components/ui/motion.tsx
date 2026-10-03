'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { cn } from '@white/ui';
import { EASE, DURATION, STAGGER } from '@/lib/motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASE } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.normal, delayChildren: 0.05 } },
};

/** Wraps children in a framer-motion stagger container that animates in once, on view. */
export function Stagger({
  children,
  className,
  staggerDelay = STAGGER.normal,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: staggerDelay, delayChildren: 0.05 } } }}
    >
      {children}
    </motion.div>
  );
}

/** Alias matching the spec's naming — identical behaviour to Stagger. */
export const StaggerContainer = Stagger;

/** A single fade-up item — use inside <Stagger> (inherits parent variants) or standalone. */
export function FadeUp({
  children,
  className,
  delay = 0,
  standalone = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  standalone?: boolean;
}) {
  const standaloneProps = standalone
    ? { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.3 } }
    : {};

  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASE, delay } } }}
      {...standaloneProps}
    >
      {children}
    </motion.div>
  );
}

/** Alias matching the spec's naming — identical behaviour to FadeUp. */
export const StaggerItem = FadeUp;

function directionalFade(offset: { x?: number; y?: number }) {
  return {
    hidden: { opacity: 0, ...offset },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: DURATION.normal, ease: EASE } },
  } satisfies Variants;
}

interface DirectionalProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

function makeDirectional(offset: { x?: number; y?: number }) {
  return function Directional({ children, className, delay = 0, once = true }: DirectionalProps) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.25 }}
        variants={directionalFade(offset)}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  };
}

/** Simple opacity-only reveal — no movement, for content that shouldn't shift. */
export const FadeIn = makeDirectional({});
/** Reveals upward (starts below, settles in place) — the default section reveal. */
export const FadeDown = makeDirectional({ y: -24 });
/** Reveals from the left. */
export const FadeLeft = makeDirectional({ x: -32 });
/** Reveals from the right. */
export const FadeRight = makeDirectional({ x: 32 });

/**
 * The punchy "pop in" heading reveal seen on most premium marketing sites —
 * a spring overshoot rather than a linear ease, reserved for hero/section
 * headings rather than every element on the page.
 */
export function PopReveal({ children, className, delay = 0 }: DirectionalProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.85, y: 14 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Gentle scale-in — for badges, icon circles, small emphasis elements. */
export function ScaleIn({ children, className, delay = 0 }: DirectionalProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: DURATION.fast + 0.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Soft blur-to-sharp reveal — reserved for a handful of hero-weight moments, not
 * every element (a blur filter on many elements at once is not GPU-cheap). */
export function BlurReveal({ children, className, delay = 0 }: DirectionalProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: 'blur(12px)', y: 16 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: DURATION.slow, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Premium image reveal: the container clips a slightly-oversized image that
 * settles to its natural scale as it enters view — used for hero/doctor/clinic/
 * gallery imagery instead of a plain opacity fade.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0, scale: 1.08 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: DURATION.slow, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Wraps any element with a lift-on-hover / press-on-tap treatment, for elements
 * that aren't plain CSS `group`-hover cards (e.g. standalone icons, badges). */
export function HoverLift({
  children,
  className,
  lift = 4,
}: {
  children: React.ReactNode;
  className?: string;
  lift?: number;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -lift, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: DURATION.fast, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Desktop-only subtle cursor-follow attraction for a single hero-weight element
 * (e.g. a floating CTA) — never applied broadly, per the "no custom cursor
 * everywhere" rule. */
export function MagneticButton({ children, className, strength = 14 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.3 });

  return (
    <motion.div
      ref={ref}
      className={cn('hidden lg:block', className)}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * (strength / 100));
        y.set((e.clientY - rect.top - rect.height / 2) * (strength / 100));
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Splits a heading into words and reveals them with a staggered upward fade —
 * the "premium template" text-in animation, done with real word-level timing
 * rather than a single fade on the whole line.
 */
export function AnimatedWords({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) {
  const words = text.split(' ');

  return (
    <motion.span
      className={cn('inline-block', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden" aria-hidden="true">
          <motion.span
            className={cn('inline-block', wordClassName)}
            variants={{ hidden: { y: '110%', opacity: 0 }, visible: { y: '0%', opacity: 1, transition: { duration: 0.65, ease: EASE } } }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
