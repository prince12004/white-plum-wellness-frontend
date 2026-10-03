import { apiGet, apiGetAll, ApiNotFoundError } from '@/lib/api';

export type { Concern } from '@white/types';
import type { Concern } from '@white/types';

export async function getAllConcerns(): Promise<Concern[]> {
  return apiGetAll<Concern>('/concerns');
}

export async function getConcernBySlug(slug: string): Promise<Concern | undefined> {
  try {
    return await apiGet<Concern>(`/concerns/${slug}`);
  } catch (err) {
    if (err instanceof ApiNotFoundError) return undefined;
    throw err;
  }
}
