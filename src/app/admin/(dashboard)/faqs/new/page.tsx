'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { FaqForm } from '@/components/admin/faqs/faq-form';

export default function NewFaqPage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New FAQ" description="Add a frequently asked question shown on the homepage." backHref="/faqs" />
      <FaqForm />
    </div>
  );
}
