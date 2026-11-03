import Link from 'next/link';
import { Button, type ButtonProps } from '@white/ui';
import { BookAppointmentButton } from '@/components/booking/book-appointment-button';
import type { BookingContext } from '@/components/booking/book-appointment-modal';
import { safeHref } from '@/lib/cms/href';

/** A CMS call-to-action: goes to `href` when the admin set one, otherwise opens the booking form. */
export function BookingCta({ href, context, children, ...props }: ButtonProps & { href?: string; context?: BookingContext }) {
  if (!children) return null;
  if (href) {
    return (
      <Link href={safeHref(href)}>
        <Button {...props}>{children}</Button>
      </Link>
    );
  }
  return (
    <BookAppointmentButton context={context} {...props}>
      {children}
    </BookAppointmentButton>
  );
}
