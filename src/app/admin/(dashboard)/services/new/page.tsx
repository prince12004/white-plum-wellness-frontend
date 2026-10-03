'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { ServiceForm } from '@/components/admin/services/service-form';

export default function NewServicePage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New service" description="Add a new treatment shown across the public site." backHref="/services" />
      <ServiceForm />
    </div>
  );
}
