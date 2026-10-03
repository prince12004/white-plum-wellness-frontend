'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Doctor } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { DoctorForm } from '@/components/admin/doctors/doctor-form';

export default function EditDoctorPage() {
  const params = useParams<{ slug: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Doctor>(`/doctors/${params.slug}`).then((res) => {
      setDoctor(res);
      setLoading(false);
    });
  }, [params.slug]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit doctor" description="Update this doctor's profile." backHref="/doctors" />
      {loading ? <p className="text-sm text-charcoal-500">Loading…</p> : <DoctorForm doctor={doctor} />}
    </div>
  );
}
