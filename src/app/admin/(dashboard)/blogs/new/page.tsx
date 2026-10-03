'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { BlogForm } from '@/components/admin/blogs/blog-form';

export default function NewBlogPage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New blog post" description="Publish a new article to the public blog." backHref="/blogs" />
      <BlogForm />
    </div>
  );
}
