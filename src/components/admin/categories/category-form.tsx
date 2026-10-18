'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@white/types';
import { Button, Card, CardContent, ImageUpload, Input, Label, Textarea, useToast } from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

interface CategoryFormProps {
  category?: Category | null;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(category);

  const [slug, setSlug] = useState(category?.slug ?? '');
  const [name, setName] = useState(category?.name ?? '');
  const [icon, setIcon] = useState(category?.icon ?? '');
  const [image, setImage] = useState(category?.image ?? '');
  const [shortDescription, setShortDescription] = useState(category?.shortDescription ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [order, setOrder] = useState(category?.order ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = { slug, name, icon, image, shortDescription, description, order };
    try {
      if (isEdit && category) {
        await apiClient.patch(`/categories/${category.id}`, payload);
      } else {
        await apiClient.post('/categories', payload);
      }
      toast({ title: isEdit ? 'Category updated' : 'Category created' });
      router.push('/admin/categories');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input id="cat-slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-icon">Icon name (lucide-react)</Label>
              <Input id="cat-icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. Sparkles" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-order">Display order</Label>
              <Input
                id="cat-order"
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Image</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-short">Short description</Label>
            <Textarea
              id="cat-short"
              required
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-description">Full description</Label>
            <Textarea id="cat-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/categories')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create category'}
        </Button>
      </div>
    </form>
  );
}
