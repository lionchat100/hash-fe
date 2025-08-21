import { Button } from '@/shared/ui/Button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const LikeProfilesHeader = () => {
  return (
    <header className="safe-pt sticky top-0 z-50 flex h-(--space-h-header) w-full items-center justify-center bg-white">
      <Button variant="ghost" size="icon" className="absolute top-4 left-4" asChild>
        <Link href="/profile">
          <ChevronLeft className="size-7" />
        </Link>
      </Button>
      <h1 className="text-xl font-semibold text-stone-900">내가 좋아요한 사람</h1>
    </header>
  );
};
