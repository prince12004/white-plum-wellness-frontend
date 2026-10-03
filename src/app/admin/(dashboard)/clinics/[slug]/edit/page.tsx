'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Clinic } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { ClinicForm } from '@/components/admin/clinics/clinic-form';

export default function EditClinicPage() {
  const params = useParams<{ slug: string }>();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Clinic>(`/clinics/${params.slug}`).then((res) => {
      setClinic(res);
      setLoading(false);
    });
  }, [params.slug]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit clinic" description="Update this clinic's details." backHref="/clinics" />
      {loading ? <p className="text-sm text-charcoal-500">Loading…</p> : <ClinicForm clinic={clinic} />}
    </div>
  );
}
