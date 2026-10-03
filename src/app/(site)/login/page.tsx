'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label } from '@white/ui';
import { Container } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Phone, ShieldCheck } from 'lucide-react';

type Step = 'phone' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(false);

  async function requestOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/customer-auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? 'Could not send code');
      }
      setStep('otp');
      setResendCooldown(true);
      setTimeout(() => setResendCooldown(false), 30_000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/customer-auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone, code }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? 'Invalid or expired code');
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[70vh] items-center bg-gradient-to-b from-peach-50 to-white py-16">
      <Container className="max-w-md">
        <ScrollReveal>
          <div className="rounded-3xl border border-ivory-200 bg-white p-8 shadow-sm">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-peach-100 text-peach-600">
              {step === 'phone' ? <Phone className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </span>
            <h1 className="mt-4 text-center font-display text-2xl font-semibold text-charcoal-900">
              {step === 'phone' ? 'Sign in with your mobile number' : 'Enter the code we sent you'}
            </h1>
            <p className="mt-2 text-center text-sm text-charcoal-500">
              {step === 'phone'
                ? 'No password needed — we’ll text you a one-time code.'
                : `We sent a code to ${phone}.`}
            </p>

            {step === 'phone' ? (
              <form className="mt-6 flex flex-col gap-4" onSubmit={requestOtp}>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="login-phone">Mobile number</Label>
                  <Input
                    id="login-phone"
                    type="tel"
                    required
                    autoFocus
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Sending…' : 'Send code'}
                </Button>
              </form>
            ) : (
              <form className="mt-6 flex flex-col gap-4" onSubmit={verifyOtp}>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="login-code">Verification code</Label>
                  <Input
                    id="login-code"
                    type="text"
                    inputMode="numeric"
                    required
                    autoFocus
                    placeholder="6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Verifying…' : 'Verify & continue'}
                </Button>
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setCode('');
                      setError(null);
                    }}
                    className="text-charcoal-500 hover:text-peach-600"
                  >
                    Change number
                  </button>
                  <button
                    type="button"
                    disabled={resendCooldown || submitting}
                    onClick={() => requestOtp()}
                    className="font-medium text-peach-600 hover:text-peach-700 disabled:cursor-not-allowed disabled:text-charcoal-300"
                  >
                    {resendCooldown ? 'Resend in 30s' : 'Resend code'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
