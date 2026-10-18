import { MapPin, Phone } from 'lucide-react';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { getAllClinics } from '@/data/clinics';

export async function ReachUsSection() {
  const clinics = await getAllClinics();
  const featured = clinics.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Visit Us" title="Reach Us" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featured.map((clinic, i) => (
            <ScrollReveal key={clinic.slug} delay={i * 100}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-ivory-200 bg-white p-5 shadow-sm">
                <p className="font-display text-base font-semibold text-charcoal-900">{clinic.name}</p>
                <p className="flex items-start gap-2 text-sm text-charcoal-500">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-peach-500" />
                  {clinic.address}, {clinic.area}, {clinic.city}
                </p>
                <p className="flex items-center gap-2 text-sm text-charcoal-500">
                  <Phone className="h-4 w-4 shrink-0 text-peach-500" />
                  {clinic.phone}
                </p>
                <WhatsappCtaLink context={{ clinic: clinic.name, city: clinic.city }} className="mt-1 h-9 w-full text-xs">
                  WhatsApp This Clinic
                </WhatsappCtaLink>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
