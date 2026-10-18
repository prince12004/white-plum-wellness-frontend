'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Sparkles, Star, Users } from 'lucide-react';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { AnimatedWords, ImageReveal, PopReveal, ScaleIn, Stagger, FadeUp } from '@/components/ui/motion';
import { placeholderImage, avatarImage } from '@/data/images';
import { EASE } from '@/lib/motion';

const trustIndicators = [
  { icon: Users, label: '25,000+ Happy Clients' },
  { icon: ShieldCheck, label: 'Certified Dermatologists' },
  { icon: Sparkles, label: 'Advanced, Painless Protocols' },
];

const bookingContext = { service: 'Skin Treatment', concern: 'Skin Concerns' };

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-charcoal-900 text-white">
      <div className="absolute inset-0">
        <Image
          src={placeholderImage('cat-skin', 1600, 1200)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/40" />
      </div>

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

      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <ScaleIn delay={0.1} className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
          <Sparkles className="h-3.5 w-3.5" />
          Complimentary Dermatologist Consultation
        </ScaleIn>

        <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.1] sm:text-5xl lg:text-6xl">
          <AnimatedWords text="Struggling With Acne, Pigmentation, or Uneven Skin Tone?" />
        </h1>

        <PopReveal delay={0.3} className="mt-6 max-w-xl text-lg leading-relaxed text-ivory-100/80">
          <p>
            Get a personalised treatment plan from certified dermatologists — clinically proven protocols for
            clearer, healthier skin, no guesswork.
          </p>
        </PopReveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <BookAppointmentButton size="lg" context={bookingContext}>
            Book Free Consultation
          </BookAppointmentButton>
          <WhatsappCtaLink context={bookingContext} className="h-12 px-6 text-base">
            WhatsApp Us
          </WhatsappCtaLink>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-3 flex items-center gap-1.5 text-xs text-ivory-100/60"
        >
          <Lock className="h-3 w-3" />
          Your information stays confidential — no spam, ever.
        </motion.p>

        <Stagger className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6" staggerDelay={0.1}>
          {trustIndicators.map(({ icon: IndicatorIcon, label }) => (
            <FadeUp key={label} className="flex items-center gap-2 text-sm text-ivory-100/80">
              <IndicatorIcon className="h-4 w-4 text-peach-300" />
              {label}
            </FadeUp>
          ))}
        </Stagger>

        <ImageReveal delay={0.4} className="mt-6 flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 pr-5 backdrop-blur-md">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
            ))}
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div className="flex -space-x-2">
            {['t1', 't3', 't5', 't9'].map((seed) => (
              <div key={seed} className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-charcoal-900">
                <Image src={avatarImage(seed, 56)} alt="" fill sizes="28px" className="object-cover" />
              </div>
            ))}
          </div>
          <p className="text-xs text-ivory-100/70">4.9/5 from 2,400+ verified reviews</p>
        </ImageReveal>
      </div>
    </section>
  );
}
