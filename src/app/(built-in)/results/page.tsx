import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('results');
}

export default function ResultsPage() {
  return <BuiltInPage slug="results" label="Results" />;
}
