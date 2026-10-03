import Link from 'next/link';
import { Button } from '@white/ui';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
      <p className="font-display text-6xl font-semibold text-peach-500">404</p>
      <h1 className="mt-4 text-xl font-semibold text-charcoal-900">Page not found</h1>
      <p className="mt-2 text-charcoal-500">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
