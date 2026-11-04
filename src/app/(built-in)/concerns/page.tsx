import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('concerns');
}

export default function ConcernsPage() {
  return <BuiltInPage slug="concerns" label="Concerns" />;
}
