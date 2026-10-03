'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { Button, Input, Label } from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiClient.post('/auth/login', { email, password });
      router.replace('/admin/dashboard');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.status === 429 ? 'Too many attempts — please wait a minute and try again.' : err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@whiteplumwellness.com"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading} className="mt-1 w-full">
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-charcoal-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        Restricted access — authorized staff only
      </p>
    </form>
  );
}
