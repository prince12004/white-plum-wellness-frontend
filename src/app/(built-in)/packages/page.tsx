import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('packages');
}

export default function PackagesPage() {
  return <BuiltInPage slug="packages" label="Packages" />;
}
