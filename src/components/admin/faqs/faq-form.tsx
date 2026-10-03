'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Faq } from '@white/types';
import { Button, Card, CardContent, Input, Label, Textarea, useToast } from '@white/ui';
import { apiClient, ApiRequestError } from '@/lib/admin/api-client';

interface FaqFormProps {
  faq?: Faq | null;
}

export function FaqForm({ faq }: FaqFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(faq);

  const [question, setQuestion] = useState(faq?.question ?? '');
  const [answer, setAnswer] = useState(faq?.answer ?? '');
  const [order, setOrder] = useState(faq?.order ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isEdit && faq) {
        await apiClient.patch(`/faqs/${faq.id}`, { question, answer, order });
      } else {
        await apiClient.post('/faqs', { question, answer, order });
      }
      toast({ title: isEdit ? 'FAQ updated' : 'FAQ created' });
      router.push('/admin/faqs');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="faq-question">Question</Label>
            <Input id="faq-question" required value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="faq-answer">Answer</Label>
            <Textarea id="faq-answer" required rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="faq-order">Display order</Label>
            <Input id="faq-order" type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-ivory-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/faqs')}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create FAQ'}
        </Button>
      </div>
    </form>
  );
}
