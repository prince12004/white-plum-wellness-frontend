'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { BeforeAfterForm } from '@/components/admin/before-after/before-after-form';

export default function NewBeforeAfterPage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New before/after result" description="Add a real patient result shown on the public site." backHref="/before-after" />
      <BeforeAfterForm />
    </div>
  );
}
