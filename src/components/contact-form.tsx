'use client';

import { useState } from 'react';
import { Button, Input, Label, Select } from '@white/ui';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import type { Clinic } from '@/data/clinics';
import type { Concern } from '@/data/concerns';
import { buildWhatsappLink } from '@/data/site';

export function ContactForm({ clinics, concerns }: { clinics: Clinic[]; concerns: Concern[] }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [concern, setConcern] = useState('');
  const [clinic, setClinic] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      'Hello, I would like to get in touch.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
    ];
    if (email) lines.push(`Email: ${email}`);
    if (concern) lines.push(`Concern: ${concern}`);
    if (clinic) lines.push(`Preferred Clinic: ${clinic}`);
    if (message) lines.push('', `Message: ${message}`);

    window.open(buildWhatsappLink(lines.join('\n')), '_blank', 'noopener,noreferrer');
  }

  return (
    <ScrollReveal>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-ivory-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-phone">Mobile Number</Label>
          <Input id="contact-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-email">Email (optional)</Label>
        <Input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-concern">Concern</Label>
          <Select id="contact-concern" value={concern} onChange={(e) => setConcern(e.target.value)}>
            <option value="">Select a concern</option>
            {concerns.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-clinic">Preferred Clinic</Label>
          <Select id="contact-clinic" value={clinic} onChange={(e) => setClinic(e.target.value)}>
            <option value="">No preference</option>
            {clinics.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">Message (optional)</Label>
        <textarea
          id="contact-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex w-full rounded-xl border border-ivory-200 bg-white px-3 py-2 text-sm text-charcoal-900 transition-all duration-200 placeholder:text-charcoal-300 focus-visible:border-peach-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-400/60"
        />
      </div>
      <Button type="submit" variant="whatsapp" size="lg">
        Send via WhatsApp
      </Button>
    </form>
    </ScrollReveal>
  );
}
