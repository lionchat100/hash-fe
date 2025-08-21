import { LucidePencilLine } from 'lucide-react';
import Link from 'next/link';

export const FeedFloatingButton = () => {
  return (
    <div className="safe-pb absolute right-4 bottom-19 z-20">
      <Link href="/feeds/post" className="bg-primary flex h-14 w-14 rounded-full p-4 shadow-(--box-shadow-floating)">
        <LucidePencilLine className="size-6 text-white" />
      </Link>
    </div>
  );
};
