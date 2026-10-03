import type { Session } from './auth';

/** Pure permission check — kept separate from lib/auth.ts so client components can
 * import it without pulling in the server-only `next/headers` dependency. */
export function hasPermission(session: Session | null, permission: string | null): boolean {
  if (!session) return false;
  if (permission === null) return true;
  if (session.roleKey === 'SUPER_ADMIN') return true;
  return session.permissions?.includes(permission) ?? false;
}
