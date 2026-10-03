import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { PopReveal } from '@/components/ui/motion';
import { ServiceCard } from '@/components/cards/service-card';
import { BlogCard } from '@/components/cards/blog-card';
import { FaqAccordion } from '@/components/ui/accordion';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import { getAllBlogs, getBlogBySlug, getRelatedBlogs } from '@/data/blogs';
import { getServiceBySlug } from '@/data/services';
import { getHomepageFaqs } from '@/data/faqs';

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};
  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: { title: blog.title, description: blog.excerpt, images: [blog.image] },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const [related, relatedServicesRaw, homepageFaqs] = await Promise.all([
    getRelatedBlogs(blog),
    Promise.all(blog.relatedServiceSlugs.map((s) => getServiceBySlug(s))),
    getHomepageFaqs(),
  ]);
  const relatedServices = relatedServicesRaw.filter(Boolean);

  return (
    <>
      <Breadcrumb items={[{ label: 'Blogs', href: '/blogs' }, { label: blog.title }]} />

      <section className="relative overflow-hidden bg-charcoal-900 py-20 text-white">
        <Image src={blog.image} alt={blog.title} fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/40" />
        <Container className="relative max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">{blog.category}</p>
          <PopReveal>
            <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{blog.title}</h1>
          </PopReveal>
          <div className="mt-4 flex items-center gap-3 text-sm text-ivory-100/70">
            <span>{blog.author}</span>
            <span>·</span>
            <span>{new Date(blog.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>·</span>
            <span>{blog.readingTime}</span>
          </div>
        </Container>
      </section>

      <Section>
        <Container className="max-w-3xl">
          <article className="flex flex-col gap-5 text-charcoal-700">
            {blog.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </article>

          {relatedServices.length > 0 && (
            <div className="mt-14">
              <SectionHeading eyebrow="Related Treatments" title="You May Be Interested In" align="left" className="mb-6" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {relatedServices.map((s) => s && <ServiceCard key={s.slug} service={s} />)}
              </div>
            </div>
          )}

          <div className="mt-14">
            <SectionHeading eyebrow="Common Questions" title="FAQs" align="left" className="mb-6" />
            <FaqAccordion items={homepageFaqs.slice(0, 4)} />
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="muted">
          <Container>
            <SectionHeading eyebrow="Keep Reading" title="Related Articles" align="left" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b) => (
                <BlogCard key={b.slug} blog={b} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <section className="bg-charcoal-900 py-16 text-center text-white">
        <Container className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Have a question for our dermatologists?</h2>
          <div className="mt-6 flex justify-center gap-3">
            <BookAppointmentButton size="lg">Book Consultation</BookAppointmentButton>
          </div>
        </Container>
      </section>
    </>
  );
}
