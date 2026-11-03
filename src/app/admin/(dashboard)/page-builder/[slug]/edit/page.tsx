'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { CustomPage } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { CustomPageForm } from '@/components/admin/page-builder/custom-page-form';

export default function EditCustomPagePage() {
  const params = useParams<{ slug: string }>();
  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<CustomPage>(`/custom-pages/admin/by-slug/${params.slug}`)
      .then(setPage)
      .finally(() => setLoading(false));
  }, [params.slug]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit page" description="Update this page's content." backHref="/admin/page-builder" />
      {loading ? (
        <p className="text-sm text-charcoal-500">Loading…</p>
      ) : page ? (
        <CustomPageForm page={page} />
      ) : (
        <p className="text-sm text-charcoal-500">Page not found.</p>
      )}
    </div>
  );
}
