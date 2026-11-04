import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('contact');
}

export default function ContactPage() {
  return <BuiltInPage slug="contact" label="Contact" />;
}
