import * as React from 'react';

import { cn } from '@/shared/lib/tailwindMerge';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 rounded-20 flex field-sizing-content min-h-16 w-full bg-stone-100 px-6 py-5 text-base font-semibold transition-[color,box-shadow] outline-none placeholder:text-sm placeholder:font-medium placeholder:text-stone-400 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
