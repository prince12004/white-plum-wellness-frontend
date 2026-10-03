'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { ConcernForm } from '@/components/admin/concerns/concern-form';

export default function NewConcernPage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New concern" description="Add a new skin/hair concern shown on the public site." backHref="/concerns" />
      <ConcernForm />
    </div>
  );
}
