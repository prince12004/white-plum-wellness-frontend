import type { CmsSection, CustomPage, HomepageContent } from '@white/types';
import { awards, mediaLogos, stats, treatmentJourney, whyChooseUs } from '@/data/content';
import { placeholderImage } from '@/data/images';

/**
 * Single source of truth for CMS sections: each type's default content and the
 * fields its admin form shows. Web and admin are one app, so the renderer
 * (components/cms/section-renderer.tsx) and the editor (components/admin/cms) both
 * read from here — adding a section type means one entry here and one in the renderer.
 */

export type CmsField =
  | { key: string; label: string; kind: 'text' | 'textarea' | 'richtext' | 'image' | 'url' | 'icon' | 'number' | 'tags'; hint?: string }
  | { key: string; label: string; kind: 'select'; options: string[]; hint?: string }
  | { key: string; label: string; kind: 'slugs'; source: 'services' | 'packages' | 'offers'; hint?: string }
  | { key: string; label: string; kind: 'list'; fields: CmsField[]; hint?: string };

const text = (key: string, label: string, hint?: string): CmsField => ({ key, label, kind: 'text', hint });
const area = (key: string, label: string, hint?: string): CmsField => ({ key, label, kind: 'textarea', hint });
const image = (key: string, label: string, hint?: string): CmsField => ({ key, label, kind: 'image', hint });
const url = (key: string, label: string, hint?: string): CmsField => ({ key, label, kind: 'url', hint });
const icon = (key = 'icon', label = 'Icon'): CmsField => ({ key, label, kind: 'icon' });
const tags = (key: string, label: string, hint?: string): CmsField => ({ key, label, kind: 'tags', hint });
const list = (key: string, label: string, fields: CmsField[], hint?: string): CmsField => ({ key, label, kind: 'list', fields, hint });

const heading = [text('eyebrow', 'Small label above heading'), text('title', 'Heading'), area('description', 'Description')];
const linkButton = [text('ctaLabel', 'Button text'), url('ctaHref', 'Button link')];
const BOOKING_LINK_HINT = 'Leave empty to open the booking form.';

