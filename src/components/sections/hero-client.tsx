'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Star, Users } from 'lucide-react';
import { cn } from '@white/ui';
import type { HeroSlide } from '@white/types';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { RotatingWord } from '@/components/ui/rotating-word';
import { avatarImage } from '@/data/images';

const trustIndicators = [
  { icon: Users, label: '25,000+ Happy Clients' },
  { icon: ShieldCheck, label: 'Certified Dermatologists' },
  { icon: Sparkles, label: '40+ Advanced Treatments' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const textStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const textItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function splitLastWord(title: string): [string, string] {
  const parts = title.split(' ');
  const last = parts.pop() ?? '';
  return [parts.join(' '), last];
}

export function HeroClient({ slides, ctaLabel }: { slides: HeroSlide[]; ctaLabel: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index];
  if (!slide) return null;
  const [titleLead, titleAccent] = splitLastWord(slide.title);

  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-charcoal-900 text-white sm:min-h-[92vh]">
      {slides.map((s, i) => (
        <Image
          key={`${s.title}-${i}`}
          src={s.image}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          unoptimized
          className={cn(
            'absolute inset-0 object-cover transition-opacity duration-[1400ms] ease-out',
            i === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/65 to-charcoal-900/25" />

      {/* Ambient glow blobs — the warm, layered light that reads "premium" instead of flat */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-peach-500/25 blur-[110px]"
          animate={{ y: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-gold-400/20 blur-[100px]"
          animate={{ y: [0, -24, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      {/* Floating social-proof card — fills the empty right side and adds the kind
          of "someone actually designed this" detail a generated template skips. */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
        className="absolute right-8 top-32 z-10 hidden w-64 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md lg:block xl:right-16"
      >
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
          ))}
        </div>
        <p className="mt-2 font-display text-2xl font-medium text-white">4.9 / 5</p>
        <p className="text-sm text-ivory-100/70">from 2,400+ verified reviews</p>
        <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
          <div className="flex -space-x-2">
            {['t1', 't3', 't5', 't9'].map((seed) => (
              <div key={seed} className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-charcoal-900">
                <Image src={avatarImage(seed, 56)} alt="" fill sizes="28px" className="object-cover" />
              </div>
            ))}
          </div>
          <p className="text-xs text-ivory-100/70">Loved by patients across 5 cities</p>
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-24">
        <motion.div key={index} initial="hidden" animate="visible" variants={textStagger}>
          <motion.p
            variants={textItem}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-peach-300"
          >
            <span className="h-px w-8 bg-peach-400" />
            {slide.eyebrow}
          </motion.p>

          <motion.h1
            variants={textItem}
            className="mt-5 max-w-2xl font-display text-5xl font-medium leading-[1.08] sm:text-6xl lg:text-7xl"
          >
            {titleLead}{' '}
            <span className="bg-gradient-to-r from-peach-300 via-peach-200 to-gold-300 bg-clip-text italic text-transparent">
              {titleAccent}
            </span>
          </motion.h1>

          <motion.p variants={textItem} className="mt-6 max-w-xl text-lg leading-relaxed text-ivory-100/80 sm:text-xl">
            {slide.description}
          </motion.p>

          <motion.p variants={textItem} className="mt-4 flex items-center gap-2 text-base text-ivory-100/70">
            We specialise in
            <RotatingWord
              words={['Skin', 'Hair', 'Laser', 'Anti-Ageing', 'Bridal Glow']}
              className="font-display font-semibold text-peach-300"
            />
          </motion.p>

          <motion.div variants={textItem} className="mt-8 hidden flex-wrap items-center gap-3 lg:flex">
            <BookAppointmentButton size="lg">{ctaLabel}</BookAppointmentButton>
            <WhatsappCtaLink className="h-12 px-6 text-base">WhatsApp Now</WhatsappCtaLink>
          </motion.div>

          <motion.div variants={textItem} className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-6">
            {trustIndicators.map(({ icon: IndicatorIcon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-ivory-100/80">
                <IndicatorIcon className="h-4 w-4 text-peach-300" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5">
            {slides.map((s, i) => (
              <button
                key={`${s.title}-${i}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  i === index ? 'w-6 bg-peach-400' : 'w-1.5 bg-white/40',
                )}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
