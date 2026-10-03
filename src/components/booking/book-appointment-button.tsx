'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '@white/ui';
import { BookAppointmentModal, type BookingContext } from './book-appointment-modal';

interface BookAppointmentButtonProps extends ButtonProps {
  context?: BookingContext;
}

export function BookAppointmentButton({ context, children, ...props }: BookAppointmentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button {...props} onClick={() => setOpen(true)}>
        {children ?? 'Book Consultation'}
      </Button>
      <BookAppointmentModal open={open} onOpenChange={setOpen} context={context} />
    </>
  );
}