const DEFAULTS = {
  // ── Homepage ──
  hero: {
    slides: [
      {
        eyebrow: 'Skin · Hair · Laser · Dermatology',
        title: 'Expert Care for Skin That Feels Like You, Only Better',
        description: 'Personalised dermatology and aesthetic treatments, backed by real medical expertise — not guesswork.',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&h=900&fit=crop&auto=format&q=80',
      },
      {
        eyebrow: 'Advanced Laser & Aesthetic Technology',
        title: 'Confidence Starts With Skin You Trust',
        description: 'From laser hair removal to anti-ageing care, calibrated safely for every skin tone.',
        image: 'https://images.unsplash.com/photo-1643684391140-c5056cfd3436?w=1600&h=900&fit=crop&auto=format&q=80',
      },
    ],
    ctaLabel: 'Book Free Consultation',
    ctaHref: '',
    whatsappLabel: 'WhatsApp Now',
    rotatingLabel: 'We specialise in',
    rotatingWords: ['Skin', 'Hair', 'Laser', 'Anti-Ageing', 'Bridal Glow'],
    trustIndicators: [
      { icon: 'Users', label: '25,000+ Happy Clients' },
      { icon: 'ShieldCheck', label: 'Certified Dermatologists' },
      { icon: 'Sparkles', label: '40+ Advanced Treatments' },
    ],
    ratingTitle: '4.9 / 5',
    ratingNote: 'from 2,400+ verified reviews',
    ratingFooter: 'Loved by patients across 5 cities',
  },
  'trust-stats': { items: stats },
  'treatment-categories': {
    eyebrow: 'What We Treat',
    title: 'Explore Our Treatments',
    description: '{count} specialised categories of care, each led by dermatologists who focus on getting the fundamentals right.',
  },
  'popular-treatments': {
    eyebrow: 'Most Requested',
    title: 'Popular Treatments',
    description: 'The treatments our patients ask for most — each backed by a clear, personalised protocol.',
    featuredSlugs: [] as string[],
    ctaLabel: 'View All Services',
    ctaHref: '/services',
  },
  concerns: {
    eyebrow: 'Personalised Care',
    title: 'Tell Us Your Concern',
    description: "Start from what's actually bothering you — we'll guide you to the right treatment from there.",
  },
  'why-choose-us': {
    eyebrow: 'Why White Plum',
    title: 'Why Choose Us',
    description: 'A clinic built around honest guidance, qualified doctors, and results you can actually see.',
    image: placeholderImage('why-choose-us', 900, 900),
    imageAlt: 'Our clinic team',
    items: whyChooseUs,
  },
  philosophy: {
    quote: 'We believe great skin is never rushed. Every plan starts with listening — not a price list —',
    highlight: "and it's built around your skin, not a sales target.",
    attribution: 'White Plum Wellness',
    backgroundImage: '',
  },
  'treatment-journey': {
    eyebrow: 'How It Works',
    title: 'Your Treatment Journey',
    description: 'A clear, five-step process from first consultation to lasting results.',
    items: treatmentJourney,
  },
  'before-after': {
    eyebrow: 'Real Results',
    title: 'Before & After',
    description: 'Drag the slider to see the difference — real patient results across our most requested treatments.',
    ctaLabel: 'View All Results',
    ctaHref: '/results',
  },
  'featured-packages': {
    eyebrow: 'Curated Programs',
    title: 'Featured Packages',
    description: 'Structured, multi-session programs designed around specific goals — priced transparently upfront.',
    featuredSlugs: [] as string[],
    ctaLabel: 'View all packages',
    ctaHref: '/packages',
  },
  doctors: {
    eyebrow: 'Meet the Team',
    title: 'Our Doctors',
    description: 'Board-certified dermatologists and aesthetic specialists, each with a distinct area of focus.',
  },
  'clinic-locator': {
    eyebrow: 'Visit Us',
    title: 'Find Your Clinic',
    description: 'Five clinics, one consistent standard of care — choose the one closest to you.',
    image: placeholderImage('map-placeholder', 700, 900),
  },
  offers: {
    eyebrow: 'Limited Time',
    title: 'Offers worth booking for',
    description: '',
    featuredSlugs: [] as string[],
    ctaLabel: 'View all offers',
    ctaHref: '/offers',
  },
  testimonials: {
    eyebrow: 'Patient Stories',
    title: 'What Our Patients Say',
    description: 'Real experiences from patients across our clinics.',
  },
  awards: { items: awards, mediaLabel: 'As featured in', mediaLogos },
  blogs: {
    eyebrow: 'From Our Doctors',
    title: 'Honest guidance, not miracle cures',
    description: '',
    ctaLabel: 'Read all articles',
    ctaHref: '/blogs',
  },
  faq: { eyebrow: 'Good to Know', title: 'Frequently Asked Questions', description: '' },
  'final-cta': {
    title: 'Your Skin Deserves',
    highlight: 'Expert Care.',
    description:
      'Book a complimentary consultation and get a personalised plan from a qualified dermatologist — no pressure, no obligation.',
    ctaLabel: 'Book Consultation',
    ctaHref: '',
    whatsappLabel: 'WhatsApp Us',
    backgroundImage: '',
  },

  // ── Landing page ──
  'landing-hero': {
    badge: 'Complimentary Dermatologist Consultation',
    title: 'Struggling With Acne, Pigmentation, or Uneven Skin Tone?',
    description:
      'Get a personalised treatment plan from certified dermatologists — clinically proven protocols for clearer, healthier skin, no guesswork.',
    backgroundImage: placeholderImage('cat-skin', 1600, 1200),
    ctaLabel: 'Book Free Consultation',
    ctaHref: '',
    whatsappLabel: 'WhatsApp Us',
    privacyNote: 'Your information stays confidential — no spam, ever.',
    bookingService: 'Skin Treatment',
    bookingConcern: 'Skin Concerns',
    trustIndicators: [
      { icon: 'Users', label: '25,000+ Happy Clients' },
      { icon: 'ShieldCheck', label: 'Certified Dermatologists' },
      { icon: 'Sparkles', label: 'Advanced, Painless Protocols' },
    ],
    ratingNote: '4.9/5 from 2,400+ verified reviews',
  },
  'landing-usp': {
    items: [
      { icon: 'Stethoscope', label: 'Expert Dermatologists' },
      { icon: 'Microscope', label: 'Advanced Technology' },
      { icon: 'HeartHandshake', label: 'Patient-First Care' },
      { icon: 'BadgeCheck', label: 'Certified & Safe' },
    ],
  },
  'landing-treatments': {
    eyebrow: 'Our Services',
    title: 'Skin Treatments We Offer',
    description: 'Each protocol is personalised to your skin after a one-on-one consultation with our dermatologists.',
    categorySlug: 'skin',
    cardCtaLabel: 'Book Free Consultation',
  },
  'landing-offers': {
    eyebrow: 'Current Offers',
    title: 'Special Offers on Skin Care',
    description: '',
    keywords: ['skin', 'pigmentation', 'acne', 'hydrafacial', 'glow', 'facial', 'consultation', 'first visit'],
    cardCtaLabel: 'Claim This Offer',
  },
  'landing-why': {
    eyebrow: 'Our Process',
    title: 'How We Get You Results',
    description: 'No generic facials — every plan starts with an actual skin assessment from a qualified dermatologist.',
    image: placeholderImage('why-choose-us-skin', 900, 900),
    imageAlt: 'Dermatologist consultation',
    items: [
      { icon: 'ClipboardCheck', title: 'Assess', description: 'A thorough skin consultation to understand your concerns and skin type.' },
      { icon: 'Target', title: 'Treat', description: 'A personalised, dermatologist-led protocol using the most effective options for you.' },
      { icon: 'Sparkles', title: 'Transform', description: 'Visible, lasting results — with clear aftercare guidance at every step.' },
    ],
  },
  'landing-results': {
    eyebrow: 'Real Results',
    title: 'Real Skin Transformations',
    description: 'Drag the slider to see the difference — genuine patient results, not stock photos.',
    category: 'Skin',
    footnote:
      'Individual results vary by skin type and condition. A dermatologist will assess suitability during your consultation.',
  },
  'landing-doctor': {
    eyebrow: 'Meet Your Doctor',
    title: 'Personalised Care, Backed By Expertise',
    description: '',
    doctorSlug: 'dr-anika-sharma',
    bookingService: 'Skin Treatment',
  },
  'landing-gallery': {
    eyebrow: 'Inside Our Clinic',
    title: 'A Calm, Clinical Space',
    description: '',
    items: [
      { image: placeholderImage('gallery-clinic-1', 500, 500), alt: 'Clinic reception' },
      { image: placeholderImage('gallery-clinic-2', 500, 500), alt: 'Treatment room' },
      { image: placeholderImage('gallery-clinic-3', 500, 500), alt: 'Consultation room' },
      { image: placeholderImage('gallery-clinic-4', 500, 500), alt: 'Waiting lounge' },
    ],
  },
  'landing-faq': {
    eyebrow: 'Good to Know',
    title: 'Frequently Asked Questions',
    description: '',
    items: [
      {
        question: 'What is the best treatment for acne scars?',
        answer:
          'It depends on the type and depth of scarring — our dermatologists typically recommend a combination of chemical peels, microneedling, or laser resurfacing after an in-person assessment.',
      },
      {
        question: 'Is HydraFacial safe for sensitive skin?',
        answer:
          'Yes — HydraFacial is a gentle, non-invasive treatment suitable for most skin types, including sensitive skin. Your dermatologist will confirm suitability during your consultation.',
      },
      {
        question: 'How many sessions are needed for pigmentation treatment?',
        answer:
          'Most patients see visible improvement over 4–6 sessions, spaced 2–3 weeks apart, though this varies by the type and depth of pigmentation.',
      },
      {
        question: 'Do you offer treatments for mole or wart removal?',
        answer: 'Yes — we offer safe, precise mole, wart, and skin tag removal procedures performed by certified dermatologists.',
      },
      {
        question: 'Is there any downtime after a chemical peel?',
        answer:
          'Most peels involve minimal downtime — mild redness or peeling for a few days. Your dermatologist will share specific aftercare instructions based on the peel strength used.',
      },
    ],
  },
  'landing-reach': { eyebrow: 'Visit Us', title: 'Reach Us', description: '' },

  // ── General-purpose blocks ──
  'rich-text': { eyebrow: '', title: '', body: '' },
  banner: { eyebrow: '', title: 'Banner heading', description: '', image: '', ctaLabel: '', ctaHref: '' },
  'text-image': {
    eyebrow: '',
    title: 'Section heading',
    body: '',
    image: '',
    imageAlt: '',
    imagePosition: 'right',
    ctaLabel: '',
    ctaHref: '',
  },
  cards: {
    eyebrow: '',
    title: 'Section heading',
    description: '',
    items: [{ icon: 'Sparkles', image: '', title: 'Card title', description: '', ctaLabel: '', ctaHref: '' }],
  },
  cta: {
    title: 'Ready to get started?',
    description: '',
    ctaLabel: 'Book Consultation',
    ctaHref: '',
    whatsappLabel: 'WhatsApp Us',
    backgroundImage: '',
  },
  divider: { tone: 'default' },
};

