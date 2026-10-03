import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section } from '@/components/ui/container';
import { ConcernCard } from '@/components/cards/concern-card';
import { getAllConcerns } from '@/data/concerns';

export const metadata: Metadata = {
  title: 'Concerns',
  description: 'Browse by concern to find the right skin, hair, or body treatment for you.',
};

export default async function ConcernsPage() {
  const concerns = await getAllConcerns();
  return (
    <>
      <Breadcrumb items={[{ label: 'Concerns' }]} />
      <section className="bg-gradient-to-b from-peach-50 to-white py-16 text-center">
        <Container>
          <h1 className="font-display text-4xl font-semibold text-charcoal-900">What&apos;s Bothering You?</h1>
          <p className="mx-auto mt-3 max-w-2xl text-charcoal-500">
            Start with your concern and we&apos;ll point you to the treatments, doctors, and packages that address it.
          </p>
        </Container>
      </section>
      <Section>
        <Container>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {concerns.map((concern) => (
              <ConcernCard key={concern.slug} concern={concern} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
