/**
 * Fixed taxonomy — mirrors apps/web/src/data/categories.ts. Categories are a small,
 * rarely-changing set for a clinic's service line, so unlike services/doctors/etc.
 * they're kept as a constant here rather than their own admin-managed collection.
 */
export const SERVICE_CATEGORIES = [
  { slug: 'skin', name: 'Skin' },
  { slug: 'hair', name: 'Hair' },
  { slug: 'laser', name: 'Laser' },
  { slug: 'anti-ageing', name: 'Anti-Ageing' },
  { slug: 'facial-aesthetics', name: 'Facial Aesthetics' },
  { slug: 'body', name: 'Body' },
  { slug: 'bridal', name: 'Bridal' },
  { slug: 'aesthetic-procedures', name: 'Aesthetic Procedures' },
  { slug: 'weight-management', name: 'Weight Management' },
  { slug: 'skincare', name: 'Skincare' },
];
