import Link from 'next/link';
import { Button } from '@white/ui';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { BeforeAfterSlider } from '@/components/before-after-slider';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { getAllBeforeAfterResults } from '@/data/before-after';

export async function BeforeAfterSection() {
  const beforeAfterResults = await getAllBeforeAfterResults();
  const featured = beforeAfterResults.slice(0, 3);

  return (
    <Section tone="muted">
      <Container>
        <SectionHeading eyebrow="Real Results" title="Before & After" description="Drag the slider to see the difference — real patient results across our most requested treatments." />
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
        <ScrollReveal delay={300} className="mt-10 text-center">
          <Link href="/results">
            <Button variant="secondary" size="lg">View All Results</Button>
          </Link>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
