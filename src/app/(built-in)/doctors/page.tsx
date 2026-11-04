import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('doctors');
}

export default function DoctorsPage() {
  return <BuiltInPage slug="doctors" label="Doctors" />;
}
