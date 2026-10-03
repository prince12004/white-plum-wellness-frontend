'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Testimonial } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { TestimonialForm } from '@/components/admin/testimonials/testimonial-form';

export default function EditTestimonialPage() {
  const params = useParams<{ id: string }>();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Testimonial>(`/testimonials/${params.id}`).then((res) => {
      setTestimonial(res);
      setLoading(false);
    });
  }, [params.id]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit testimonial" description="Update this patient review." backHref="/testimonials" />
      {loading ? <p className="text-sm text-charcoal-500">Loading…</p> : <TestimonialForm testimonial={testimonial} />}
    </div>
  );
}
