import { Button } from '@/shared/ui/Button';
import { ChevronLeft, Siren } from 'lucide-react';
import Link from 'next/link';

export const LikeProfilesHeader = () => {
  return (
    <div className="">
      <div className="flex items-center justify-between bg-white">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="p-[27px]">
            <ChevronLeft className="size-7 stroke-stone-900" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-stone-900">내가 좋아요한 사람</h1>
        <Button variant="ghost" size="icon" className="p-[27px]">
          <Siren className="size-7 stroke-stone-900" />
        </Button>
      </div>
    </div>
  );
};
