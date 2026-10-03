'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Campaign } from '@white/types';
import { apiClient } from '@/lib/admin/api-client';
import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { CampaignForm } from '@/components/admin/campaigns/campaign-form';

export default function EditCampaignPage() {
  const params = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Campaign>(`/campaigns/${params.id}`).then((res) => {
      setCampaign(res);
      setLoading(false);
    });
  }, [params.id]);

  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="Edit campaign" description="Update this campaign's details." backHref="/campaigns" />
      {loading ? <p className="text-sm text-charcoal-500">Loading…</p> : <CampaignForm campaign={campaign} />}
    </div>
  );
}
