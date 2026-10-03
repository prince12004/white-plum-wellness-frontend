import type { PaginatedResponse } from '@white/types';

/**
 * Server-only fetch helper — Server Components call the NestJS API directly
 * (not through a browser rewrite proxy, since this never runs in the browser).
 * Every call defaults to a 60s ISR-style revalidation window so admin-added
 * content shows up on the public site without a redeploy.
 */
const API_URL = process.env.NEST_API_URL ?? 'http://localhost:4000/api';

export class ApiNotFoundError extends Error {}

export async function apiGet<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
  if (res.status === 404) throw new ApiNotFoundError(path);
  if (!res.ok) throw new Error(`API request failed: ${path} (${res.status})`);
  return res.json() as Promise<T>;
}

/** Convenience for list endpoints — unwraps the `items` array, fetching every page. */
export async function apiGetAll<T>(path: string, revalidate = 60): Promise<T[]> {
  const first = await apiGet<PaginatedResponse<T>>(`${path}${path.includes('?') ? '&' : '?'}pageSize=100`, revalidate);
  if (first.totalPages <= 1) return first.items;
  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, i) =>
      apiGet<PaginatedResponse<T>>(`${path}${path.includes('?') ? '&' : '?'}pageSize=100&page=${i + 2}`, revalidate),
    ),
  );
  return [first, ...rest].flatMap((r) => r.items);
}
