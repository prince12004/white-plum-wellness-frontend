import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section } from '@/components/ui/container';
import { PackageCard } from '@/components/cards/package-card';
import { getAllPackages } from '@/data/packages';

export const metadata: Metadata = {
  title: 'Packages',
  description: 'Curated, multi-session treatment packages priced transparently upfront.',
};

export default async function PackagesPage() {
  const packages = await getAllPackages();
  return (
    <>
      <Breadcrumb items={[{ label: 'Packages' }]} />
      <section className="bg-gradient-to-b from-peach-50 to-white py-16 text-center">
        <Container>
          <h1 className="font-display text-4xl font-semibold text-charcoal-900">Treatment Packages</h1>
          <p className="mx-auto mt-3 max-w-2xl text-charcoal-500">
            Structured programs designed around specific goals, combining multiple sessions at a transparent, upfront
            price.
          </p>
        </Container>
      </section>
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
