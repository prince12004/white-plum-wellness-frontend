'use client';

import { FormPageHeader } from '@/components/admin/shared/form-page-header';
import { OfferForm } from '@/components/admin/offers/offer-form';

export default function NewOfferPage() {
  return (
    <div className="flex flex-col gap-6">
      <FormPageHeader title="New offer" description="Add a limited-time offer shown on the public site." backHref="/offers" />
      <OfferForm />
    </div>
  );
}
