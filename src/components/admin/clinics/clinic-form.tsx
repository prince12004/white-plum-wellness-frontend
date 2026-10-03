'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Clinic, OpeningHour } from '@white/types';
import {
  Button,
  Card,
  CardContent,
  ImageUpload,
  Input,
  Label,
  MultiSelect,
  Switch,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { SERVICE_CATEGORIES } from '@/lib/admin/service-categories';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function defaultHours(): OpeningHour[] {
  return DAYS.map((day) => ({ day, hours: '10:00 AM – 7:00 PM' }));
}

interface ClinicFormProps {
  clinic?: Clinic | null;
}

export function ClinicForm({ clinic }: ClinicFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(clinic);

  const [name, setName] = useState(clinic?.name ?? '');
  const [slug, setSlug] = useState(clinic?.slug ?? '');
  const [city, setCity] = useState(clinic?.city ?? '');
  const [area, setArea] = useState(clinic?.area ?? '');
  const [address, setAddress] = useState(clinic?.address ?? '');
  const [phone, setPhone] = useState(clinic?.phone ?? '');
  const [whatsapp, setWhatsapp] = useState(clinic?.whatsapp ?? '');
  const [email, setEmail] = useState(clinic?.email ?? '');
  const [image, setImage] = useState(clinic?.image ?? '');
  const [isActive, setIsActive] = useState(clinic?.isActive ?? true);
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>(
    clinic?.openingHours?.length ? clinic.openingHours : defaultHours(),
  );
  const [categorySlugs, setCategorySlugs] = useState<string[]>(clinic?.categorySlugs ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateHours(day: string, hours: string) {
    setOpeningHours((prev) => prev.map((h) => (h.day === day ? { ...h, hours } : h)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      name,
      slug,
      city,
      area,
      address,
      phone,
      whatsapp,
      email,
      image,
      isActive,
      openingHours,
      categorySlugs,
    };
    try {
      if (isEdit && clinic) {
        await apiClient.patch(`/clinics/${clinic.id}`, payload);
      } else {
        await apiClient.post('/clinics', payload);
      }
      toast({ title: isEdit ? 'Clinic updated' : 'Clinic created' });
      router.push('/admin/clinics');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clinic-name">Name</Label>
              <Input id="clinic-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clinic-slug">Slug</Label>
              <Input id="clinic-slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Photo</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clinic-city">City</Label>
              <Input id="clinic-city" required value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clinic-area">Area</Label>
              <Input id="clinic-area" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="clinic-address">Address</Label>
            <Input id="clinic-address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clinic-phone">Phone</Label>
              <Input id="clinic-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clinic-whatsapp">WhatsApp number</Label>
              <Input id="clinic-whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clinic-email">Email</Label>
              <Input id="clinic-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Categories offered</Label>
            <MultiSelect
              options={SERVICE_CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))}
              value={categorySlugs}
              onChange={setCategorySlugs}
              placeholder="Select categories…"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Opening hours</Label>
            <div className="grid grid-cols-1 gap-2 rounded-xl border border-ivory-200 p-3 sm:grid-cols-2">
              {openingHours.map((h) => (
                <div key={h.day} className="flex items-center gap-2">
                  <span className="w-20 shrink-0 text-xs font-medium text-charcoal-500">{h.day}</span>
                  <Input value={h.hours} onChange={(e) => updateHours(h.day, e.target.value)} className="h-8 text-xs" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="clinic-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="clinic-active">Active (visible on public site)</Label>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/clinics')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create clinic'}
        </Button>
      </div>
    </form>
  );
}
