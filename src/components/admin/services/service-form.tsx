'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Clinic, Concern, Doctor, PaginatedResponse, Service } from '@white/types';
import {
  Button,
  Card,
  CardContent,
  ImageUpload,
  Input,
  Label,
  MultiSelect,
  Select,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  useToast,
} from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';
import { arrayToLines, linesToArray } from '@/lib/admin/array-fields';
import { SERVICE_CATEGORIES } from '@/lib/admin/service-categories';
import { FaqListEditor, type FaqRow } from '@/components/admin/shared/faq-list-editor';
import { ProcessListEditor, type ProcessRow } from '@/components/admin/shared/process-list-editor';

interface ServiceFormProps {
  service?: Service | null;
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(service);

  // Basic info
  const [slug, setSlug] = useState(service?.slug ?? '');
  const [name, setName] = useState(service?.name ?? '');
  const [categorySlug, setCategorySlug] = useState(service?.categorySlug ?? (SERVICE_CATEGORIES[0]?.slug ?? ''));
  const [shortDescription, setShortDescription] = useState(service?.shortDescription ?? '');
  const [image, setImage] = useState(service?.image ?? '');
  const [startingPrice, setStartingPrice] = useState(service?.startingPrice ?? 0);
  const [featured, setFeatured] = useState(service?.featured ?? false);
  const [popular, setPopular] = useState(service?.popular ?? false);
  const [concernSlugs, setConcernSlugs] = useState<string[]>(service?.concernSlugs ?? []);
  const [doctorSlugs, setDoctorSlugs] = useState<string[]>(service?.doctorSlugs ?? []);
  const [clinicSlugs, setClinicSlugs] = useState<string[]>(service?.clinicSlugs ?? []);

  // Detail
  const detail = service?.detail;
  const [whatIsIt, setWhatIsIt] = useState(detail?.whatIsIt ?? '');
  const [whoIsItFor, setWhoIsItFor] = useState(arrayToLines(detail?.whoIsItFor));
  const [problemsAddressed, setProblemsAddressed] = useState(arrayToLines(detail?.problemsAddressed));
  const [benefits, setBenefits] = useState(arrayToLines(detail?.benefits));
  const [howItWorks, setHowItWorks] = useState(detail?.howItWorks ?? '');
  const [technology, setTechnology] = useState(detail?.technology ?? '');
  const [duration, setDuration] = useState(detail?.duration ?? '');
  const [sessions, setSessions] = useState(detail?.sessions ?? '');
  const [results, setResults] = useState(detail?.results ?? '');
  const [recovery, setRecovery] = useState(detail?.recovery ?? '');
  const [preCare, setPreCare] = useState(arrayToLines(detail?.preCare));
  const [postCare, setPostCare] = useState(arrayToLines(detail?.postCare));

  // Process + FAQs
  const [process, setProcess] = useState<ProcessRow[]>(detail?.process ?? []);
  const [faqs, setFaqs] = useState<FaqRow[]>(detail?.faqs ?? []);

  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<PaginatedResponse<Concern>>('/concerns?pageSize=200').then((res) => setConcerns(res.items));
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
      shortDescription,
      image,
      startingPrice,
      featured,
      popular,
      concernSlugs,
      doctorSlugs,
      clinicSlugs,
      detail: {
        whatIsIt,
        whoIsItFor: linesToArray(whoIsItFor),
        problemsAddressed: linesToArray(problemsAddressed),
        benefits: linesToArray(benefits),
        howItWorks,
        process,
        technology,
        duration,
        sessions,
        results,
        recovery,
        preCare: linesToArray(preCare),
        postCare: linesToArray(postCare),
        faqs,
      },
    };
    try {
      if (isEdit && service) {
        await apiClient.patch(`/services/${service.id}`, payload);
      } else {
        await apiClient.post('/services', payload);
      }
      toast({ title: isEdit ? 'Service updated' : 'Service created' });
      router.push('/admin/services');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="svc-name">Name</Label>
                  <Input id="svc-name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="svc-slug">Slug</Label>
                  <Input id="svc-slug" required value={slug} onChange={(e) => setSlug(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="svc-category">Category</Label>
                <Select id="svc-category" value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
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
                <Label htmlFor="svc-short">Short description</Label>
                <Textarea id="svc-short" required rows={2} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="svc-price">Starting price (₹)</Label>
                <Input id="svc-price" type="number" value={startingPrice} onChange={(e) => setStartingPrice(Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="svc-featured" checked={featured} onCheckedChange={setFeatured} />
                  <Label htmlFor="svc-featured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="svc-popular" checked={popular} onCheckedChange={setPopular} />
                  <Label htmlFor="svc-popular">Popular</Label>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Related concerns</Label>
                <MultiSelect
                  options={concerns.map((c) => ({ value: c.slug, label: c.name }))}
                  value={concernSlugs}
                  onChange={setConcernSlugs}
                  placeholder="Select concerns…"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Doctors</Label>
                <MultiSelect
                  options={doctors.map((d) => ({ value: d.slug, label: d.name }))}
                  value={doctorSlugs}
                  onChange={setDoctorSlugs}
                  placeholder="Select doctors…"
                />
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
            </TabsContent>

            <TabsContent value="details" className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="svc-what">What is it?</Label>
                <Textarea id="svc-what" rows={2} value={whatIsIt} onChange={(e) => setWhatIsIt(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="svc-who">Who is it for? (one per line)</Label>
                  <Textarea id="svc-who" rows={3} value={whoIsItFor} onChange={(e) => setWhoIsItFor(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="svc-problems">Problems addressed (one per line)</Label>
                  <Textarea id="svc-problems" rows={3} value={problemsAddressed} onChange={(e) => setProblemsAddressed(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="svc-benefits">Benefits (one per line)</Label>
                <Textarea id="svc-benefits" rows={3} value={benefits} onChange={(e) => setBenefits(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="svc-how">How it works</Label>
                <Textarea id="svc-how" rows={2} value={howItWorks} onChange={(e) => setHowItWorks(e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="svc-tech">Technology</Label>
                  <Input id="svc-tech" value={technology} onChange={(e) => setTechnology(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="svc-duration">Duration</Label>
                  <Input id="svc-duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="svc-sessions">Sessions</Label>
                  <Input id="svc-sessions" value={sessions} onChange={(e) => setSessions(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="svc-results">Results</Label>
                  <Input id="svc-results" value={results} onChange={(e) => setResults(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="svc-recovery">Recovery</Label>
                  <Input id="svc-recovery" value={recovery} onChange={(e) => setRecovery(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="svc-precare">Pre-care (one per line)</Label>
                  <Textarea id="svc-precare" rows={3} value={preCare} onChange={(e) => setPreCare(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="svc-postcare">Post-care (one per line)</Label>
                  <Textarea id="svc-postcare" rows={3} value={postCare} onChange={(e) => setPostCare(e.target.value)} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="process">
              <ProcessListEditor items={process} onChange={setProcess} />
            </TabsContent>

            <TabsContent value="faqs">
              <FaqListEditor label="Service FAQs" items={faqs} onChange={setFaqs} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/services')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create service'}
        </Button>
      </div>
    </form>
  );
}
