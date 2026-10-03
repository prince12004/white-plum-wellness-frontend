import { apiGet, apiGetAll, ApiNotFoundError } from '@/lib/api';

export type { Clinic, OpeningHour } from '@white/types';
import type { Clinic } from '@white/types';

export async function getAllClinics(): Promise<Clinic[]> {
  return apiGetAll<Clinic>('/clinics');
}

export async function getClinicBySlug(slug: string): Promise<Clinic | undefined> {
  try {
    return await apiGet<Clinic>(`/clinics/${slug}`);
  } catch (err) {
    if (err instanceof ApiNotFoundError) return undefined;
    throw err;
  }
}

export async function getClinicsByCity(city: string): Promise<Clinic[]> {
  const all = await getAllClinics();
  return all.filter((c) => c.city.toLowerCase() === city.toLowerCase());
}

export async function getCities(): Promise<string[]> {
  return apiGet<string[]>('/clinics/cities');
}
