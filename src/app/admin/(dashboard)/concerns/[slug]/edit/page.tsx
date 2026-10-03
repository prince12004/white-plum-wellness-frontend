'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Concern } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { ConcernForm } from '@/components/admin/concerns/concern-form';

export default function EditConcernPage() {
  const params = useParams<{ slug: string }>();
  const [concern, setConcern] = useState<Concern | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Concern>(`/concerns/${params.slug}`).then((res) => {
      setConcern(res);
      setLoading(false);
    });
  }, [params.slug]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit concern" description="Update this concern's details." backHref="/concerns" />
      {loading ? <p className="text-sm text-charcoal-500">Loading…</p> : <ConcernForm concern={concern} />}
    </div>
  );
}
