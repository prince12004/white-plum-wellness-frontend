'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { BeforeAfterResult } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { BeforeAfterForm } from '@/components/admin/before-after/before-after-form';

export default function EditBeforeAfterPage() {
  const params = useParams<{ id: string }>();
  const [result, setResult] = useState<BeforeAfterResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<BeforeAfterResult>(`/before-after/${params.id}`).then((res) => {
      setResult(res);
      setLoading(false);
    });
  }, [params.id]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit result" description="Update this patient result." backHref="/before-after" />
      {loading ? <p className="text-sm text-charcoal-500">Loading…</p> : <BeforeAfterForm result={result} />}
    </div>
  );
}
