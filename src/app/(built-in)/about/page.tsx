import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('about');
}

export default function AboutPage() {
  return <BuiltInPage slug="about" label="About" />;
}
