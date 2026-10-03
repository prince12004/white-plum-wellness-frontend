'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Blog, Concern, PaginatedResponse, Service } from '@white/types';
import {
  Button,
  Card,
  CardContent,
  ImageUpload,
  Input,
  Label,
  MultiSelect,
  Textarea,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { arrayToLines, linesToArray } from '@/lib/admin/array-fields';

interface BlogFormProps {
  blog?: Blog | null;
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(blog);

  const [slug, setSlug] = useState(blog?.slug ?? '');
  const [title, setTitle] = useState(blog?.title ?? '');
  const [category, setCategory] = useState(blog?.category ?? '');
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? '');
  const [content, setContent] = useState(arrayToLines(blog?.content));
  const [image, setImage] = useState(blog?.image ?? '');
  const [author, setAuthor] = useState(blog?.author ?? '');
  const [date, setDate] = useState(blog?.date ?? '');
  const [readingTime, setReadingTime] = useState(blog?.readingTime ?? '');
  const [relatedServiceSlugs, setRelatedServiceSlugs] = useState<string[]>(blog?.relatedServiceSlugs ?? []);
  const [relatedConcernSlugs, setRelatedConcernSlugs] = useState<string[]>(blog?.relatedConcernSlugs ?? []);
  const [services, setServices] = useState<Service[]>([]);
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<PaginatedResponse<Service>>('/services?pageSize=200').then((res) => setServices(res.items));
    apiClient.get<PaginatedResponse<Concern>>('/concerns?pageSize=200').then((res) => setConcerns(res.items));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      slug,
      title,
      category,
      excerpt,
      content: linesToArray(content),
      image,
      author,
      date,
      readingTime,
      relatedServiceSlugs,
      relatedConcernSlugs,
    };
    try {
      if (isEdit && blog) {
        await apiClient.patch(`/blogs/${blog.id}`, payload);
      } else {
        await apiClient.post('/blogs', payload);
      }
      toast({ title: isEdit ? 'Blog updated' : 'Blog created' });
      router.push('/admin/blogs');
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
              <Label htmlFor="blog-title">Title</Label>
              <Input id="blog-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="blog-slug">Slug</Label>
              <Input id="blog-slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="blog-category">Category</Label>
              <Input id="blog-category" required value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="blog-date">Date</Label>
              <Input id="blog-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="blog-reading-time">Reading time</Label>
              <Input id="blog-reading-time" value={readingTime} onChange={(e) => setReadingTime(e.target.value)} placeholder="e.g. 5 min read" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="blog-author">Author</Label>
            <Input id="blog-author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Cover image</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="blog-excerpt">Excerpt</Label>
            <Textarea id="blog-excerpt" required rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="blog-content">Article content (one paragraph per line)</Label>
            <Textarea id="blog-content" rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Related services</Label>
              <MultiSelect
                options={services.map((s) => ({ value: s.slug, label: s.name }))}
                value={relatedServiceSlugs}
                onChange={setRelatedServiceSlugs}
                placeholder="Select services…"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Related concerns</Label>
              <MultiSelect
                options={concerns.map((c) => ({ value: c.slug, label: c.name }))}
                value={relatedConcernSlugs}
                onChange={setRelatedConcernSlugs}
                placeholder="Select concerns…"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/blogs')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create blog post'}
        </Button>
      </div>
    </form>
  );
}
