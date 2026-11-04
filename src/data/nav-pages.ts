import type { CustomPageNav } from '@white/types';
import { apiGet } from '@/lib/api';

/** Falls back to empty so a brief API outage can't take the site menu down with it. */
export async function getNavData(): Promise<CustomPageNav> {
  try {
    return await apiGet<CustomPageNav>('/custom-pages/nav');
  } catch {
    return { pages: [], hiddenSlugs: [] };
  }
}
