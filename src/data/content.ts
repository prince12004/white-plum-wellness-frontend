import { placeholderImage } from './images';
import { apiGetAll } from '@/lib/api';
import type { GalleryItem } from '@white/types';
export type { GalleryItem } from '@white/types';

export const stats = [
  { value: 25000, suffix: '+', label: 'Happy Clients' },
  { value: 40, suffix: '+', label: 'Treatments' },
  { value: 5, suffix: '+', label: 'Clinics' },
  { value: 10, suffix: '+', label: 'Experts' },
];

export const whyChooseUs = [
  { icon: 'Stethoscope', title: 'Expert Doctors', description: 'Every protocol is led by qualified, experienced dermatologists — not technicians.' },
  { icon: 'Cpu', title: 'Advanced Technology', description: 'Clinically validated devices, calibrated specifically for a range of skin tones.' },
  { icon: 'UserCheck', title: 'Personalised Treatment', description: 'No fixed packages by default — every plan starts from your specific concern.' },
  { icon: 'ShieldCheck', title: 'Safety First', description: 'Sterile protocols and conservative, evidence-based dosing at every step.' },
  { icon: 'MapPin', title: 'Multiple Clinics', description: 'Consistent quality of care across all our clinic locations.' },
  { icon: 'MessageCircle', title: 'Transparent Guidance', description: 'Honest timelines and realistic expectations — no overpromising.' },
];

export const treatmentJourney = [
  { step: '01', title: 'Consult', description: 'A detailed conversation about your concern, history, and goals.' },
  { step: '02', title: 'Assess', description: 'In-depth skin, hair, or body assessment using clinical tools.' },
  { step: '03', title: 'Personalise', description: 'A treatment plan built specifically around your profile.' },
  { step: '04', title: 'Treat', description: 'Sessions delivered by qualified specialists, on schedule.' },
  { step: '05', title: 'Follow-up', description: 'Progress reviewed and the plan refined as you go.' },
];

export const awards = [
  { title: 'Best Aesthetic Clinic Chain', issuer: 'India Health & Wellness Awards', year: '2025' },
  { title: 'Excellence in Patient Care', issuer: 'National Dermatology Council', year: '2024' },
  { title: 'Top Emerging Clinic Network', issuer: 'Beauty & Wellness Business Awards', year: '2023' },
  { title: 'Certified Safety Standards', issuer: 'Aesthetic Practitioners Association', year: '2025' },
];

export const mediaLogos = ['The Wellness Times', 'Metro Health Journal', 'City Lifestyle', 'India Aesthetics Weekly'];

export const galleryCategories = ['Clinic', 'Treatment', 'Doctors', 'Events', 'Results'] as const;

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  return apiGetAll<GalleryItem>('/gallery');
}

export const bridalTimeline = [
  { month: '3 Months Before', title: 'Foundation Phase', description: 'Start core skin and hair treatments to build a healthy baseline.' },
  { month: '2 Months Before', title: 'Correction Phase', description: 'Address specific concerns — pigmentation, acne, or dullness.' },
  { month: '1 Month Before', title: 'Refinement Phase', description: 'Fine-tune with glow-boosting facials and body treatments.' },
  { month: 'Final 2 Weeks', title: 'Maintenance Phase', description: 'Gentle, tried-and-tested treatments only — no new products or procedures.' },
  { month: 'Wedding Week', title: 'Touch-Up', description: 'A final glow facial and touch-up session before the big day.' },
];

export const forMenSections = [
  { slug: 'hair', title: 'Hair', description: 'From hair fall to transplants — treatments built around male pattern hair loss.', image: placeholderImage('men-hair') },
  { slug: 'skin', title: 'Skin', description: 'Practical skincare and treatment plans for everyday male skin concerns.', image: placeholderImage('men-skin') },
  { slug: 'beard', title: 'Beard', description: 'Solutions for patchy beard growth, beard-area acne, and grooming concerns.', image: placeholderImage('men-beard') },
  { slug: 'acne', title: 'Acne', description: 'Targeted acne treatment for stress- and shaving-related breakouts.', image: placeholderImage('men-acne') },
  { slug: 'laser', title: 'Laser Hair Removal', description: 'Long-term reduction for back, chest, or beard-line grooming.', image: placeholderImage('men-laser') },
  { slug: 'anti-ageing', title: 'Anti-Ageing', description: 'Subtle, natural-looking treatments for a refreshed appearance.', image: placeholderImage('men-anti-ageing') },
  { slug: 'body', title: 'Body', description: 'Non-invasive body contouring for a leaner, more defined physique.', image: placeholderImage('men-body') },
];
