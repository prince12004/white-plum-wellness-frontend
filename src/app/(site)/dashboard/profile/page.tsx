import { redirect } from 'next/navigation';
import { getCustomerSession } from '@/lib/customer-session';
import { ProfileForm } from './profile-form';

export default async function DashboardProfilePage() {
  const customer = await getCustomerSession();
  if (!customer) redirect('/login');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-charcoal-900">Your Profile</h2>
        <p className="mt-1 text-sm text-charcoal-500">Keep your details up to date.</p>
      </div>
      <ProfileForm customer={customer} />
    </div>
  );
}
