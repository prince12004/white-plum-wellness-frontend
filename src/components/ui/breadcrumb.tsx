import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Container } from './container';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-ivory-200 bg-ivory-50">
      <Container className="overflow-x-auto py-3">
        <div className="flex w-max items-center gap-1.5 whitespace-nowrap text-sm text-charcoal-500">
          <Link href="/" className="flex items-center gap-1 transition-colors hover:text-peach-600" aria-label="Home">
            <Home className="h-3.5 w-3.5" />
          </Link>
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-charcoal-300" />
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-peach-600">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-charcoal-900">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </Container>
    </nav>
  );
}
