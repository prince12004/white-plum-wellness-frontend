import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/layout/admin-shell';
import { getSession } from '@/lib/admin/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  return <AdminShell session={session}>{children}</AdminShell>;
}
