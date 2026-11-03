import Image from 'next/image';
import Link from 'next/link';
import { Button, cn } from '@white/ui';
import { BookingCta } from '@/components/cms/booking-cta';
import { WhatsappCtaLink } from '@/components/booking/whatsapp-cta-link';
import { Container, Section, SectionHeading } from '@/components/ui/container';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { safeHref } from '@/lib/cms/href';
import { CmsIcon } from '@/lib/cms/icons';
import { sectionContent, type SectionProps } from '@/lib/cms/sections';

/** Plain-text formatting only, never raw HTML: "## " subheading, "- " bullets, blank line = new paragraph. */
function RichText({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-4 text-base leading-relaxed text-charcoal-600">
      {text
        .split(/\n\s*\n/)
        .filter((block) => block.trim())
        .map((block, i) => {
          const lines = block.trim().split('\n');
          if (lines.every((line) => line.startsWith('- '))) {
            return (
              <ul key={i} className="list-disc space-y-1 pl-5">
                {lines.map((line, j) => (
                  <li key={j}>{line.slice(2)}</li>
                ))}
              </ul>
            );
          }
          if (block.trim().startsWith('## ')) {
            return (
              <h3 key={i} className="mt-2 font-display text-2xl font-medium text-charcoal-900">
                {block.trim().slice(3)}
              </h3>
            );
          }
          return (
            <p key={i} className="whitespace-pre-line">
              {block.trim()}
            </p>
          );
        })}
    </div>
  );
}

export function RichTextBlock({ content }: SectionProps) {
  const c = sectionContent('rich-text', content);
  return (
    <Section>
      <Container className="max-w-3xl">
        {c.title && <SectionHeading eyebrow={c.eyebrow} title={c.title} align="left" className="mb-6" />}
        <RichText text={c.body} />
      </Container>
    </Section>
  );
}

export function BannerBlock({ content }: SectionProps) {
  const c = sectionContent('banner', content);
  return (
    <section className="relative overflow-hidden bg-charcoal-900 py-24 text-center text-white">
      {c.image && <Image src={c.image} alt="" fill sizes="100vw" className="object-cover opacity-50" />}
      <Container className="relative max-w-3xl">
        {c.eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-300">{c.eyebrow}</p>}
        <h2 className="mt-3 font-display text-4xl font-medium sm:text-5xl">{c.title}</h2>
        {c.description && <p className="mx-auto mt-4 max-w-xl text-lg text-ivory-100/80">{c.description}</p>}
        {c.ctaLabel && (
          <div className="mt-8">
            <BookingCta size="lg" href={c.ctaHref}>
              {c.ctaLabel}
            </BookingCta>
          </div>
        )}
      </Container>
    </section>
  );
}

export function TextImageBlock({ content }: SectionProps) {
  const c = sectionContent('text-image', content);
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className={cn(c.imagePosition === 'left' && 'lg:order-2')}>
            <SectionHeading eyebrow={c.eyebrow} title={c.title} align="left" className="mb-6" />
            <RichText text={c.body} />
            {c.ctaLabel && (
              <div className="mt-6">
                <BookingCta href={c.ctaHref}>{c.ctaLabel}</BookingCta>
              </div>
            )}
          </div>
          {c.image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={c.image} alt={c.imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

export function CardsBlock({ content }: SectionProps) {
  const c = sectionContent('cards', content);
  return (
    <Section tone="muted">
      <Container>
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={c.description} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((item, i) => (
            <ScrollReveal key={i} delay={(i % 3) * 80}>
              <div className="flex h-full flex-col gap-3 overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
                {item.image ? (
                  <div className="relative -mx-6 -mt-6 mb-2 h-44">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                  </div>
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-peach-100 text-peach-600">
                    <CmsIcon name={item.icon} className="h-5 w-5" />
                  </span>
                )}
                <h3 className="font-display text-lg font-medium text-charcoal-900">{item.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-charcoal-500">{item.description}</p>
                {item.ctaLabel && (
                  <Link href={safeHref(item.ctaHref)}>
                    <Button variant="secondary" size="sm">
                      {item.ctaLabel}
                    </Button>
                  </Link>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function CtaBlock({ content }: SectionProps) {
  const c = sectionContent('cta', content);
  return (
    <section className="relative overflow-hidden bg-charcoal-900 py-14 text-center text-white">
      {c.backgroundImage && <Image src={c.backgroundImage} alt="" fill sizes="100vw" className="object-cover opacity-30" />}
      <Container className="relative max-w-2xl">
        <h2 className="font-display text-4xl font-medium">{c.title}</h2>
        {c.description && <p className="mx-auto mt-4 max-w-md text-base text-ivory-100/70">{c.description}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <BookingCta size="lg" href={c.ctaHref}>
            {c.ctaLabel}
          </BookingCta>
          {c.whatsappLabel && <WhatsappCtaLink className="h-12 px-6 text-base">{c.whatsappLabel}</WhatsappCtaLink>}
        </div>
      </Container>
    </section>
  );
}

/** A thin gold accent line, used between adjacent sections that share the same
 * background tone (muted/muted or default/default) and would otherwise blend
 * into one long block with no visual break. */
export function DividerBlock({ content }: SectionProps) {
  const { tone } = sectionContent('divider', content);
  return (
    <div className={`flex justify-center py-1 ${tone === 'muted' ? 'bg-ivory-100' : 'bg-white'}`}>
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
    </div>
  );
}
