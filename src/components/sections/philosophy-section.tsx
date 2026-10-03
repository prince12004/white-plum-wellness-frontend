import { Container } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function PhilosophySection() {
  return (
    <section className="relative overflow-hidden bg-charcoal-900 py-24 text-white">
      {/* A single giant serif quotation mark as a watermark — the kind of oversized
          typographic gesture generic template builders don't reach for. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 select-none font-display text-[28rem] leading-none text-white/[0.04]"
      >
        &rdquo;
      </span>

      <Container className="relative max-w-3xl text-center">
        <ScrollReveal>
          <p className="font-display text-[1.75rem] font-normal italic leading-[1.35] text-ivory-100 sm:text-4xl">
            We believe great skin is never rushed. Every plan starts with listening — not a
            price list —{' '}
            <span className="not-italic text-peach-300">and it&apos;s built around your skin, not a sales target.</span>
          </p>
          <div className="mx-auto mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gold-400/60" />
            <p className="font-display text-sm uppercase tracking-[0.3em] text-gold-300">White Plum Wellness</p>
            <span className="h-px w-10 bg-gold-400/60" />
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
