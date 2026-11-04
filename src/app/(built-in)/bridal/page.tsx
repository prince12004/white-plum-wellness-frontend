import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('bridal');
}

export default function BridalPage() {
  return <BuiltInPage slug="bridal" label="Bridal" />;
}
