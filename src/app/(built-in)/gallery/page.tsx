import { BuiltInPage, builtInMetadata } from '@/components/cms/built-in-page';

export function generateMetadata() {
  return builtInMetadata('gallery');
}

export default function GalleryPage() {
  return <BuiltInPage slug="gallery" label="Gallery" />;
}
