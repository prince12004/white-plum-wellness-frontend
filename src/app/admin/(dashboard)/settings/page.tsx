'use client';

import { useEffect, useState } from 'react';
import type { Settings } from '@white/types';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, useToast } from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [gaId, setGaId] = useState('');
  const [gtmId, setGtmId] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');

  useEffect(() => {
    apiClient
      .get<Settings>('/settings')
      .then((data) => {
        setSettings(data);
        setBusinessName(data.businessName);
        setContactEmail(data.contactEmail ?? '');
        setContactPhone(data.contactPhone ?? '');
        setWhatsappNumber(data.whatsappNumbers.find((w) => w.clinicId === null)?.number ?? '');
        setGaId(data.marketingPixels.googleAnalyticsId ?? '');
        setGtmId(data.marketingPixels.googleTagManagerId ?? '');
        setMetaPixelId(data.marketingPixels.metaPixelId ?? '');
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const otherNumbers = (settings?.whatsappNumbers ?? []).filter((w) => w.clinicId !== null);
      const updated = await apiClient.patch<Settings>('/settings', {
        businessName,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        whatsappNumbers: [
          { clinicId: null, number: whatsappNumber, label: 'Site-wide default' },
          ...otherNumbers,
        ],
        marketingPixels: {
          googleAnalyticsId: gaId || undefined,
          googleTagManagerId: gtmId || undefined,
          metaPixelId: metaPixelId || undefined,
        },
      });
      setSettings(updated);
      toast({ title: 'Settings saved' });
    } catch (err) {
      toast({
        title: 'Could not save settings',
        description: err instanceof ApiRequestError ? err.message : undefined,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-charcoal-500">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-charcoal-900">Settings</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Business info here drives the public homepage directly — no redeploy needed.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="businessName">Business name</Label>
              <Input id="businessName" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contactPhone">Contact phone</Label>
              <Input id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="whatsappNumber">Default WhatsApp number</Label>
              <Input
                id="whatsappNumber"
                placeholder="91XXXXXXXXXX"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marketing pixels</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gaId">Google Analytics 4 ID</Label>
              <Input id="gaId" placeholder="G-XXXXXXX" value={gaId} onChange={(e) => setGaId(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gtmId">Google Tag Manager ID</Label>
              <Input id="gtmId" placeholder="GTM-XXXXXXX" value={gtmId} onChange={(e) => setGtmId(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="metaPixelId">Meta Pixel ID</Label>
              <Input id="metaPixelId" value={metaPixelId} onChange={(e) => setMetaPixelId(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
