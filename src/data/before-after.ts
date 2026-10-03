import { apiGet, apiGetAll } from '@/lib/api';

export type { BeforeAfterResult } from '@white/types';
import type { BeforeAfterResult } from '@white/types';

export async function getBeforeAfterCategories(): Promise<string[]> {
  return apiGet<string[]>('/before-after/categories');
}

export async function getAllBeforeAfterResults(): Promise<BeforeAfterResult[]> {
  return apiGetAll<BeforeAfterResult>('/before-after');
}

export async function getResultsByCategory(category: string): Promise<BeforeAfterResult[]> {
  return apiGetAll<BeforeAfterResult>(`/before-after?category=${category}`);
}

export async function getResultById(id: string): Promise<BeforeAfterResult | undefined> {
  try {
    return await apiGet<BeforeAfterResult>(`/before-after/${id}`);
  } catch {
    return undefined;
  }
}
