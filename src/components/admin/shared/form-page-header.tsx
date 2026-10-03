import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface FormPageHeaderProps {
  title: string;
  description?: string;
  backHref: string;
}

export function FormPageHeader({ title, description, backHref }: FormPageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <Link
        href={backHref}
        className="flex items-center gap-1 text-sm font-medium text-charcoal-500 hover:text-peach-600"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>
      <h1 className="mt-1 font-display text-2xl font-semibold text-charcoal-900">{title}</h1>
      {description && <p className="text-sm text-charcoal-500">{description}</p>}
    </div>
  );
}
