import { cookies } from 'next/headers';
import type { Customer } from '@white/types';

const NEST_API_URL = process.env.NEST_API_URL ?? 'http://localhost:4000/api';

/**
 * Server-side customer session lookup — mirrors apps/admin's getSession() pattern.
 * Runs on the Next.js server, so the browser-facing /api/* rewrite doesn't apply;
 * the NestJS API is called directly, forwarding the incoming request's cookies.
 */
export async function getCustomerSession(): Promise<Customer | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) return null;

  try {
    const res = await fetch(`${NEST_API_URL}/customer-auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as Customer;
  } catch {
    return null;
  }
}
