import { placeholderImage } from './images';

export interface Category {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  image: string;
}

export const categories: Category[] = [
  {
    slug: 'skin',
    name: 'Skin',
    shortDescription: 'Acne, pigmentation, brightening & rejuvenation',
    description:
      'Comprehensive skin care built around your skin type and concern — from stubborn acne and pigmentation to overall brightening and rejuvenation, using clinically proven protocols.',
    icon: 'Sparkles',
    image: placeholderImage('cat-skin'),
  },
  {
    slug: 'hair',
    name: 'Hair',
    shortDescription: 'Hair fall, thinning, restoration & scalp health',
    description:
      'Evidence-based hair treatments spanning medical therapy, PRP, and restoration procedures, designed to address hair fall at the root cause rather than mask the symptom.',
    icon: 'Wind',
    image: placeholderImage('cat-hair'),
  },
  {
    slug: 'laser',
    name: 'Laser',
    shortDescription: 'Hair removal, pigmentation & skin resurfacing',
    description:
      'Advanced laser platforms for permanent hair reduction, pigmentation correction, and skin resurfacing — calibrated to Indian skin tones for safe, consistent results.',
    icon: 'Zap',
    image: placeholderImage('cat-laser'),
  },
  {
    slug: 'anti-ageing',
    name: 'Anti-Ageing',
    shortDescription: 'Botox, fillers, threads & skin tightening',
    description:
      'Subtle, natural-looking anti-ageing solutions — from injectables to non-surgical skin tightening — that soften fine lines without changing who you are.',
    icon: 'Clock',
    image: placeholderImage('cat-anti-ageing'),
  },
  {
    slug: 'facial-aesthetics',
    name: 'Facial Aesthetics',
    shortDescription: 'Contouring, harmonisation & jawline definition',
    description:
      'Precision facial contouring and harmonisation procedures that enhance your natural features with a balanced, proportionate approach.',
    icon: 'Smile',
    image: placeholderImage('cat-facial-aesthetics'),
  },
  {
    slug: 'body',
    name: 'Body',
    shortDescription: 'Contouring, fat reduction & skin tightening',
    description:
      'Non-invasive body contouring and tightening treatments to help you achieve a more sculpted silhouette without surgery or downtime.',
    icon: 'Activity',
    image: placeholderImage('cat-body'),
  },
  {
    slug: 'bridal',
    name: 'Bridal',
    shortDescription: 'Curated pre-bridal glow programs',
    description:
      'Timed pre-bridal programs combining skin, hair, and body treatments so you arrive at every function looking and feeling your absolute best.',
    icon: 'Heart',
    image: placeholderImage('cat-bridal'),
  },
  {
    slug: 'aesthetic-procedures',
    name: 'Aesthetic Procedures',
    shortDescription: 'Advanced surgical & minimally-invasive care',
    description:
      'Consultant-led aesthetic procedures for patients seeking more advanced correction, always beginning with an honest, realistic assessment.',
    icon: 'Stethoscope',
    image: placeholderImage('cat-aesthetic-procedures'),
  },
  {
    slug: 'weight-management',
    name: 'Weight Management',
    shortDescription: 'Medically supervised weight & wellness programs',
    description:
      'Structured, medically supervised weight management programs that combine nutrition guidance with body composition tracking.',
    icon: 'TrendingDown',
    image: placeholderImage('cat-weight-management'),
  },
  {
    slug: 'skincare',
    name: 'Skincare',
    shortDescription: 'Doctor-recommended everyday skincare',
    description:
      'Dermatologist-formulated everyday skincare recommendations that support and extend the results of your in-clinic treatments.',
    icon: 'Droplet',
    image: placeholderImage('cat-skincare'),
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
