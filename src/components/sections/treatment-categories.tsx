import { Section, SectionHeading } from '@/components/ui/container';
import { Container } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { CategoryCard } from '@/components/cards/category-card';
import { getAllCategories } from '@/data/categories';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

export async function TreatmentCategories({ content }: SectionProps) {
  const c = sectionContent('treatment-categories', content);
  const categories = await getAllCategories();

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          description={c.description.replace('{count}', String(categories.length))}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <ScrollReveal key={category.slug} delay={(i % 4) * 80}>
              <CategoryCard category={category} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
