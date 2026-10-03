import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container, Section } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { BlogCard } from '@/components/cards/blog-card';
import { getAllBlogs } from '@/data/blogs';

export async function BlogsSection() {
  const blogs = await getAllBlogs();
  const latest = [...blogs].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);

  return (
    <Section>
      <Container>
        <ScrollReveal className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-ivory-200 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-600">From Our Doctors</p>
            <h2 className="mt-3 max-w-md font-display text-3xl font-semibold text-charcoal-900 md:text-4xl">
              Honest guidance, not miracle cures
            </h2>
          </div>
          <Link
            href="/blogs"
            className="group flex shrink-0 items-center gap-1.5 font-display text-sm font-medium text-charcoal-900 hover:text-peach-600"
          >
            Read all articles
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {latest.map((blog, i) => (
            <ScrollReveal key={blog.slug} delay={i * 100}>
              <BlogCard blog={blog} />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
