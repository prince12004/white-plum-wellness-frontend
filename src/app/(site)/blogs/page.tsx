import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section } from '@/components/ui/container';
import { BlogsBrowser } from '@/components/blogs-browser';
import { getAllBlogs, getBlogCategories } from '@/data/blogs';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Honest, practical guidance from our dermatologists on skin, hair, and aesthetic care.',
};

export default async function BlogsPage() {
  const [blogs, categories] = await Promise.all([getAllBlogs(), getBlogCategories()]);
  return (
    <>
      <Breadcrumb items={[{ label: 'Blogs' }]} />
      <section className="bg-gradient-to-b from-peach-50 to-white py-16 text-center">
        <Container>
          <h1 className="font-display text-4xl font-semibold text-charcoal-900">From Our Doctors</h1>
          <p className="mx-auto mt-3 max-w-2xl text-charcoal-500">
            Practical, honest guidance on skin, hair, and aesthetic care — no miracle cures.
          </p>
        </Container>
      </section>
      <Section>
        <Container>
          <BlogsBrowser blogs={blogs} categories={categories} />
        </Container>
      </Section>
    </>
  );
}
