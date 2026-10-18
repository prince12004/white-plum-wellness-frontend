'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Category } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { CategoryForm } from '@/components/admin/categories/category-form';

export default function EditCategoryPage() {
  const params = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Category>(`/categories/${params.slug}`).then((res) => {
      setCategory(res);
      setLoading(false);
    });
  }, [params.slug]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit category" description="Update this category's details." backHref="/categories" />
      {loading ? <p className="text-sm text-charcoal-500">Loading…</p> : <CategoryForm category={category} />}
    </div>
  );
}
