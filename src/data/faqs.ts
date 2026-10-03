import { apiGet } from '@/lib/api';

export type { Faq } from '@white/types';
import type { Faq } from '@white/types';

export async function getHomepageFaqs(): Promise<Faq[]> {
  return apiGet<Faq[]>('/faqs');
}
