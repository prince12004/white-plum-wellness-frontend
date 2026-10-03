'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { TestimonialForm } from '@/components/admin/testimonials/testimonial-form';

export default function NewTestimonialPage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New testimonial" description="Add a patient review shown across the public site." backHref="/testimonials" />
      <TestimonialForm />
    </div>
  );
}
