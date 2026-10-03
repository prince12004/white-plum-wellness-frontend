'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Concern, PaginatedResponse, Service } from '@white/types';
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

interface ConcernFormProps {
  concern?: Concern | null;
}

export function ConcernForm({ concern }: ConcernFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(concern);

  const [slug, setSlug] = useState(concern?.slug ?? '');
  const [name, setName] = useState(concern?.name ?? '');
  const [icon, setIcon] = useState(concern?.icon ?? '');
  const [image, setImage] = useState(concern?.image ?? '');
  const [shortDescription, setShortDescription] = useState(concern?.shortDescription ?? '');
  const [overview, setOverview] = useState(concern?.overview ?? '');
  const [symptoms, setSymptoms] = useState(arrayToLines(concern?.symptoms));
  const [causes, setCauses] = useState(arrayToLines(concern?.causes));
  const [recommendedServiceSlugs, setRecommendedServiceSlugs] = useState<string[]>(
    concern?.recommendedServiceSlugs ?? [],
  );
  const [services, setServices] = useState<Service[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<PaginatedResponse<Service>>('/services?pageSize=200').then((res) => setServices(res.items));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      slug,
      name,
      icon,
      image,
      shortDescription,
      overview,
      symptoms: linesToArray(symptoms),
      causes: linesToArray(causes),
      recommendedServiceSlugs,
    };
    try {
      if (isEdit && concern) {
        await apiClient.patch(`/concerns/${concern.id}`, payload);
      } else {
        await apiClient.post('/concerns', payload);
      }
      toast({ title: isEdit ? 'Concern updated' : 'Concern created' });
      router.push('/admin/concerns');
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
              <Label htmlFor="concern-name">Name</Label>
              <Input id="concern-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="concern-slug">Slug</Label>
              <Input id="concern-slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="concern-icon">Icon name (lucide-react)</Label>
            <Input id="concern-icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. Sparkles" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Image</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="concern-short">Short description</Label>
            <Textarea id="concern-short" required rows={2} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="concern-overview">Overview</Label>
            <Textarea id="concern-overview" rows={3} value={overview} onChange={(e) => setOverview(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="concern-symptoms">Symptoms (one per line)</Label>
              <Textarea id="concern-symptoms" rows={4} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="concern-causes">Causes (one per line)</Label>
              <Textarea id="concern-causes" rows={4} value={causes} onChange={(e) => setCauses(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Recommended treatments</Label>
            <MultiSelect
              options={services.map((s) => ({ value: s.slug, label: s.name }))}
              value={recommendedServiceSlugs}
              onChange={setRecommendedServiceSlugs}
              placeholder="Select services…"
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/concerns')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create concern'}
        </Button>
      </div>
    </form>
  );
}
