import { apiGet, apiGetAll, ApiNotFoundError } from '@/lib/api';

export type { TreatmentPackage } from '@white/types';
import type { TreatmentPackage } from '@white/types';

export async function getAllPackages(): Promise<TreatmentPackage[]> {
  return apiGetAll<TreatmentPackage>('/packages');
}

export async function getPackageBySlug(slug: string): Promise<TreatmentPackage | undefined> {
  try {
    return await apiGet<TreatmentPackage>(`/packages/${slug}`);
  } catch (err) {
    if (err instanceof ApiNotFoundError) return undefined;
    throw err;
  }
}

export async function getPackagesByCategory(categorySlug: string): Promise<TreatmentPackage[]> {
  return apiGetAll<TreatmentPackage>(`/packages?categorySlug=${categorySlug}`);
}