export type SectionType = keyof typeof DEFAULTS;
export type SectionContent<T extends SectionType> = (typeof DEFAULTS)[T];
export type SectionProps = { content?: Record<string, unknown> };

export interface SectionDefinition {
  label: string;
  group: 'Website sections' | 'Landing page sections' | 'Content blocks';
  /** Where this section's non-heading content is managed, shown in its edit form. */
  dataNote?: string;
  fields: CmsField[];
}

const manualSlugs = (source: 'services' | 'packages' | 'offers'): CmsField => ({
  key: 'featuredSlugs',
  label: 'Show only these',
  kind: 'slugs',
  source,
  hint: 'Leave empty to show them automatically.',
});

export const SECTION_DEFINITIONS: Record<SectionType, SectionDefinition> = {
  hero: {
    label: 'Hero banner',
    group: 'Website sections',
    fields: [
      list(
        'slides',
        'Slides',
        [
          image('image', 'Background image'),
          text('eyebrow', 'Small label'),
          text('title', 'Title', 'The last word is highlighted in gold automatically.'),
          area('description', 'Description'),
        ],
      ),
      text('ctaLabel', 'Button text'),
      url('ctaHref', 'Button link', BOOKING_LINK_HINT),
      text('whatsappLabel', 'WhatsApp button text', 'Leave empty to hide the button.'),
      text('rotatingLabel', 'Rotating text label'),
      tags('rotatingWords', 'Rotating words', 'Comma separated.'),
      list('trustIndicators', 'Trust badges', [icon(), text('label', 'Text')]),
      text('ratingTitle', 'Rating card — score'),
      text('ratingNote', 'Rating card — note'),
      text('ratingFooter', 'Rating card — footer'),
    ],
  },
  'trust-stats': {
    label: 'Trust stats',
    group: 'Website sections',
    fields: [list('items', 'Stats', [{ key: 'value', label: 'Number', kind: 'number' }, text('suffix', 'Suffix'), text('label', 'Label')])],
  },
  'treatment-categories': {
    label: 'Treatment categories',
    group: 'Website sections',
    dataNote: 'Categories are managed under Content → Categories. Use {count} in the description for the category count.',
    fields: heading,
  },
  'popular-treatments': {
    label: 'Popular treatments',
    group: 'Website sections',
    dataNote: 'Treatments are managed under Content → Services.',
    fields: [...heading, manualSlugs('services'), ...linkButton],
  },
  concerns: { label: 'Concerns', group: 'Website sections', dataNote: 'Concerns are managed under Content → Concerns.', fields: heading },
  'why-choose-us': {
    label: 'Why choose us',
    group: 'Website sections',
    fields: [
      ...heading,
      image('image', 'Image'),
      text('imageAlt', 'Image description (for SEO)'),
      list('items', 'Reasons', [icon(), text('title', 'Title'), area('description', 'Description')]),
    ],
  },
  philosophy: {
    label: 'Philosophy quote',
    group: 'Website sections',
    fields: [area('quote', 'Quote'), area('highlight', 'Highlighted ending'), text('attribution', 'Attribution'), image('backgroundImage', 'Background image')],
  },
  'treatment-journey': {
    label: 'Treatment journey',
    group: 'Website sections',
    fields: [...heading, list('items', 'Steps', [text('step', 'Step number'), text('title', 'Title'), area('description', 'Description')])],
  },
  'before-after': {
    label: 'Before & after',
    group: 'Website sections',
    dataNote: 'Results are managed under Content → Before & After.',
    fields: [...heading, ...linkButton],
  },
  'featured-packages': {
    label: 'Featured packages',
    group: 'Website sections',
    dataNote: 'Packages are managed under Content → Packages.',
    fields: [...heading, manualSlugs('packages'), ...linkButton],
  },
  doctors: { label: 'Doctors', group: 'Website sections', dataNote: 'Doctors are managed under Content → Doctors.', fields: heading },
  'clinic-locator': {
    label: 'Clinic locator',
    group: 'Website sections',
    dataNote: 'Clinics are managed under Content → Clinics.',
    fields: [...heading, image('image', 'Side image')],
  },
  offers: {
    label: 'Offers',
    group: 'Website sections',
    dataNote: 'Offers are managed under Content → Offers.',
    fields: [...heading, manualSlugs('offers'), ...linkButton],
  },
  testimonials: { label: 'Testimonials', group: 'Website sections', dataNote: 'Testimonials are managed under Content → Testimonials.', fields: heading },
  awards: {
    label: 'Awards & media',
    group: 'Website sections',
    fields: [
      list('items', 'Awards', [text('title', 'Award'), text('issuer', 'Issuer'), text('year', 'Year')], 'The first award is shown large.'),
      text('mediaLabel', 'Media heading'),
      tags('mediaLogos', 'Media names', 'Comma separated.'),
    ],
  },
  blogs: { label: 'Blogs', group: 'Website sections', dataNote: 'Articles are managed under Content → Blogs.', fields: [...heading, ...linkButton] },
  faq: { label: 'FAQs', group: 'Website sections', dataNote: 'Questions are managed under Content → FAQs.', fields: heading },
  'final-cta': {
    label: 'Final call to action',
    group: 'Website sections',
    fields: [
      text('title', 'Heading'),
      text('highlight', 'Highlighted heading ending'),
      area('description', 'Description'),
      text('ctaLabel', 'Button text'),
      url('ctaHref', 'Button link', BOOKING_LINK_HINT),
      text('whatsappLabel', 'WhatsApp button text', 'Leave empty to hide the button.'),
      image('backgroundImage', 'Background image'),
    ],
  },

  'landing-hero': {
    label: 'Landing hero',
    group: 'Landing page sections',
    fields: [
      text('badge', 'Badge'),
      text('title', 'Heading'),
      area('description', 'Description'),
      image('backgroundImage', 'Background image'),
      text('ctaLabel', 'Button text'),
      url('ctaHref', 'Button link', BOOKING_LINK_HINT),
      text('whatsappLabel', 'WhatsApp button text', 'Leave empty to hide the button.'),
      text('privacyNote', 'Privacy note'),
      text('bookingService', 'Booking form — treatment name'),
      text('bookingConcern', 'Booking form — concern'),
      list('trustIndicators', 'Trust badges', [icon(), text('label', 'Text')]),
      text('ratingNote', 'Rating note'),
    ],
  },
  'landing-usp': { label: 'USP bar', group: 'Landing page sections', fields: [list('items', 'Items', [icon(), text('label', 'Text')])] },
  'landing-treatments': {
    label: 'Treatments carousel',
    group: 'Landing page sections',
    dataNote: 'Treatments are managed under Content → Services.',
    fields: [...heading, text('categorySlug', 'Service category slug'), text('cardCtaLabel', 'Card button text')],
  },
  'landing-offers': {
    label: 'Offers strip',
    group: 'Landing page sections',
    dataNote: 'Offers are managed under Content → Offers.',
    fields: [...heading, tags('keywords', 'Only offers whose title contains', 'Comma separated.'), text('cardCtaLabel', 'Card button text')],
  },
  'landing-why': {
    label: 'Process with image',
    group: 'Landing page sections',
    fields: [
      ...heading,
      image('image', 'Image'),
      text('imageAlt', 'Image description (for SEO)'),
      list('items', 'Steps', [icon(), text('title', 'Title'), area('description', 'Description')]),
    ],
  },
  'landing-results': {
    label: 'Results strip',
    group: 'Landing page sections',
    dataNote: 'Results are managed under Content → Before & After.',
    fields: [...heading, text('category', 'Results category'), area('footnote', 'Footnote')],
  },
  'landing-doctor': {
    label: 'Doctor spotlight',
    group: 'Landing page sections',
    dataNote: 'Doctor details are managed under Content → Doctors.',
    fields: [...heading, text('doctorSlug', 'Doctor slug'), text('bookingService', 'Booking form — treatment name')],
  },
  'landing-gallery': {
    label: 'Image gallery',
    group: 'Landing page sections',
    fields: [...heading, list('items', 'Images', [image('image', 'Image'), text('alt', 'Image description (for SEO)')])],
  },
  'landing-faq': {
    label: 'FAQ list',
    group: 'Landing page sections',
    fields: [...heading, list('items', 'Questions', [text('question', 'Question'), area('answer', 'Answer')])],
  },
  'landing-reach': { label: 'Reach us', group: 'Landing page sections', dataNote: 'Clinics are managed under Content → Clinics.', fields: heading },

  'rich-text': {
    label: 'Text',
    group: 'Content blocks',
    fields: [
      text('eyebrow', 'Small label above heading'),
      text('title', 'Heading'),
      { key: 'body', label: 'Text', kind: 'richtext', hint: 'Blank line = new paragraph. Start a line with "## " for a subheading or "- " for a bullet.' },
    ],
  },
  banner: {
    label: 'Image banner',
    group: 'Content blocks',
    fields: [text('eyebrow', 'Small label'), text('title', 'Heading'), area('description', 'Description'), image('image', 'Background image'), ...linkButton],
  },
  'text-image': {
    label: 'Text with image',
    group: 'Content blocks',
    fields: [
      text('eyebrow', 'Small label above heading'),
      text('title', 'Heading'),
      { key: 'body', label: 'Text', kind: 'richtext', hint: 'Blank line = new paragraph. Start a line with "## " for a subheading or "- " for a bullet.' },
      image('image', 'Image'),
      text('imageAlt', 'Image description (for SEO)'),
      { key: 'imagePosition', label: 'Image side', kind: 'select', options: ['left', 'right'] },
      ...linkButton,
    ],
  },
  cards: {
    label: 'Card grid',
    group: 'Content blocks',
    fields: [
      ...heading,
      list('items', 'Cards', [
        icon(),
        image('image', 'Image', 'Replaces the icon when set.'),
        text('title', 'Title'),
        area('description', 'Description'),
        ...linkButton,
      ]),
    ],
  },
  cta: {
    label: 'Call to action',
    group: 'Content blocks',
    fields: [
      text('title', 'Heading'),
      area('description', 'Description'),
      text('ctaLabel', 'Button text'),
      url('ctaHref', 'Button link', BOOKING_LINK_HINT),
      text('whatsappLabel', 'WhatsApp button text', 'Leave empty to hide the button.'),
      image('backgroundImage', 'Background image'),
    ],
  },
  divider: {
    label: 'Gold divider',
    group: 'Content blocks',
    fields: [{ key: 'tone', label: 'Background', kind: 'select', options: ['default', 'muted'], hint: 'Match the section above it.' }],
  },
};

