import { apiGet, apiGetAll, ApiNotFoundError } from '@/lib/api';

export type { Category } from '@white/types';
import type { Category } from '@white/types';

export async function getAllCategories(): Promise<Category[]> {
  return apiGetAll<Category>('/categories');
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  try {
    return await apiGet<Category>(`/categories/${slug}`);
  } catch (err) {
    if (err instanceof ApiNotFoundError) return undefined;
    throw err;
  }
}
