'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { GalleryItemForm } from '@/components/admin/gallery/gallery-item-form';

export default function NewGalleryItemPage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Add image" description="Add a photo shown on the public gallery page." backHref="/gallery" />
      <GalleryItemForm />
    </div>
  );
}
