import { apiGet, apiGetAll, ApiNotFoundError } from '@/lib/api';

export type { Doctor } from '@white/types';
import type { Doctor } from '@white/types';

export async function getAllDoctors(): Promise<Doctor[]> {
  return apiGetAll<Doctor>('/doctors');
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | undefined> {
  try {
    return await apiGet<Doctor>(`/doctors/${slug}`);
  } catch (err) {
    if (err instanceof ApiNotFoundError) return undefined;
    throw err;
  }
}

export async function getDoctorsByClinic(clinicSlug: string): Promise<Doctor[]> {
  return apiGetAll<Doctor>(`/doctors?clinicSlug=${clinicSlug}`);
}
