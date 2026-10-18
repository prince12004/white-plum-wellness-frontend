'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { CategoryForm } from '@/components/admin/categories/category-form';

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New category" description="Add a new treatment category shown on the public site." backHref="/categories" />
      <CategoryForm />
    </div>
  );
}
