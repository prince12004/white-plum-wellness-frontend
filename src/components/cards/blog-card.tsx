import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Blog } from '@/data/blogs';

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(229,102,144,0.4)]">
      <Link href={`/blogs/${blog.slug}`} className="relative block h-52 w-full overflow-hidden">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">{blog.category}</span>
        <Link href={`/blogs/${blog.slug}`}>
          <h3 className="font-display text-base font-semibold leading-snug text-charcoal-900 hover:text-peach-600">
            {blog.title}
          </h3>
        </Link>
        <p className="flex-1 text-sm text-charcoal-500">{blog.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-charcoal-300">
          <span>{new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span>{blog.readingTime}</span>
        </div>
        <Link href={`/blogs/${blog.slug}`} className="group/link mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-peach-600">
          <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-peach-600 after:transition-all after:duration-300 group-hover/link:after:w-full">
            Read More
          </span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
