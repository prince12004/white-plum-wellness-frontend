
export interface SiteConfig {
  businessName: string;
  tagline: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  address: string;
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
}

export const siteConfig: SiteConfig = {
  businessName: 'White Plum Wellness',
  tagline: 'Skin · Hair · Laser · Aesthetics',
  contactPhone: '+91 79826 48345',
  contactEmail: 'hello@whiteplumwellness.example',
  whatsappNumber: '917982648345',
  address: 'M-83, M Block Market, GK-2, New Delhi',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
  },
};

export function buildWhatsappLink(message: string, number: string = siteConfig.whatsappNumber): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
