import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section } from '@/components/ui/container';
import { ResultsGallery } from '@/components/results-gallery';
import { getAllBeforeAfterResults, getBeforeAfterCategories } from '@/data/before-after';
import { getAllDoctors } from '@/data/doctors';
import { getAllClinics } from '@/data/clinics';

export const metadata: Metadata = {
  title: 'Before & After Results',
  description: 'Real patient results across skin, hair, laser, anti-ageing, and body treatments.',
};

export default async function ResultsPage() {
  const [results, categories, doctors, clinics] = await Promise.all([
    getAllBeforeAfterResults(),
    getBeforeAfterCategories(),
    getAllDoctors(),
    getAllClinics(),
  ]);
  return (
    <>
      <Breadcrumb items={[{ label: 'Results' }]} />
      <section className="bg-gradient-to-b from-peach-50 to-white py-16 text-center">
        <Container>
          <h1 className="font-display text-4xl font-semibold text-charcoal-900">Before &amp; After Results</h1>
          <p className="mx-auto mt-3 max-w-2xl text-charcoal-500">
            Drag the slider on any result to see the difference. Results shown are illustrative and vary by
            individual.
          </p>
        </Container>
      </section>
      <Section>
        <Container>
          <ResultsGallery results={results} categories={categories} doctors={doctors} clinics={clinics} />
        </Container>
      </Section>
    </>
  );
}
