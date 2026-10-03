'use client';

import { useEffect, useState } from 'react';
import type { Settings } from '@white/types';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ImageUpload,
  Input,
  Label,
  Textarea,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

export default function SeoPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [defaultTitle, setDefaultTitle] = useState('');
  const [defaultDescription, setDefaultDescription] = useState('');
  const [defaultOgImageUrl, setDefaultOgImageUrl] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [googleTagManagerId, setGoogleTagManagerId] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');
  const [googleAdsConversionId, setGoogleAdsConversionId] = useState('');

  useEffect(() => {
    apiClient.get<Settings>('/settings').then((res) => {
      setSettings(res);
      setDefaultTitle(res.seoDefaults?.defaultTitle ?? '');
      setDefaultDescription(res.seoDefaults?.defaultDescription ?? '');
      setDefaultOgImageUrl(res.seoDefaults?.defaultOgImageUrl ?? '');
      setGoogleAnalyticsId(res.marketingPixels?.googleAnalyticsId ?? '');
      setGoogleTagManagerId(res.marketingPixels?.googleTagManagerId ?? '');
      setMetaPixelId(res.marketingPixels?.metaPixelId ?? '');
      setGoogleAdsConversionId(res.marketingPixels?.googleAdsConversionId ?? '');
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updated = await apiClient.patch<Settings>('/settings', {
        seoDefaults: { defaultTitle, defaultDescription, defaultOgImageUrl },
        marketingPixels: { googleAnalyticsId, googleTagManagerId, metaPixelId, googleAdsConversionId },
      });
      setSettings(updated);
      toast({ title: 'SEO settings saved' });
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
        <h1 className="font-display text-2xl font-semibold text-charcoal-900">SEO</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Site-wide search and social sharing defaults, plus analytics/pixel IDs used across every page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Default meta tags</CardTitle>
          <CardDescription>
            Used as a fallback on any page that doesn&apos;t define its own title/description.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seo-title">Default title</Label>
            <Input
              id="seo-title"
              value={defaultTitle}
              onChange={(e) => setDefaultTitle(e.target.value)}
              placeholder="White Plum Wellness — Advanced Skin & Hair Care"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seo-description">Default meta description</Label>
            <Textarea
              id="seo-description"
              rows={3}
              value={defaultDescription}
              onChange={(e) => setDefaultDescription(e.target.value)}
              placeholder="A short, compelling summary shown in search results and social previews."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Default social share image (OG image)</Label>
            <ImageUpload value={defaultOgImageUrl} onChange={setDefaultOgImageUrl} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics & tracking</CardTitle>
          <CardDescription>Connect the pixels that power your marketing reporting.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seo-ga">Google Analytics ID</Label>
            <Input id="seo-ga" value={googleAnalyticsId} onChange={(e) => setGoogleAnalyticsId(e.target.value)} placeholder="G-XXXXXXXXXX" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seo-gtm">Google Tag Manager ID</Label>
            <Input id="seo-gtm" value={googleTagManagerId} onChange={(e) => setGoogleTagManagerId(e.target.value)} placeholder="GTM-XXXXXXX" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seo-meta">Meta (Facebook) Pixel ID</Label>
            <Input id="seo-meta" value={metaPixelId} onChange={(e) => setMetaPixelId(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seo-ads">Google Ads Conversion ID</Label>
            <Input id="seo-ads" value={googleAdsConversionId} onChange={(e) => setGoogleAdsConversionId(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
