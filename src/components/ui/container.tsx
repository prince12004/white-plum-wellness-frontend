'use client';

import { motion } from 'framer-motion';
import { cn } from '@white/ui';

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />;
}

export function Section({
  className,
  tone = 'default',
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { tone?: 'default' | 'muted' | 'dark' }) {
  return (
    <section
      className={cn(
        'relative overflow-hidden py-16 md:py-24',
        tone === 'muted' && 'bg-ivory-100',
        tone === 'dark' && 'bg-charcoal-900 text-white',
        className,
      )}
      {...props}
    >
      {tone === 'muted' && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-peach-200/40 blur-[100px]" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold-200/40 blur-[100px]" />
        </div>
      )}
      <div className="relative">{children}</div>
    </section>
  );
}

export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-peach-600', className)}
      {...props}
    />
  );
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <motion.div
      className={cn('mb-12 max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
    >
      {eyebrow && (
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
          className={cn('flex items-center gap-2', align === 'center' && 'justify-center')}
        >
          <span className="h-px w-8 bg-gradient-to-r from-peach-500 to-gold-400" />
          <Eyebrow className="mb-0">{eyebrow}</Eyebrow>
        </motion.div>
      )}
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 20, scale: 0.88 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
        }}
        className="mt-3 font-display text-4xl font-medium text-charcoal-900 md:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
          className="mt-4 text-base leading-relaxed text-charcoal-500 sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
