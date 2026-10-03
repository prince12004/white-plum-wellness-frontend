'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { ClinicForm } from '@/components/admin/clinics/clinic-form';

export default function NewClinicPage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New clinic" description="Add a new clinic location shown on the public site." backHref="/clinics" />
      <ClinicForm />
    </div>
  );
}
