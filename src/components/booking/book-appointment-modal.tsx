'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
} from '@white/ui';
import type { Clinic } from '@/data/clinics';
import type { Concern } from '@/data/concerns';
import type { Service } from '@/data/services';
import { buildContextWhatsappLink } from '@/lib/whatsapp';

export interface BookingContext {
  service?: string;
  package?: string;
  doctor?: string;
  clinic?: string;
  city?: string;
  offer?: string;
  concern?: string;
}

interface BookAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: BookingContext;
}

export function BookAppointmentModal({ open, onOpenChange, context }: BookAppointmentModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [concern, setConcern] = useState(context?.concern ?? '');
  const [service, setService] = useState(context?.service ?? '');
  const [clinic, setClinic] = useState(context?.clinic ?? '');

  // Dropdown options are fetched once, client-side, the first time the modal opens —
  // this dialog is mounted on nearly every page, so it must not block server rendering.
  const [services, setServices] = useState<Service[]>([]);
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loadedOptions, setLoadedOptions] = useState(false);

  useEffect(() => {
    if (!open || loadedOptions) return;
    setLoadedOptions(true);
    fetch('/api/services?pageSize=100')
      .then((res) => res.json())
      .then((data) => setServices(data.items ?? []))
      .catch(() => {});
    fetch('/api/concerns?pageSize=100')
      .then((res) => res.json())
      .then((data) => setConcerns(data.items ?? []))
      .catch(() => {});
    fetch('/api/clinics?pageSize=100')
      .then((res) => res.json())
      .then((data) => setClinics(data.items ?? []))
      .catch(() => {});
  }, [open, loadedOptions]);

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    const finalService = context?.service ?? service ?? undefined;
    const finalConcern = context?.concern ?? concern ?? undefined;
    const finalClinic = context?.clinic ?? clinic ?? undefined;

    const link = buildContextWhatsappLink({
      ...context,
      service: finalService,
      concern: finalConcern,
      name: name || undefined,
      phone: phone || undefined,
      clinic: finalClinic,
    });

    // Best-effort: also persist this as a booking if we have enough to identify the
    // patient — never blocks or delays the WhatsApp hand-off, which stays the real
    // communication channel regardless of whether this succeeds.
    if (name && phone) {
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          phone,
          service: finalService,
          package: context?.package,
          doctor: context?.doctor,
          clinic: finalClinic,
          city: context?.city,
          offer: context?.offer,
          concern: finalConcern,
        }),
      }).catch(() => {});
    }

    window.open(link, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book a Consultation</DialogTitle>
          <DialogDescription>
            Share a few details and we&apos;ll continue the conversation on WhatsApp — no online payment, no account
            needed.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleContinue}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="booking-name">Name</Label>
            <Input id="booking-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="booking-mobile">Mobile Number</Label>
            <Input
              id="booking-mobile"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
            />
          </div>
          {!context?.service && !context?.package && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="booking-service">Service (optional)</Label>
              <Select id="booking-service" value={service} onChange={(e) => setService(e.target.value)}>
                <option value="">Not sure yet</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          {!context?.concern && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="booking-concern">Concern (optional)</Label>
              <Select id="booking-concern" value={concern} onChange={(e) => setConcern(e.target.value)}>
                <option value="">Select a concern</option>
                {concerns.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          {!context?.clinic && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="booking-clinic">Preferred Clinic (optional)</Label>
              <Select id="booking-clinic" value={clinic} onChange={(e) => setClinic(e.target.value)}>
                <option value="">No preference</option>
                {clinics.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="whatsapp">
              Continue on WhatsApp
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
