import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('blogs');
}

export default function BlogsPage() {
  return <BuiltInPage slug="blogs" label="Blogs" />;
}
