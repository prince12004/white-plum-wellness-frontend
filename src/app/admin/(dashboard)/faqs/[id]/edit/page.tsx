'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Faq } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { FaqForm } from '@/components/admin/faqs/faq-form';

export default function EditFaqPage() {
  const params = useParams<{ id: string }>();
  const [faq, setFaq] = useState<Faq | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    apiClient.get<Faq[]>('/faqs').then((res) => {
      const found = res.find((f) => f.id === params.id) ?? null;
      setFaq(found);
      setNotFound(!found);
      setLoading(false);
    });
  }, [params.id]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit FAQ" description="Update this frequently asked question." backHref="/faqs" />
      {loading ? (
        <p className="text-sm text-charcoal-500">Loading…</p>
      ) : notFound ? (
        <p className="text-sm text-charcoal-500">FAQ not found.</p>
      ) : (
        <FaqForm faq={faq} />
      )}
    </div>
  );
}
