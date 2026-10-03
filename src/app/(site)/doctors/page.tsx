import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section } from '@/components/ui/container';
import { DoctorCard } from '@/components/cards/doctor-card';
import { getAllDoctors } from '@/data/doctors';

export const metadata: Metadata = {
  title: 'Our Doctors',
  description: 'Meet our board-certified dermatologists and aesthetic specialists.',
};

export default async function DoctorsPage() {
  const doctors = await getAllDoctors();
  return (
    <>
      <Breadcrumb items={[{ label: 'Doctors' }]} />
      <section className="bg-gradient-to-b from-peach-50 to-white py-16 text-center">
        <Container>
          <h1 className="font-display text-4xl font-semibold text-charcoal-900">Meet Our Doctors</h1>
          <p className="mx-auto mt-3 max-w-2xl text-charcoal-500">
            Every treatment is led by a qualified dermatologist or aesthetic specialist — not a technician following a
            script.
          </p>
        </Container>
      </section>
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.slug} doctor={doctor} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
