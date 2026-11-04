import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('offers');
}

export default function OffersPage() {
  return <BuiltInPage slug="offers" label="Offers" />;
}
