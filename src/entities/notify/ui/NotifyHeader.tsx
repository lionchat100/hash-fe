'use client';
import { Button } from '@/shared/ui/Button';
import { ChevronLeft } from 'lucide-react';

export const NotifyHeader = () => {
  return (
    <header className="safe-pt sticky top-0 z-50 flex h-(--space-h-header) w-full items-center justify-center bg-white">
      <Button variant="ghost" size="icon" className="absolute top-4 left-4" onClick={() => window.history.back()}>
        <ChevronLeft className="size-6" />
      </Button>
      <h1 className="text-xl font-semibold">알림</h1>
    </header>
  );
};