/** A section's content over its type's defaults — so fields added later, or sections
 * rendered with no CMS data at all, still have every value. */
export function sectionContent<T extends SectionType>(type: T, content?: Record<string, unknown>): SectionContent<T> {
  return { ...DEFAULTS[type], ...content } as SectionContent<T>;
}

/** The admin's hand-picked items in their chosen order, or the first `limit` when none are picked. */
export function pickFeatured<T extends { slug: string }>(items: T[], slugs: string[], limit: number): T[] {
  if (slugs.length === 0) return items.slice(0, limit);
  return slugs.map((slug) => items.find((item) => item.slug === slug)).filter((item): item is T => Boolean(item));
}

export function isSectionType(type: string): type is SectionType {
  return type in DEFAULTS;
}

function makeId(): string {
  return `s-${Math.random().toString(36).slice(2, 10)}`;
}

export function createSection(type: SectionType): CmsSection {
  return { id: makeId(), type, isActive: true, content: structuredClone(DEFAULTS[type]) };
}

function defaults(types: SectionType[], prefix: string): CmsSection[] {
  // Stable ids: these lists are rebuilt on every request until an admin first publishes.
  return types.map((type, i) => ({ id: `${prefix}-${i}`, type, isActive: true, content: structuredClone(DEFAULTS[type]) }));
}

