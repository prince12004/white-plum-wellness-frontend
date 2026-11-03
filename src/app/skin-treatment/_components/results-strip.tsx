import { Container, Section, SectionHeading } from '@/components/ui/container';
import { BeforeAfterSlider } from '@/components/before-after-slider';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { getResultsByCategory } from '@/data/before-after';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export async function ResultsStrip({ content }: SectionProps) {
  const c = sectionContent('landing-results', content);
  const results = await getResultsByCategory(c.category);
  const featured = results.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <Section tone="muted">
      <Container>
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          description={c.description}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((result, i) => (
            <ScrollReveal key={result.id} delay={i * 100} className="flex flex-col gap-3">
              <BeforeAfterSlider beforeImage={result.beforeImage} afterImage={result.afterImage} />
              <p className="text-sm font-medium text-charcoal-900">{result.title}</p>
            </ScrollReveal>
          ))}
        </div>
        {c.footnote && <p className="mt-6 text-center text-xs text-charcoal-400">{c.footnote}</p>}
      </Container>
    </Section>
  );
}
