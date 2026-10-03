'use client';

import { motion } from 'framer-motion';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { EASE } from '@/lib/motion';
import { treatmentJourney } from '@/data/content';

export function TreatmentJourney() {
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="How It Works" title="Your Treatment Journey" description="A clear, five-step process from first consultation to lasting results." />
        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-5">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-ivory-200 sm:block" aria-hidden="true" />
          <motion.div
            className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-gradient-to-r from-peach-500 via-gold-400 to-peach-500 sm:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
            aria-hidden="true"
          />
          {treatmentJourney.map((item, i) => (
            <ScrollReveal key={item.step} delay={i * 100} className="relative flex flex-col items-center text-center">
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-peach-500 font-display text-sm font-semibold text-white">
                {item.step}
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-charcoal-900">{item.title}</h3>
              <p className="mt-1 text-xs text-charcoal-500">{item.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
