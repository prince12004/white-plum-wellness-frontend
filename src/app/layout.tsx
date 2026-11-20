import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import { JsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/data/site';
import { HOME_DESCRIPTION, HOME_TITLE, SITE_URL, organizationSchema } from '@/lib/seo';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: 'variable',
  style: ['normal', 'italic'],
  axes: ['SOFT', 'opsz'],
});

// Variable on purpose: Google serves this family's fixed weights from extensionless
// /l/font URLs, which next/font can't parse, so the build fails.
const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: 'variable',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#8E4B5C',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: HOME_DESCRIPTION,
  // Google Search Console ownership; public/googlea4a74fb249365a62.html verifies the same property by file.
  verification: { google: 'JEukt6M0EnjLAksN9qVr75vxY1j0jvD-swJaWWl5b-Y' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">
        <JsonLd data={organizationSchema()} />
        {children}
      </body>
    </html>
  );
}
