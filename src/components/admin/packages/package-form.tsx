'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Clinic, Doctor, PaginatedResponse, TreatmentPackage } from '@white/types';
import {
  Button,
  Card,
  CardContent,
  ImageUpload,
  Input,
  Label,
  MultiSelect,
  Select,
  Textarea,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { arrayToLines, linesToArray } from '@/lib/admin/array-fields';
import { SERVICE_CATEGORIES } from '@/lib/admin/service-categories';
import { FaqListEditor, type FaqRow } from '@/components/admin/shared/faq-list-editor';

interface PackageFormProps {
  pkg?: TreatmentPackage | null;
}

export function PackageForm({ pkg }: PackageFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(pkg);

  const [slug, setSlug] = useState(pkg?.slug ?? '');
  const [name, setName] = useState(pkg?.name ?? '');
  const [categorySlug, setCategorySlug] = useState(pkg?.categorySlug ?? (SERVICE_CATEGORIES[0]?.slug ?? ''));
  const [image, setImage] = useState(pkg?.image ?? '');
  const [description, setDescription] = useState(pkg?.description ?? '');
  const [treatmentsIncluded, setTreatmentsIncluded] = useState(arrayToLines(pkg?.treatmentsIncluded));
  const [sessions, setSessions] = useState(pkg?.sessions ?? '');
  const [duration, setDuration] = useState(pkg?.duration ?? '');
  const [originalPrice, setOriginalPrice] = useState(pkg?.originalPrice ?? 0);
  const [offerPrice, setOfferPrice] = useState(pkg?.offerPrice ?? 0);
  const [benefits, setBenefits] = useState(arrayToLines(pkg?.benefits));
  const [doctorSlug, setDoctorSlug] = useState(pkg?.doctorSlug ?? '');
  const [clinicSlugs, setClinicSlugs] = useState<string[]>(pkg?.clinicSlugs ?? []);
  const [faqs, setFaqs] = useState<FaqRow[]>(pkg?.faqs ?? []);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<PaginatedResponse<Doctor>>('/doctors?pageSize=200').then((res) => setDoctors(res.items));
    apiClient.get<PaginatedResponse<Clinic>>('/clinics?pageSize=200').then((res) => setClinics(res.items));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      slug,
      name,
      categorySlug,
      image,
      description,
      treatmentsIncluded: linesToArray(treatmentsIncluded),
      sessions,
      duration,
      originalPrice,
      offerPrice,
      benefits: linesToArray(benefits),
      doctorSlug,
      clinicSlugs,
      faqs,
    };
    try {
      if (isEdit && pkg) {
        await apiClient.patch(`/packages/${pkg.id}`, payload);
      } else {
        await apiClient.post('/packages', payload);
      }
      toast({ title: isEdit ? 'Package updated' : 'Package created' });
      router.push('/admin/packages');
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
              <Label htmlFor="pkg-name">Name</Label>
              <Input id="pkg-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pkg-slug">Slug</Label>
              <Input id="pkg-slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pkg-category">Category</Label>
            <Select id="pkg-category" value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Image</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pkg-description">Description</Label>
            <Textarea id="pkg-description" required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pkg-treatments">Treatments included (one per line)</Label>
            <Textarea id="pkg-treatments" rows={3} value={treatmentsIncluded} onChange={(e) => setTreatmentsIncluded(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pkg-sessions">Sessions</Label>
              <Input id="pkg-sessions" value={sessions} onChange={(e) => setSessions(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pkg-duration">Duration</Label>
              <Input id="pkg-duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pkg-original">Original price</Label>
              <Input id="pkg-original" type="number" required value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pkg-offer">Offer price</Label>
              <Input id="pkg-offer" type="number" required value={offerPrice} onChange={(e) => setOfferPrice(Number(e.target.value))} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pkg-benefits">Benefits (one per line)</Label>
            <Textarea id="pkg-benefits" rows={3} value={benefits} onChange={(e) => setBenefits(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pkg-doctor">Primary doctor</Label>
            <Select id="pkg-doctor" value={doctorSlug} onChange={(e) => setDoctorSlug(e.target.value)}>
              <option value="">None</option>
              {doctors.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Clinics</Label>
            <MultiSelect
              options={clinics.map((c) => ({ value: c.slug, label: c.name }))}
              value={clinicSlugs}
              onChange={setClinicSlugs}
              placeholder="Select clinics…"
            />
          </div>
          <FaqListEditor label="FAQs" items={faqs} onChange={setFaqs} />
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/packages')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create package'}
        </Button>
      </div>
    </form>
  );
}
