'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BeforeAfterResult, Clinic, Concern, Doctor, PaginatedResponse, Service } from '@white/types';
import { Button, Card, CardContent, ImageUpload, Input, Label, Select, Textarea, useToast } from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

const CATEGORIES = ['Skin', 'Hair', 'Laser', 'Body', 'Anti-Ageing'];

interface BeforeAfterFormProps {
  result?: BeforeAfterResult | null;
}

export function BeforeAfterForm({ result }: BeforeAfterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(result);

  const [title, setTitle] = useState(result?.title ?? '');
  const [category, setCategory] = useState(result?.category ?? (CATEGORIES[0] as string));
  const [beforeImage, setBeforeImage] = useState(result?.beforeImage ?? '');
  const [afterImage, setAfterImage] = useState(result?.afterImage ?? '');
  const [treatmentSlug, setTreatmentSlug] = useState(result?.treatmentSlug ?? '');
  const [concernSlug, setConcernSlug] = useState(result?.concernSlug ?? '');
  const [doctorSlug, setDoctorSlug] = useState(result?.doctorSlug ?? '');
  const [clinicSlug, setClinicSlug] = useState(result?.clinicSlug ?? '');
  const [sessions, setSessions] = useState(result?.sessions ?? '');
  const [duration, setDuration] = useState(result?.duration ?? '');
  const [description, setDescription] = useState(result?.description ?? '');
  const [services, setServices] = useState<Service[]>([]);
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<PaginatedResponse<Service>>('/services?pageSize=200').then((res) => setServices(res.items));
    apiClient.get<PaginatedResponse<Concern>>('/concerns?pageSize=200').then((res) => setConcerns(res.items));
    apiClient.get<PaginatedResponse<Doctor>>('/doctors?pageSize=200').then((res) => setDoctors(res.items));
    apiClient.get<PaginatedResponse<Clinic>>('/clinics?pageSize=200').then((res) => setClinics(res.items));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      title,
      category,
      beforeImage,
      afterImage,
      treatmentSlug,
      concernSlug,
      doctorSlug,
      clinicSlug,
      sessions,
      duration,
      description,
    };
    try {
      if (isEdit && result) {
        await apiClient.patch(`/before-after/${result.id}`, payload);
      } else {
        await apiClient.post('/before-after', payload);
      }
      toast({ title: isEdit ? 'Result updated' : 'Result created' });
      router.push('/admin/before-after');
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
              <Label htmlFor="ba-title">Title</Label>
              <Input id="ba-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ba-category">Category</Label>
              <Select id="ba-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Before photo</Label>
              <ImageUpload value={beforeImage} onChange={setBeforeImage} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>After photo</Label>
              <ImageUpload value={afterImage} onChange={setAfterImage} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ba-treatment">Treatment</Label>
              <Select id="ba-treatment" value={treatmentSlug} onChange={(e) => setTreatmentSlug(e.target.value)}>
                <option value="">None</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ba-concern">Concern</Label>
              <Select id="ba-concern" value={concernSlug} onChange={(e) => setConcernSlug(e.target.value)}>
                <option value="">None</option>
                {concerns.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ba-doctor">Doctor</Label>
              <Select id="ba-doctor" value={doctorSlug} onChange={(e) => setDoctorSlug(e.target.value)}>
                <option value="">None</option>
                {doctors.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ba-clinic">Clinic</Label>
              <Select id="ba-clinic" value={clinicSlug} onChange={(e) => setClinicSlug(e.target.value)}>
                <option value="">None</option>
                {clinics.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ba-sessions">Sessions</Label>
              <Input id="ba-sessions" value={sessions} onChange={(e) => setSessions(e.target.value)} placeholder="e.g. 4–6 sessions" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ba-duration">Duration</Label>
              <Input id="ba-duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3 months" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ba-description">Description</Label>
            <Textarea id="ba-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/before-after')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create result'}
        </Button>
      </div>
    </form>
  );
}
