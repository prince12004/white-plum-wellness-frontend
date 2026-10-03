'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Offer } from '@white/types';
import {
  Button,
  Card,
  CardContent,
  ImageUpload,
  Input,
  Label,
  Textarea,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { arrayToLines, linesToArray } from '@/lib/admin/array-fields';

interface OfferFormProps {
  offer?: Offer | null;
}

export function OfferForm({ offer }: OfferFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(offer);

  const [slug, setSlug] = useState(offer?.slug ?? '');
  const [title, setTitle] = useState(offer?.title ?? '');
  const [image, setImage] = useState(offer?.image ?? '');
  const [description, setDescription] = useState(offer?.description ?? '');
  const [offerType, setOfferType] = useState(offer?.offerType ?? '');
  const [originalPrice, setOriginalPrice] = useState(offer?.originalPrice != null ? String(offer.originalPrice) : '');
  const [offerPrice, setOfferPrice] = useState(offer?.offerPrice != null ? String(offer.offerPrice) : '');
  const [validUntil, setValidUntil] = useState(offer?.validUntil ?? '');
  const [terms, setTerms] = useState(arrayToLines(offer?.terms));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload = {
      slug,
      title,
      image,
      description,
      offerType,
      originalPrice: originalPrice ? Number(originalPrice) : null,
      offerPrice: offerPrice ? Number(offerPrice) : null,
      validUntil,
      terms: linesToArray(terms),
    };
    try {
      if (isEdit && offer) {
        await apiClient.patch(`/offers/${offer.id}`, payload);
      } else {
        await apiClient.post('/offers', payload);
      }
      toast({ title: isEdit ? 'Offer updated' : 'Offer created' });
      router.push('/admin/offers');
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
              <Label htmlFor="offer-title">Title</Label>
              <Input id="offer-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="offer-slug">Slug</Label>
              <Input id="offer-slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Image</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="offer-description">Description</Label>
            <Textarea id="offer-description" required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="offer-type">Offer type</Label>
              <Input id="offer-type" value={offerType} onChange={(e) => setOfferType(e.target.value)} placeholder="e.g. Limited Time" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="offer-original">Original price</Label>
              <Input id="offer-original" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="offer-price">Offer price</Label>
              <Input id="offer-price" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="offer-valid">Valid until</Label>
            <Input id="offer-valid" type="date" required value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="offer-terms">Terms (one per line)</Label>
            <Textarea id="offer-terms" rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/offers')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create offer'}
        </Button>
      </div>
    </form>
  );
}
