import Link from 'next/link';
import { Siren, SquarePen } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const FeedHeader = () => {
  return (
    <div className="">
      <div className="flex items-center justify-between bg-white">
        <Link href="/feed/post">
          <Button variant="ghost" size="icon" className="p-7">
            <SquarePen className="size-6" />
          </Button>
        </Link>
        <div className="text-lg font-medium">게시판</div>
        <Button variant="ghost" size="icon" className="p-7">
          <Siren className="size-6" />
        </Button>
      </div>
    </div>
  );
};
