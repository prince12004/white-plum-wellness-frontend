'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Blog } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { BlogForm } from '@/components/admin/blogs/blog-form';

export default function EditBlogPage() {
  const params = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Blog>(`/blogs/${params.slug}`).then((res) => {
      setBlog(res);
      setLoading(false);
    });
  }, [params.slug]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit blog post" description="Update this article's details." backHref="/blogs" />
      {loading ? <p className="text-sm text-charcoal-500">Loading…</p> : <BlogForm blog={blog} />}
    </div>
  );
}
