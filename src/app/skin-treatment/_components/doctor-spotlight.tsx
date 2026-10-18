import Image from 'next/image';
import { Award, Languages } from 'lucide-react';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ImageReveal, FadeUp } from '@/components/ui/motion';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { getDoctorBySlug } from '@/data/doctors';

export async function DoctorSpotlight() {
  const doctor = await getDoctorBySlug('dr-anika-sharma');
  if (!doctor) return null;

  const bookingContext = { doctor: doctor.name, service: 'Skin Treatment' };

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Meet Your Doctor" title="Personalised Care, Backed By Expertise" />
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 sm:grid-cols-[280px_1fr]">
          <ImageReveal className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-2xl">
            <Image src={doctor.photo} alt={doctor.name} fill sizes="280px" className="object-cover" />
          </ImageReveal>
          <FadeUp standalone>
            <h3 className="font-display text-2xl font-medium text-charcoal-900">{doctor.name}</h3>
            <p className="mt-1 text-sm font-medium text-peach-600">{doctor.qualification}</p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal-500">{doctor.bio}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {doctor.specialization.map((spec) => (
                <span key={spec} className="rounded-full bg-peach-50 px-3 py-1 text-xs font-medium text-peach-700">
                  {spec}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-charcoal-500">
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-gold-500" />
                {doctor.experienceYears}+ years experience
              </span>
              {doctor.languages.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Languages className="h-4 w-4 text-gold-500" />
                  {doctor.languages.join(', ')}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <BookAppointmentButton context={bookingContext}>Book With {doctor.name.split(' ')[1] ?? 'Doctor'}</BookAppointmentButton>
              <WhatsappCtaLink context={bookingContext}>WhatsApp</WhatsappCtaLink>
            </div>
          </FadeUp>
        </div>
      </Container>
    </Section>
  );
}
