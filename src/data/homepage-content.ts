import type { HomepageContent } from '@white/types';
import { apiGet } from '@/lib/api';

export async function getHomepageContent(): Promise<HomepageContent> {
  return apiGet<HomepageContent>('/homepage-cms');
}
