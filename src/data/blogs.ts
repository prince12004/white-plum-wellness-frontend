import { apiGet, apiGetAll, ApiNotFoundError } from '@/lib/api';

export type { Blog } from '@white/types';
import type { Blog } from '@white/types';

export async function getBlogCategories(): Promise<string[]> {
  return apiGet<string[]>('/blogs/categories');
}

export async function getAllBlogs(): Promise<Blog[]> {
  return apiGetAll<Blog>('/blogs');
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  try {
    return await apiGet<Blog>(`/blogs/${slug}`);
  } catch (err) {
    if (err instanceof ApiNotFoundError) return undefined;
    throw err;
  }
}

export async function getRelatedBlogs(blog: Blog, limit = 3): Promise<Blog[]> {
  const related = await apiGet<Blog[]>(`/blogs/${blog.slug}/related`);
  return related.slice(0, limit);
}

export async function getBlogsByConcern(concernSlug: string): Promise<Blog[]> {
  return apiGetAll<Blog>(`/blogs?concernSlug=${concernSlug}`);
}
