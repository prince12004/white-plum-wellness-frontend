import { placeholderImage } from './images';

export interface HeroSlide {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: 'Skin · Hair · Laser · Dermatology',
    title: 'Expert Care for Skin That Feels Like You, Only Better',
    description:
      'Personalised dermatology and aesthetic treatments, backed by real medical expertise — not guesswork.',
    image: placeholderImage('hero-1', 1600, 900),
  },
  {
    eyebrow: 'Advanced Laser & Aesthetic Technology',
    title: 'Confidence Starts With Skin You Trust',
    description: 'From laser hair removal to anti-ageing care, calibrated safely for every skin tone.',
    image: placeholderImage('hero-2', 1600, 900),
  },
  {
    eyebrow: 'Bridal & Body Wellness Programs',
    title: 'A Glow Worth Planning For',
    description: 'Timed treatment journeys for your wedding day, and every day after it.',
    image: placeholderImage('hero-3', 1600, 900),
  },
];
