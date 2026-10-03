'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { TreatmentPackage } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { PackageForm } from '@/components/admin/packages/package-form';

export default function EditPackagePage() {
  const params = useParams<{ slug: string }>();
  const [pkg, setPkg] = useState<TreatmentPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<TreatmentPackage>(`/packages/${params.slug}`).then((res) => {
      setPkg(res);
      setLoading(false);
    });
  }, [params.slug]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit package" description="Update this package's details." backHref="/packages" />
      {loading ? <p className="text-sm text-charcoal-500">Loading…</p> : <PackageForm pkg={pkg} />}
    </div>
  );
}
