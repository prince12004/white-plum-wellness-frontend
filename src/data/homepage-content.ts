import type { HomepageContent } from '@white/types';
import { apiGet } from '@/lib/api';

/** Uncached, so a publish in Homepage Management shows on the next page load instead of up to a minute later. */
export async function getHomepageContent(): Promise<HomepageContent> {
  return apiGet<HomepageContent>('/homepage-cms', 0);
}
