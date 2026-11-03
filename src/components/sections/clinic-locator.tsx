import { Section } from '@/components/ui/container';
import { getAllClinics, getCities } from '@/data/clinics';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';
import { ClinicLocatorClient } from './clinic-locator-client';

export async function ClinicLocator({ content }: SectionProps) {
  const [clinics, cities] = await Promise.all([getAllClinics(), getCities()]);

  return (
    <Section>
      <ClinicLocatorClient clinics={clinics} cities={cities} content={sectionContent('clinic-locator', content)} />
    </Section>
  );
}
