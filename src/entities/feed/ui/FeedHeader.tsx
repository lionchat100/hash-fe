import Link from 'next/link';
import { LucidePencilLine, Siren } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const FeedHeader = () => {
  return (
    <>
      <div className="flex h-(--space-h-header) items-center justify-center bg-white">
        <Link
          href="/feed/post"
          className="bg-primary fixed right-4 bottom-19 z-20 rounded-full p-4 shadow-(--box-shadow-floating)"
        >
          <LucidePencilLine className="size-6 text-white" />
        </Link>
        <h1 className="text-xl font-semibold">게시판</h1>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4">
          <Siren className="size-6" />
        </Button>
      </div>
    </>
  );
};
