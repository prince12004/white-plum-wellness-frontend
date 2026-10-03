import { apiGet, apiGetAll, ApiNotFoundError } from '@/lib/api';

export type { Service, ServiceDetail, ProcessStep, FaqItem } from '@white/types';
import type { Service } from '@white/types';

export async function getAllServices(): Promise<Service[]> {
  return apiGetAll<Service>('/services');
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  try {
    return await apiGet<Service>(`/services/${slug}`);
  } catch (err) {
    if (err instanceof ApiNotFoundError) return undefined;
    throw err;
  }
}

export async function getServicesByCategory(categorySlug: string): Promise<Service[]> {
  return apiGetAll<Service>(`/services?categorySlug=${categorySlug}`);
}

export async function getFeaturedServices(): Promise<Service[]> {
  return apiGetAll<Service>('/services?featured=true');
}

export async function getPopularServices(): Promise<Service[]> {
  return apiGetAll<Service>('/services?popular=true');
}

export async function getRelatedServices(service: Service, limit = 3): Promise<Service[]> {
  const related = await apiGet<Service[]>(`/services/${service.slug}/related`);
  return related.slice(0, limit);
}

export async function getServicesByConcern(concernSlug: string): Promise<Service[]> {
  return apiGetAll<Service>(`/services?concernSlug=${concernSlug}`);
}
