import { Quote } from 'lucide-react';
import { Container, Section } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Marquee } from '@/components/ui/marquee';
import { awards, mediaLogos } from '@/data/content';

export function AwardsSection() {
  const [headline, ...rest] = awards;

  return (
    <Section tone="muted">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          {/* Left: one oversized award, treated as an editorial pull-quote — not a card */}
          <ScrollReveal className="lg:col-span-7">
            <Quote className="h-10 w-10 text-peach-300" strokeWidth={1.5} />
            {headline && (
              <p className="mt-4 max-w-lg font-display text-3xl font-medium leading-[1.15] text-charcoal-900 sm:text-4xl">
                {headline.title}
              </p>
            )}
            {headline && (
              <p className="mt-4 text-sm uppercase tracking-[0.15em] text-charcoal-400">
                {headline.issuer} · {headline.year}
              </p>
            )}
          </ScrollReveal>

          {/* Right: everything else as a plain divided list, not repeated cards */}
          <ScrollReveal delay={150} className="lg:col-span-5">
            <ul className="divide-y divide-charcoal-900/10 border-t border-charcoal-900/10">
              {rest.map((award) => (
                <li key={award.title} className="flex items-baseline justify-between gap-4 py-4">
                  <span className="font-display text-base text-charcoal-900">{award.title}</span>
                  <span className="shrink-0 text-xs text-charcoal-400">{award.year}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>

        <div className="mt-16 border-t border-charcoal-900/10 pt-10">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-400">As featured in</p>
          <Marquee durationSeconds={24}>
            {mediaLogos.map((logo) => (
              <span
                key={logo}
                className="rounded-full border border-charcoal-900/15 px-5 py-2 font-display text-sm text-charcoal-700"
              >
                {logo}
              </span>
            ))}
          </Marquee>
        </div>
      </Container>
    </Section>
  );
}
