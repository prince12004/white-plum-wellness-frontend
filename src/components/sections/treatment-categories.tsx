import { Section, SectionHeading } from '@/components/ui/container';
import { Container } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { CategoryCard } from '@/components/cards/category-card';
import { categories } from '@/data/categories';

export function TreatmentCategories() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="What We Treat"
          title="Explore Our Treatments"
          description="Ten specialised categories of care, each led by dermatologists who focus on getting the fundamentals right."
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
