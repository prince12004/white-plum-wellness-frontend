import { Container, Section, SectionHeading } from '@/components/ui/container';
import { BeforeAfterSlider } from '@/components/before-after-slider';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { getResultsByCategory } from '@/data/before-after';

export async function ResultsStrip() {
  const results = await getResultsByCategory('Skin');
  const featured = results.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <Section tone="muted">
      <Container>
        <SectionHeading
          eyebrow="Real Results"
          title="Real Skin Transformations"
          description="Drag the slider to see the difference — genuine patient results, not stock photos."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((result, i) => (
            <ScrollReveal key={result.id} delay={i * 100} className="flex flex-col gap-3">
              <BeforeAfterSlider beforeImage={result.beforeImage} afterImage={result.afterImage} />
              <p className="text-sm font-medium text-charcoal-900">{result.title}</p>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
