'use client';

import { useEffect, useState } from 'react';
import type { HeroSlide, HomepageContent, Offer, PaginatedResponse, TreatmentPackage, Service } from '@white/types';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  MultiSelect,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { HeroSlidesEditor } from '@/components/admin/shared/hero-slides-editor';

export default function HomepageCmsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [heroCtaLabel, setHeroCtaLabel] = useState('');
  const [featuredServiceSlugs, setFeaturedServiceSlugs] = useState<string[]>([]);
  const [featuredPackageSlugs, setFeaturedPackageSlugs] = useState<string[]>([]);
  const [featuredOfferSlugs, setFeaturedOfferSlugs] = useState<string[]>([]);

  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<TreatmentPackage[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    Promise.all([
      apiClient.get<HomepageContent>('/homepage-cms'),
      apiClient.get<PaginatedResponse<Service>>('/services?pageSize=200'),
      apiClient.get<PaginatedResponse<TreatmentPackage>>('/packages?pageSize=200'),
      apiClient.get<PaginatedResponse<Offer>>('/offers?pageSize=200'),
    ]).then(([content, svc, pkg, off]) => {
      setHeroSlides(content.heroSlides ?? []);
      setHeroCtaLabel(content.heroCtaLabel ?? '');
      setFeaturedServiceSlugs(content.featuredServiceSlugs ?? []);
      setFeaturedPackageSlugs(content.featuredPackageSlugs ?? []);
      setFeaturedOfferSlugs(content.featuredOfferSlugs ?? []);
      setServices(svc.items);
      setPackages(pkg.items);
      setOffers(off.items);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.patch('/homepage-cms', {
        heroSlides,
        heroCtaLabel,
        featuredServiceSlugs,
        featuredPackageSlugs,
        featuredOfferSlugs,
      });
      toast({ title: 'Homepage content saved — live on the site now' });
    } catch (err) {
      toast({
        title: 'Could not save',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-charcoal-500">Loading…</p>;
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div>
        <h1 className="font-display text-2xl font-semibold text-charcoal-900">Homepage CMS</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Controls the homepage hero carousel and which services, packages and offers get featured — changes go live
          on the website immediately.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero carousel</CardTitle>
          <CardDescription>The rotating banner at the top of the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <HeroSlidesEditor slides={heroSlides} onChange={setHeroSlides} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hero-cta">Primary button label</Label>
            <Input id="hero-cta" value={heroCtaLabel} onChange={(e) => setHeroCtaLabel(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Featured content</CardTitle>
          <CardDescription>Choose what gets highlighted on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Featured services</Label>
            <MultiSelect
              options={services.map((s) => ({ value: s.slug, label: s.name }))}
              value={featuredServiceSlugs}
              onChange={setFeaturedServiceSlugs}
              placeholder="Select services…"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Featured packages</Label>
            <MultiSelect
              options={packages.map((p) => ({ value: p.slug, label: p.name }))}
              value={featuredPackageSlugs}
              onChange={setFeaturedPackageSlugs}
              placeholder="Select packages…"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Featured offers</Label>
            <MultiSelect
              options={offers.map((o) => ({ value: o.slug, label: o.title }))}
              value={featuredOfferSlugs}
              onChange={setFeaturedOfferSlugs}
              placeholder="Select offers…"
            />
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
