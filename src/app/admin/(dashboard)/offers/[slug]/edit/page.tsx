'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Offer } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { OfferForm } from '@/components/admin/offers/offer-form';

export default function EditOfferPage() {
  const params = useParams<{ slug: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Offer>(`/offers/${params.slug}`).then((res) => {
      setOffer(res);
      setLoading(false);
    });
  }, [params.slug]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit offer" description="Update this offer's details." backHref="/offers" />
      {loading ? <p className="text-sm text-charcoal-500">Loading…</p> : <OfferForm offer={offer} />}
    </div>
  );
}
