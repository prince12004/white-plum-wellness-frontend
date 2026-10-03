import { buildWhatsappLink } from '@/data/site';

interface MessageContext {
  service?: string;
  package?: string;
  doctor?: string;
  clinic?: string;
  city?: string;
  offer?: string;
  concern?: string;
  name?: string;
  phone?: string;
}

/** Builds the dynamic pre-filled WhatsApp message per the CTA context it's triggered from. */
export function buildContextMessage(ctx: MessageContext): string {
  const lines: string[] = [];

  if (ctx.service) {
    lines.push('Hello, I would like to enquire about:', '', `Service: ${ctx.service}`);
  } else if (ctx.package) {
    lines.push('Hello, I am interested in:', '', `Package: ${ctx.package}`);
  } else if (ctx.doctor) {
    lines.push('Hello, I would like to book a consultation with:', '', `Doctor: ${ctx.doctor}`);
  } else if (ctx.clinic) {
    lines.push('Hello, I would like to book an appointment at:', '', `Clinic: ${ctx.clinic}`);
    if (ctx.city) lines.push(`City: ${ctx.city}`);
  } else if (ctx.offer) {
    lines.push('Hello, I am interested in:', '', `Offer: ${ctx.offer}`);
  } else {
    lines.push('Hello, I would like to book a consultation.');
  }

  if (ctx.concern) lines.push(`Concern: ${ctx.concern}`);
  if (ctx.name) lines.push(`Name: ${ctx.name}`);
  if (ctx.phone) lines.push(`Phone: ${ctx.phone}`);
  if (ctx.clinic && !lines.some((l) => l.startsWith('Clinic:'))) lines.push(`Preferred Clinic: ${ctx.clinic}`);

  return lines.join('\n');
}

export function buildContextWhatsappLink(ctx: MessageContext, number?: string): string {
  return buildWhatsappLink(buildContextMessage(ctx), number);
}
