import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section } from '@/components/ui/container';
import { ClinicsFilter } from '@/components/clinics-filter';
import { getAllClinics, getCities } from '@/data/clinics';

export const metadata: Metadata = {
  title: 'Our Clinics',
  description: 'Find a White Plum clinic near you — locations, timings, and contact details.',
};

export default async function ClinicsPage() {
  const [clinics, cities] = await Promise.all([getAllClinics(), getCities()]);
  return (
    <>
      <Breadcrumb items={[{ label: 'Clinics' }]} />
      <section className="bg-gradient-to-b from-peach-50 to-white py-16 text-center">
        <Container>
          <h1 className="font-display text-4xl font-semibold text-charcoal-900">Our Clinics</h1>
          <p className="mx-auto mt-3 max-w-2xl text-charcoal-500">
            {clinics.length} clinics across India, each delivering the same standard of care.
          </p>
        </Container>
      </section>
      <Section>
        <Container>
          <ClinicsFilter clinics={clinics} cities={cities} />
        </Container>
      </Section>
    </>
  );
}
