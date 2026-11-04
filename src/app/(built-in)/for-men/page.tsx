import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('for-men');
}

export default function ForMenPage() {
  return <BuiltInPage slug="for-men" label="For Men" />;
}
