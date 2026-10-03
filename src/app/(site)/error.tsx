'use client';

import { useEffect } from 'react';
import { Button } from '@white/ui';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
      <p className="font-display text-6xl font-semibold text-peach-500">500</p>
      <h1 className="mt-4 text-xl font-semibold text-charcoal-900">Something went wrong</h1>
      <p className="mt-2 text-charcoal-500">Please try again in a moment.</p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
