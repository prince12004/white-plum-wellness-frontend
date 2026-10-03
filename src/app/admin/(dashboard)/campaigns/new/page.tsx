'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { CampaignForm } from '@/components/admin/campaigns/campaign-form';

export default function NewCampaignPage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New campaign" description="Track a new marketing campaign." backHref="/campaigns" />
      <CampaignForm />
    </div>
  );
}
