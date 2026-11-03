import Link from 'next/link';
import { Button } from '@white/ui';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { BeforeAfterSlider } from '@/components/before-after-slider';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { getAllBeforeAfterResults } from '@/data/before-after';
import { safeHref } from '@/lib/cms/href';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export async function BeforeAfterSection({ content }: SectionProps) {
  const c = sectionContent('before-after', content);
  const beforeAfterResults = await getAllBeforeAfterResults();
  const featured = beforeAfterResults.slice(0, 3);

  return (
    <Section tone="muted">
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((result, i) => (
            <ScrollReveal key={result.id} delay={i * 100} className="flex flex-col gap-3">
              <BeforeAfterSlider beforeImage={result.beforeImage} afterImage={result.afterImage} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">{result.category}</p>
                <p className="text-sm font-medium text-charcoal-900">{result.title}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        {c.ctaLabel && (
          <ScrollReveal delay={300} className="mt-10 text-center">
            <Link href={safeHref(c.ctaHref)}>
              <Button variant="secondary" size="lg">{c.ctaLabel}</Button>
            </Link>
          </ScrollReveal>
        )}
      </Container>
    </Section>
  );
}
