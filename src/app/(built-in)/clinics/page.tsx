import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('clinics');
}

export default function ClinicsPage() {
  return <BuiltInPage slug="clinics" label="Clinics" />;
}
