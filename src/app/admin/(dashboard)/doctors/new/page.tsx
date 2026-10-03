'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { DoctorForm } from '@/components/admin/doctors/doctor-form';

export default function NewDoctorPage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New doctor" description="Add a new doctor profile shown across the public site." backHref="/doctors" />
      <DoctorForm />
    </div>
  );
}
