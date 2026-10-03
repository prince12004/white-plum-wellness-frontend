import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck, Sparkles, Users, Youtube } from 'lucide-react';
import { footerNav } from '@/data/nav';
import { siteConfig } from '@/data/site';
import { Logo } from '@/components/logo';
import { Stagger, FadeUp } from '@/components/ui/motion';

const trustPoints = [
  { icon: ShieldCheck, label: 'Certified Dermatologists' },
  { icon: Users, label: '25,000+ Happy Clients' },
  { icon: Sparkles, label: '40+ Advanced Treatments' },
];

const footerLinkClass =
  'group/link relative inline-block text-sm text-ivory-200/80 transition-colors hover:text-peach-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-peach-300 after:transition-all after:duration-300 group-hover/link:after:w-full';
const socialIconClass =
  'flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-peach-500';

export function Footer() {
  return (
    // A genuinely different hue from the Final CTA's neutral charcoal-900 (not just
    // another near-black) — a deep wine/plum, so the seam between the two sections
    // is obvious at a glance rather than needing to look closely for a shade shift.
    <footer className="relative overflow-hidden bg-peach-800 text-ivory-100">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-charcoal-900/20 blur-[110px]" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold-400/15 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <Stagger className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-x-8" staggerDelay={0.1}>
          <FadeUp>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory-200/70">{siteConfig.tagline}</p>
            <div className="mt-5 flex gap-3">
              <a href={siteConfig.social.instagram} aria-label="Instagram" className={socialIconClass}>
                <Instagram className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.facebook} aria-label="Facebook" className={socialIconClass}>
                <Facebook className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.youtube} aria-label="YouTube" className={socialIconClass}>
                <Youtube className="h-4 w-4" />
              </a>
            </div>
            <ul className="mt-6 flex flex-col gap-2.5 border-t border-white/10 pt-5">
              {trustPoints.map(({ icon: TrustIcon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm text-ivory-200/70">
                  <TrustIcon className="h-3.5 w-3.5 shrink-0 text-gold-300" />
                  {label}
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-gold-300">Explore</p>
            <ul className="mt-4 flex flex-col gap-2">
              {footerNav.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-gold-300">Programs</p>
            <ul className="mt-4 flex flex-col gap-2">
              {footerNav.programs.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-gold-300">Get in Touch</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ivory-200/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-peach-300" />
                {siteConfig.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-peach-300" />
                {siteConfig.contactPhone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-peach-300" />
                {siteConfig.contactEmail}
              </li>
            </ul>
          </FadeUp>
        </Stagger>

        <FadeUp
          standalone
          className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-gold-300/20 pt-4 text-center text-[0.7rem] font-medium uppercase tracking-wide text-gold-200/70 sm:justify-between sm:text-left"
        >
          <p>© {new Date().getFullYear()} {siteConfig.businessName} — All Rights Reserved</p>
          <p className="normal-case tracking-normal text-ivory-200/45">Demo content for design review only. Results are illustrative and vary by individual.</p>
        </FadeUp>
      </div>
    </footer>
  );
}
