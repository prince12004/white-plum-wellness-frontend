/**
 * Real, freely-licensed stock photography (Unsplash), routed by the same seed
 * strings already used throughout the data files — so replacing the image source
 * only required rewriting this one file, not every data file that calls
 * `placeholderImage`/`avatarImage`.
 *
 * Seeds are matched by prefix to a themed pool, then a stable hash of the full seed
 * picks a photo from that pool — deterministic (same seed always renders the same
 * photo) but varied across items in the same theme.
 */

function unsplash(id: string): string {
  const host = id.startsWith('premium_') ? 'plus.unsplash.com' : 'images.unsplash.com';
  return `https://${host}/${id}`;
}

function buildUrl(id: string, width: number, height: number): string {
  const base = unsplash(id);
  return `${base}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pick(pool: string[], seed: string): string {
  return pool[hashSeed(seed) % pool.length] as string;
}

// Hero — wide luxury spa/skincare shots
const HERO_POOL = [
  'photo-1570172619644-dfd03ed5d881',
  'photo-1643684391140-c5056cfd3436',
  'premium_photo-1683134297492-cce5fc6dae31',
];

// One representative real photo per treatment category
const CATEGORY_POOL: Record<string, string> = {
  skin: 'photo-1519415387722-a1c3bbef716c',
  hair: 'photo-1695527081848-1e46c06e6458',
  laser: 'premium_photo-1661386084694-0523d8d1fc9e',
  'anti-ageing': 'photo-1581182815808-b6eb627a8798',
  'facial-aesthetics': 'photo-1761718209852-54ca4210183e',
  body: 'photo-1639162906614-0603b0ae95fd',
  bridal: 'premium_photo-1667509318729-1768e9128ced',
  'aesthetic-procedures': 'photo-1713085085470-fba013d67e65',
  'weight-management': 'photo-1630595271375-5073a6c0638b',
  skincare: 'premium_photo-1682096423780-41ca1b04af68',
};
const CATEGORY_FALLBACK_POOL = Object.values(CATEGORY_POOL);

// Doctor portraits — one distinct real photo per doctor slug
const DOCTOR_POOL: Record<string, string> = {
  'dr-anika-sharma': 'photo-1678695972687-033fa0bdbac9',
  'dr-rohan-mehta': 'premium_photo-1661766752153-9f0c3fad728f',
  'dr-sana-iqbal': 'premium_photo-1664475450083-5c9eef17a191',
  'dr-varun-kapoor': 'premium_photo-1661764878654-3d0fc2eefcca',
  'dr-neha-verma': 'photo-1758691462651-611d730c5272',
  'dr-arjun-rao': 'premium_photo-1661740497193-6aeca35e1b01',
  'dr-priya-nair': 'premium_photo-1681966907271-1e350ec3bb95',
  'dr-kabir-singh': 'photo-1758691463333-c79215e8bc3b',
};

// Clinic interiors — one per clinic slug
const CLINIC_POOL: Record<string, string> = {
  gurgaon: 'premium_photo-1682130157004-057c137d96d5',
  delhi: 'photo-1787496994323-59ac5cff09f9',
  mumbai: 'photo-1762625570087-6d98fca29531',
  noida: 'premium_photo-1682145288913-979906a9ebc8',
  bengaluru: 'photo-1519494140681-8b17d830a3e9',
};
const CLINIC_FALLBACK_POOL = Object.values(CLINIC_POOL);
const DOCTOR_FALLBACK_POOL = Object.values(DOCTOR_POOL);

// Diverse real portraits for testimonial avatars
const PORTRAIT_POOL = [
  'photo-1580489944761-15a19d654956',
  'photo-1500648767791-00dcc994a43e',
  'photo-1494790108377-be9c29b29330',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1604072366595-e75dc92d6bdc',
  'photo-1590086782957-93c06ef21604',
  'premium_photo-1689551671541-31a345ce6ae0',
  'photo-1624395213043-fa2e123b2656',
  'premium_photo-1682089859052-6e9e4463b18c',
  'photo-1543949806-2c9935e6aa78',
];

// Lifestyle/skincare-routine photos for blog thumbnails
const LIFESTYLE_POOL = [
  'premium_photo-1674739375749-7efe56fc8bbb',
  'photo-1619451427882-6aaaded0cc61',
  'photo-1670201203208-055d6d79db4a',
  'premium_photo-1733317329824-7028adef050a',
  'photo-1616394584738-fc6e612e71b9',
  'photo-1598901986949-f593ff2a31a6',
];

// Before/after — two distinct real-photo sub-pools so a "before" and "after" of the
// same record never coincidentally match, while still being fully deterministic.
const BEFORE_POOL = ['photo-1519415387722-a1c3bbef716c', 'photo-1581182815808-b6eb627a8798', 'photo-1604072366595-e75dc92d6bdc'];
const AFTER_POOL = ['premium_photo-1682096423780-41ca1b04af68', 'photo-1494790108377-be9c29b29330', 'photo-1580489944761-15a19d654956'];

function resolveSeed(seed: string): string {
  if (seed.startsWith('doctor-')) {
    // doctors.ts calls avatarImage('doctor-<slug-without-dr->'); DOCTOR_POOL is keyed
    // by the full doctor slug ('dr-anika-sharma'), so translate the prefix to match.
    const slug = `dr-${seed.slice('doctor-'.length)}`;
    return DOCTOR_POOL[slug] ?? pick(PORTRAIT_POOL, seed);
  }
  if (seed.startsWith('clinic-') || seed.startsWith('map-')) {
    const slug = seed.replace(/^map-/, '').replace('clinic-', '');
    return CLINIC_POOL[slug] ?? pick(CLINIC_FALLBACK_POOL, seed);
  }
  if (seed.startsWith('cat-')) {
    const slug = seed.replace('cat-', '');
    return CATEGORY_POOL[slug] ?? pick(CATEGORY_FALLBACK_POOL, seed);
  }
  if (seed.startsWith('men-')) {
    const slug = seed.replace('men-', '');
    const menMap: Record<string, string> = {
      hair: 'hair',
      skin: 'skin',
      beard: 'skin',
      acne: 'skin',
      laser: 'laser',
      'anti-ageing': 'anti-ageing',
      body: 'body',
    };
    return CATEGORY_POOL[menMap[slug] ?? 'skin'] ?? pick(CATEGORY_FALLBACK_POOL, seed);
  }
  if (/^t\d+(-avatar)?$/.test(seed)) {
    return pick(PORTRAIT_POOL, seed);
  }
  if (seed.startsWith('blog-') || seed.startsWith('gallery-events')) {
    return pick(LIFESTYLE_POOL, seed);
  }
  if (seed.startsWith('gallery-clinic')) {
    return pick(CLINIC_FALLBACK_POOL, seed);
  }
  if (seed.startsWith('gallery-doctors')) {
    return pick(DOCTOR_FALLBACK_POOL, seed);
  }
  if (seed.startsWith('gallery-treatment')) {
    return pick(CATEGORY_FALLBACK_POOL, seed);
  }
  if (seed.startsWith('gallery-results')) {
    return pick(AFTER_POOL, seed);
  }
  if (/-before$/.test(seed)) {
    return pick(BEFORE_POOL, seed);
  }
  if (/-after$/.test(seed)) {
    return pick(AFTER_POOL, seed);
  }
  if (seed.startsWith('hero')) {
    return pick(HERO_POOL, seed);
  }
  if (seed.startsWith('svc-') || seed.startsWith('pkg-') || seed.startsWith('offer-')) {
    // Wider combined pool (not just the 10 category photos) — with 40+ services and
    // 15 offers hashing into only 10 buckets, visible duplicates were near-guaranteed
    // (two offer cards showing the literal same photo side by side).
    return pick([...CATEGORY_FALLBACK_POOL, ...LIFESTYLE_POOL], seed);
  }
  if (seed.startsWith('concern-')) {
    return pick([...CATEGORY_FALLBACK_POOL, ...PORTRAIT_POOL.slice(0, 3)], seed);
  }
  // about-hero, about-story, bridal-hero, for-men-hero, why-choose-us, and anything
  // else uncategorised fall back to the category/hero pools for a coherent look.
  return pick([...HERO_POOL, ...CATEGORY_FALLBACK_POOL], seed);
}

export function placeholderImage(seed: string, width = 800, height = 600): string {
  return buildUrl(resolveSeed(seed), width, height);
}

export function avatarImage(seed: string, size = 200): string {
  return buildUrl(resolveSeed(seed), size, size);
}
