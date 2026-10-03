import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ContactForm } from '@/components/contact-form';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { getAllClinics } from '@/data/clinics';
import { getAllConcerns } from '@/data/concerns';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team — call, WhatsApp, or send us a message.',
};

export default async function ContactPage() {
  const [clinics, concerns] = await Promise.all([getAllClinics(), getAllConcerns()]);
  return (
    <>
      <Breadcrumb items={[{ label: 'Contact' }]} />

      <section className="bg-gradient-to-b from-peach-50 to-white py-16 text-center">
        <Container>
          <h1 className="font-display text-4xl font-semibold text-charcoal-900">Get in Touch</h1>
          <p className="mx-auto mt-3 max-w-2xl text-charcoal-500">
            Have a question, or ready to book? Reach out however works best for you.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionHeading eyebrow="Send a Message" title="Contact Form" align="left" className="mb-6" />
              <ContactForm clinics={clinics} concerns={concerns} />
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-ivory-200 bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-charcoal-900">Quick Contact</h3>
                <div className="mt-4 flex flex-col gap-3 text-sm text-charcoal-600">
                  <a href={`tel:${siteConfig.contactPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-peach-600">
                    <Phone className="h-4 w-4 text-peach-500" /> {siteConfig.contactPhone}
                  </a>
                  <a href={`mailto:${siteConfig.contactEmail}`} className="flex items-center gap-2 hover:text-peach-600">
                    <Mail className="h-4 w-4 text-peach-500" /> {siteConfig.contactEmail}
                  </a>
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-peach-500" /> {siteConfig.address}
                  </p>
                </div>
                <WhatsappCtaLink className="mt-4 w-full">WhatsApp Us</WhatsappCtaLink>
              </div>

              <div className="rounded-2xl border border-ivory-200 bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-charcoal-900">Our Clinics</h3>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-charcoal-600">
                  {clinics.map((clinic) => (
                    <li key={clinic.slug}>
                      <p className="font-medium text-charcoal-900">{clinic.name}</p>
                      <p className="text-xs text-charcoal-400">{clinic.openingHours[0]?.day}: {clinic.openingHours[0]?.hours}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
