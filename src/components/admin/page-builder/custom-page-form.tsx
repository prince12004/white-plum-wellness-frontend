'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CustomPage } from '@white/types';
import { Button, Card, CardContent, Input, Label, Switch, Textarea, useToast } from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

interface CustomPageFormProps {
  page?: CustomPage | null;
}

export function CustomPageForm({ page }: CustomPageFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(page);

  const [title, setTitle] = useState(page?.title ?? '');
  const [slug, setSlug] = useState(page?.slug ?? '');
  const [metaTitle, setMetaTitle] = useState(page?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(page?.metaDescription ?? '');
  const [body, setBody] = useState(page?.body ?? '');
  const [isPublished, setIsPublished] = useState(page?.isPublished ?? false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      title,
      slug,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      body,
      isPublished,
    };
    try {
      if (isEdit && page) {
        await apiClient.patch(`/custom-pages/${page.id}`, payload);
      } else {
        await apiClient.post('/custom-pages', payload);
      }
      toast({ title: isEdit ? 'Page updated' : 'Page created' });
      router.push('/admin/page-builder');
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
              <Label htmlFor="cp-title">Title</Label>
              <Input id="cp-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cp-slug">Slug</Label>
              <Input id="cp-slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cp-meta-title">Meta title</Label>
              <Input id="cp-meta-title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cp-meta-desc">Meta description</Label>
              <Textarea id="cp-meta-desc" rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cp-body">Page content</Label>
            <Textarea
              id="cp-body"
              required
              rows={14}
              className="font-mono text-sm"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch id="cp-published" checked={isPublished} onCheckedChange={setIsPublished} />
            <Label htmlFor="cp-published">Published</Label>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/page-builder')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create page'}
        </Button>
      </div>
    </form>
  );
}
