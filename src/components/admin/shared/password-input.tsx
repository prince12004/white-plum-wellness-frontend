'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, cn } from '@white/ui';

type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

/** A password <Input> with a show/hide toggle — plain password fields give no
 * way to catch a typo before submitting, which matters most for admin login
 * and setting another user's initial password. */
export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pr-10', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-charcoal-400 transition-colors hover:text-charcoal-700"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
