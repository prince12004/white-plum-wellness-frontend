'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Testimonial } from '@white/types';
import {
  Button,
  Card,
  CardContent,
  ImageUpload,
  Input,
  Label,
  Switch,
  Textarea,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
}

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(testimonial);

  const [name, setName] = useState(testimonial?.name ?? '');
  const [photo, setPhoto] = useState(testimonial?.photo ?? '');
  const [rating, setRating] = useState(testimonial?.rating ?? 5);
  const [review, setReview] = useState(testimonial?.review ?? '');
  const [treatment, setTreatment] = useState(testimonial?.treatment ?? '');
  const [city, setCity] = useState(testimonial?.city ?? '');
  const [featured, setFeatured] = useState(testimonial?.featured ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = { name, photo, rating, review, treatment, city, featured };
    try {
      if (isEdit && testimonial) {
        await apiClient.patch(`/testimonials/${testimonial.id}`, payload);
      } else {
        await apiClient.post('/testimonials', payload);
      }
      toast({ title: isEdit ? 'Testimonial updated' : 'Testimonial created' });
      router.push('/admin/testimonials');
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
              <Label htmlFor="t-name">Patient name</Label>
              <Input id="t-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="t-city">City</Label>
              <Input id="t-city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Photo</Label>
            <ImageUpload value={photo} onChange={setPhoto} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="t-treatment">Treatment</Label>
              <Input id="t-treatment" required value={treatment} onChange={(e) => setTreatment(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="t-rating">Rating (1–5)</Label>
              <Input
                id="t-rating"
                type="number"
                min={1}
                max={5}
                required
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="t-review">Review</Label>
            <Textarea id="t-review" required rows={4} value={review} onChange={(e) => setReview(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="t-featured" checked={featured} onCheckedChange={setFeatured} />
            <Label htmlFor="t-featured">Feature on homepage</Label>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/testimonials')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create testimonial'}
        </Button>
      </div>
    </form>
  );
}
