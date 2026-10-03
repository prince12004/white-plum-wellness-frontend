'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { PackageForm } from '@/components/admin/packages/package-form';

export default function NewPackagePage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New package" description="Add a new bundled treatment package shown on the public site." backHref="/packages" />
      <PackageForm />
    </div>
  );
}
