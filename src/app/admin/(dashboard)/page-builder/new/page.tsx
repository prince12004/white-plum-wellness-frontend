'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { CustomPageForm } from '@/components/admin/page-builder/custom-page-form';

export default function NewCustomPagePage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New page" description="Create a new website page." backHref="/admin/page-builder" />
      <CustomPageForm />
    </div>
  );
}
