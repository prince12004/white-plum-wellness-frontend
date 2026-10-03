'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GalleryItem } from '@white/types';
import { Button, Card, CardContent, ImageUpload, Input, Label, Select, useToast } from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

const CATEGORIES = ['Clinic', 'Treatment', 'Doctors', 'Events', 'Results'];

interface GalleryItemFormProps {
  item?: GalleryItem | null;
}

export function GalleryItemForm({ item }: GalleryItemFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(item);

  const [category, setCategory] = useState(item?.category ?? (CATEGORIES[0] as string));
  const [image, setImage] = useState(item?.image ?? '');
  const [caption, setCaption] = useState(item?.caption ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isEdit && item) {
        await apiClient.patch(`/gallery/${item.id}`, { category, image, caption });
      } else {
        await apiClient.post('/gallery', { category, image, caption });
      }
      toast({ title: isEdit ? 'Gallery item updated' : 'Gallery item added' });
      router.push('/admin/gallery');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gallery-category">Category</Label>
            <Select id="gallery-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Image</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gallery-caption">Caption (optional)</Label>
            <Input id="gallery-caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/gallery')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add image'}
        </Button>
      </div>
    </form>
  );
}
