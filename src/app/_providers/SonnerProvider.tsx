'use client';

import { ReactNode } from 'react';
import { Toaster } from '@/shared/ui/Sonner';

export const SonnerProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Toaster position="top-center" richColors />
    </>
  );
};
