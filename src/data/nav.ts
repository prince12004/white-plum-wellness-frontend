export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  href: string;
  megaMenu?: {
    columns: { heading: string; links: NavLink[] }[];
  };
}

export const primaryNav: NavGroup[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    megaMenu: {
      columns: [
        {
          heading: 'Skin & Face',
          links: [
            { label: 'Skin', href: '/services/skin' },
            { label: 'Facial Aesthetics', href: '/services/facial-aesthetics' },
            { label: 'Skincare', href: '/services/skincare' },
          ],
        },
        {
          heading: 'Hair & Laser',
          links: [
            { label: 'Hair', href: '/services/hair' },
            { label: 'Laser', href: '/services/laser' },
          ],
        },
        {
          heading: 'Body & More',
          links: [
            { label: 'Anti-Ageing', href: '/services/anti-ageing' },
            { label: 'Body', href: '/services/body' },
            { label: 'Bridal', href: '/services/bridal' },
            { label: 'Aesthetic Procedures', href: '/services/aesthetic-procedures' },
            { label: 'Weight Management', href: '/services/weight-management' },
          ],
        },
      ],
    },
  },
  {
    label: 'Concerns',
    href: '/concerns',
    megaMenu: {
      columns: [
        {
          heading: 'Skin Concerns',
          links: [
            { label: 'Acne', href: '/concerns/acne' },
            { label: 'Pigmentation', href: '/concerns/pigmentation' },
            { label: 'Acne Scars', href: '/concerns/acne-scars' },
            { label: 'Wrinkles', href: '/concerns/wrinkles' },
          ],
        },
        {
          heading: 'Hair Concerns',
          links: [
            { label: 'Hair Fall', href: '/concerns/hair-fall' },
            { label: 'Hair Thinning', href: '/concerns/hair-thinning' },
            { label: 'Dandruff', href: '/concerns/dandruff' },
          ],
        },
        {
          heading: 'Body Concerns',
          links: [
            { label: 'Double Chin', href: '/concerns/double-chin' },
            { label: 'Stretch Marks', href: '/concerns/stretch-marks' },
            { label: 'Unwanted Hair', href: '/concerns/unwanted-hair' },
          ],
        },
      ],
    },
  },
  { label: 'Packages', href: '/packages' },
  // { label: 'Doctors', href: '/doctors' },
  { label: 'Clinics', href: '/clinics' },
  { label: 'Results', href: '/results' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav = {
  explore: [
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Clinics', href: '/clinics' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Contact', href: '/contact' },
  ],
  programs: [
    { label: 'For Men', href: '/for-men' },
    { label: 'Bridal', href: '/bridal' },
    { label: 'Packages', href: '/packages' },
    { label: 'Offers', href: '/offers' },
    { label: 'Results', href: '/results' },
    { label: 'Gallery', href: '/gallery' },
  ],
};
