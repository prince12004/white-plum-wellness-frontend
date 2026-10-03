import { apiGetAll } from '@/lib/api';

export type { Testimonial } from '@white/types';
import type { Testimonial } from '@white/types';

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return apiGetAll<Testimonial>('/testimonials');
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  return apiGetAll<Testimonial>('/testimonials?featured=true');
}
