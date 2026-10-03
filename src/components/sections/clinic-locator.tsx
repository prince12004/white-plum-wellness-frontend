import { Section } from '@/components/ui/container';
import { getAllClinics, getCities } from '@/data/clinics';
import { ClinicLocatorClient } from './clinic-locator-client';

export async function ClinicLocator() {
  const [clinics, cities] = await Promise.all([getAllClinics(), getCities()]);

  return (
    <Section>
      <ClinicLocatorClient clinics={clinics} cities={cities} />
    </Section>
  );
}
