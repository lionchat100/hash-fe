'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/shared/ui/Button';

export const SetupPage = () => {
  return (
    <div className="flex h-dvh flex-col items-center justify-between bg-stone-900">
      <div className="flex flex-grow flex-col items-center justify-center">
        <Image src="/images/logo/tokit_landing.svg" alt="logo" width={140} height={163} className="object-cover" />
      </div>
      <div className="mb-[120px]">
        <Button className="flex w-46 gap-5 rounded-[12px] bg-[#FEE500] p-0 text-stone-900 hover:bg-[#FEE500]">
          <Link
            href={`${process.env.NEXT_PUBLIC_OAUTH_URL}`}
            className="flex h-full w-full items-center justify-center gap-5 px-4 py-3"
          >
            <Image src="/images/icon_kakao.svg" alt="kakao login" width={24} height={24} />
            카카오 로그인
          </Link>
        </Button>
      </div>
    </div>
  );
};
