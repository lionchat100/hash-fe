import * as React from 'react';

import { cn } from '@/shared/lib/tailwindMerge';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input rounded-0 flex h-9 w-full min-w-0 border-b bg-transparent px-3 py-1 text-base text-stone-600 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
