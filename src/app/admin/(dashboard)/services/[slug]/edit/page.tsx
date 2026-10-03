'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Service } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { ServiceForm } from '@/components/admin/services/service-form';

export default function EditServicePage() {
  const params = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Service>(`/services/${params.slug}`).then((res) => {
      setService(res);
      setLoading(false);
    });
  }, [params.slug]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit service" description="Update this treatment's details." backHref="/services" />
      {loading ? <p className="text-sm text-charcoal-500">Loading…</p> : <ServiceForm service={service} />}
    </div>
  );
}
