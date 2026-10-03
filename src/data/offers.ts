import { apiGet, apiGetAll, ApiNotFoundError } from '@/lib/api';

export type { Offer } from '@white/types';
import type { Offer } from '@white/types';

export async function getAllOffers(): Promise<Offer[]> {
  return apiGetAll<Offer>('/offers');
}

export async function getOfferBySlug(slug: string): Promise<Offer | undefined> {
  try {
    return await apiGet<Offer>(`/offers/${slug}`);
  } catch (err) {
    if (err instanceof ApiNotFoundError) return undefined;
    throw err;
  }
}
