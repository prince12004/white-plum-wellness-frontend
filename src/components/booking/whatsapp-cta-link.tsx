'use client';

import { cn } from '@white/ui';
import { buildContextWhatsappLink } from '@/lib/whatsapp';
import type { BookingContext } from './book-appointment-modal';

interface WhatsappCtaLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  context?: BookingContext;
  variant?: 'button' | 'icon' | 'text';
}

export function WhatsappCtaLink({ context, variant = 'button', className, children, onClick, ...props }: WhatsappCtaLinkProps) {
  const href = buildContextWhatsappLink(context ?? {});

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Fire-and-forget: record that someone opened WhatsApp from this CTA so it shows
    // up in admin as a lead signal, even though they haven't typed anything yet or
    // filled a form. Never blocks or delays the actual WhatsApp hand-off below.
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ source: 'WHATSAPP_CLICK', ...context }),
    }).catch(() => {});
    onClick?.(e);
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        variant === 'button' &&
          'relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-whatsapp to-whatsapp-dark px-4 text-sm font-medium text-white shadow-[0_8px_24px_-10px_rgba(37,211,102,0.6)] transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 before:ease-[cubic-bezier(0.22,1,0.36,1)] before:content-[""] hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-105 hover:before:translate-x-full active:scale-[0.97]',
        variant === 'text' && 'text-sm font-medium text-whatsapp-dark hover:underline',
        variant === 'icon' &&
          'relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-whatsapp to-whatsapp-dark text-white shadow-[0_8px_24px_-10px_rgba(37,211,102,0.6)] transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 before:ease-[cubic-bezier(0.22,1,0.36,1)] before:content-[""] hover:-translate-y-0.5 hover:scale-[1.08] hover:brightness-105 hover:before:translate-x-full active:scale-[0.97]',
        className,
      )}
      {...props}
    >
      {children ?? 'WhatsApp Now'}
    </a>
  );
}
