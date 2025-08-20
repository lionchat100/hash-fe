import { Siren } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const FeedHeader = () => {
  return (
    <>
      <header className="safe-pt relative flex h-(--space-h-header) items-center justify-center bg-white">
        <h1 className="text-xl font-semibold">게시판</h1>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4">
          <Siren className="size-6" />
        </Button>
      </header>
    </>
  );
};
