import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/auth/login-form';
import { Logo } from '@/components/logo';
import { getSession } from '@/lib/admin/auth';

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect('/admin/dashboard');

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-charcoal-900 px-4">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-peach-500/20 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-gold-400/15 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-white p-3">
            <Logo />
          </div>
        </div>
        <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
          Admin Panel
        </p>
        <h1 className="mt-2 text-center font-display text-2xl font-medium text-white">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-ivory-100/60">Sign in to manage your clinic&apos;s content.</p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white p-7 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-ivory-100/40">
          © {new Date().getFullYear()} White Plum Wellness. All rights reserved.
        </p>
      </div>
    </div>
  );
}
