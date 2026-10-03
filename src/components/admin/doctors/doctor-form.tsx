'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Clinic, Doctor, PaginatedResponse } from '@white/types';
import {
  Button,
  Card,
  CardContent,
  ImageUpload,
  Input,
  Label,
  MultiSelect,
  Textarea,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { arrayToLines, linesToArray } from '@/lib/admin/array-fields';

interface DoctorFormProps {
  doctor?: Doctor | null;
}

export function DoctorForm({ doctor }: DoctorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(doctor);

  const [slug, setSlug] = useState(doctor?.slug ?? '');
  const [name, setName] = useState(doctor?.name ?? '');
  const [photo, setPhoto] = useState(doctor?.photo ?? '');
  const [qualification, setQualification] = useState(doctor?.qualification ?? '');
  const [experienceYears, setExperienceYears] = useState(doctor?.experienceYears ?? 0);
  const [specialization, setSpecialization] = useState(arrayToLines(doctor?.specialization));
  const [bio, setBio] = useState(doctor?.bio ?? '');
  const [languages, setLanguages] = useState(arrayToLines(doctor?.languages));
  const [awards, setAwards] = useState(arrayToLines(doctor?.awards));
  const [clinicSlugs, setClinicSlugs] = useState<string[]>(doctor?.clinicSlugs ?? []);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<PaginatedResponse<Clinic>>('/clinics?pageSize=200').then((res) => setClinics(res.items));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      slug,
      name,
      photo,
      qualification,
      experienceYears,
      specialization: linesToArray(specialization),
      bio,
      languages: linesToArray(languages),
      awards: linesToArray(awards),
      clinicSlugs,
    };
    try {
      if (isEdit && doctor) {
        await apiClient.patch(`/doctors/${doctor.id}`, payload);
      } else {
        await apiClient.post('/doctors', payload);
      }
      toast({ title: isEdit ? 'Doctor updated' : 'Doctor created' });
      router.push('/admin/doctors');
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
              <Label htmlFor="doctor-name">Name</Label>
              <Input id="doctor-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="doctor-slug">Slug</Label>
              <Input id="doctor-slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Photo</Label>
            <ImageUpload value={photo} onChange={setPhoto} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="doctor-qualification">Qualification</Label>
              <Input id="doctor-qualification" required value={qualification} onChange={(e) => setQualification(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="doctor-experience">Years of experience</Label>
              <Input
                id="doctor-experience"
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doctor-bio">Bio</Label>
            <Textarea id="doctor-bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="doctor-specialization">Specialization (one per line)</Label>
              <Textarea id="doctor-specialization" rows={3} value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="doctor-languages">Languages (one per line)</Label>
              <Textarea id="doctor-languages" rows={3} value={languages} onChange={(e) => setLanguages(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doctor-awards">Awards (one per line)</Label>
            <Textarea id="doctor-awards" rows={2} value={awards} onChange={(e) => setAwards(e.target.value)} />
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
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/doctors')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create doctor'}
        </Button>
      </div>
    </form>
  );
}
