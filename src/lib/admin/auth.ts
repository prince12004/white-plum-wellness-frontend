import { cookies } from 'next/headers';
import type { Role } from '@white/types';

const NEST_API_URL = process.env.NEST_API_URL ?? 'http://localhost:4000/api';

export interface Session {
  id: string;
  name: string;
  email: string;
  roleKey: string;
  role: Role | null;
  permissions: string[];
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) return null;

  try {
    const res = await fetch(`${NEST_API_URL}/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as Session;
  } catch {
    return null;
  }
}

export async function serverFetch<T>(path: string): Promise<T | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader) return null;

  try {
    const res = await fetch(`${NEST_API_URL}${path}`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export { hasPermission } from './permissions';