const HOMEPAGE_TYPES: SectionType[] = [
  'hero', 'trust-stats', 'treatment-categories', 'popular-treatments', 'concerns', 'why-choose-us', 'philosophy',
  'treatment-journey', 'before-after', 'featured-packages', 'doctors', 'clinic-locator', 'offers', 'testimonials',
  'awards', 'blogs', 'faq', 'final-cta',
];

const SKIN_TREATMENT_TYPES: SectionType[] = [
  'landing-hero', 'trust-stats', 'landing-usp', 'landing-treatments', 'landing-offers', 'landing-why', 'divider',
  'landing-results', 'landing-doctor', 'divider', 'landing-gallery', 'landing-faq', 'testimonials', 'divider',
  'landing-reach', 'final-cta',
];

/** Before the first publish, the homepage is its built-in layout plus whatever the
 * old Homepage CMS screen had saved (hero slides and featured picks). */
export function resolveHomepageSections(home: HomepageContent): CmsSection[] {
  if (home.sections) return home.sections;
  return defaults(HOMEPAGE_TYPES, 'home').map((section) => {
    const legacy: Record<string, Record<string, unknown>> = {
      hero: { slides: home.heroSlides, ctaLabel: home.heroCtaLabel },
      'popular-treatments': { featuredSlugs: home.featuredServiceSlugs },
      'featured-packages': { featuredSlugs: home.featuredPackageSlugs },
      offers: { featuredSlugs: home.featuredOfferSlugs },
    };
    return { ...section, content: { ...section.content, ...legacy[section.type] } };
  });
}

export function resolvePageSections(page: Pick<CustomPage, 'sections' | 'systemKey' | 'body'>): CmsSection[] {
  if (page.sections) return page.sections;
  if (page.systemKey === 'skin-treatment') {
    return defaults(SKIN_TREATMENT_TYPES, 'skin').map((section, i) =>
      // The divider after the process section sits on the muted background.
      SKIN_TREATMENT_TYPES[i - 1] === 'landing-why' ? { ...section, content: { tone: 'muted' } } : section,
    );
  }
  if (page.body) return [{ id: 'body', type: 'rich-text', isActive: true, content: { body: page.body } }];
  return [];
}
