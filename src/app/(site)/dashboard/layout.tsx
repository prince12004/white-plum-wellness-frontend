import { redirect } from 'next/navigation';
import { User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { getCustomerSession } from '@/lib/customer-session';
import { LogoutButton } from './logout-button';
import { DashboardTabs } from './dashboard-tabs';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const customer = await getCustomerSession();
  if (!customer) redirect('/login');

  return (
    <section className="bg-ivory-50 py-10 md:py-14">
      <Container className="max-w-4xl">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-ivory-200 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-peach-100 text-peach-600">
              <User className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-charcoal-900">{customer.name || 'Welcome back'}</p>
              <p className="text-sm text-charcoal-500">{customer.phone}</p>
            </div>
          </div>
          <LogoutButton />
        </div>

        <DashboardTabs />

        <div className="mt-8">{children}</div>
      </Container>
    </section>
  );
}
