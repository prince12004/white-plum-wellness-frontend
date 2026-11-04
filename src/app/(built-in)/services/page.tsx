import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('services');
}

export default function ServicesPage() {
  return <BuiltInPage slug="services" label="Services" />;
}
