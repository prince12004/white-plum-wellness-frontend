'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { GalleryItem, PaginatedResponse } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { GalleryItemForm } from '@/components/admin/gallery/gallery-item-form';

export default function EditGalleryItemPage() {
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    apiClient.get<PaginatedResponse<GalleryItem>>('/gallery?pageSize=200').then((res) => {
      const found = res.items.find((i) => i.id === params.id) ?? null;
      setItem(found);
      setNotFound(!found);
      setLoading(false);
    });
  }, [params.id]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit image" description="Update this gallery photo." backHref="/gallery" />
      {loading ? (
        <p className="text-sm text-charcoal-500">Loading…</p>
      ) : notFound ? (
        <p className="text-sm text-charcoal-500">Gallery item not found.</p>
      ) : (
        <GalleryItemForm item={item} />
      )}
    </div>
  );
}
