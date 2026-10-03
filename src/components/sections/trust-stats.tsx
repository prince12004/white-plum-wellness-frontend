import { Section } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { StatCounter } from '@/components/ui/stat-counter';
import { stats } from '@/data/content';

export function TrustStats() {
  return (
    <Section className="border-b border-ivory-200 bg-charcoal-900 py-10 text-white md:py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4 lg:divide-x lg:divide-white/10 lg:px-8">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 100} className="text-center">
            <p className="bg-gradient-to-r from-peach-300 via-gold-200 to-gold-300 bg-clip-text font-display text-3xl font-semibold text-transparent sm:text-4xl">
              <StatCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ivory-100/70 sm:text-sm">{stat.label}</p>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
