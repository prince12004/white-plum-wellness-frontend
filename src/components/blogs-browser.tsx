'use client';

import { useMemo, useState } from 'react';
import { Input, Select } from '@white/ui';
import { BlogCard } from '@/components/cards/blog-card';
import { Stagger, FadeUp } from '@/components/ui/motion';
import type { Blog } from '@/data/blogs';

export function BlogsBrowser({ blogs, categories }: { blogs: Blog[]; categories: string[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    return blogs
      .filter((b) => (category === 'all' ? true : b.category === category))
      .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [search, category, blogs]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-72"
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-charcoal-500">No articles match your search.</p>
      ) : (
        <Stagger key={category} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
          {filtered.map((blog) => (
            <FadeUp key={blog.slug}>
              <BlogCard blog={blog} />
            </FadeUp>
          ))}
        </Stagger>
      )}
    </>
  );
}
