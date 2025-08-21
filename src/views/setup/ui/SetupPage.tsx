'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { SERVICE_INFO } from '@/shared/constants';
import { userAuthLogin } from '@/features/update-user';

export const SetupPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAutoLogin = async () => {
      const result = await userAuthLogin();
      if (result.success) {
        router.replace('/explore');
      }
    };
    checkAutoLogin();
  }, []);

  return (
    <div className="flex h-dvh flex-col items-center justify-between bg-stone-900">
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="">로고</div>
        <h1 className="text-4xl font-bold text-white">{SERVICE_INFO.NAME}</h1>
      </div>
      <div className="mb-[120px]">
        <Button className="rounded-[12px] bg-[#FEE500] text-black/80 hover:bg-[#FEE500]">
          <Link href={`${process.env.NEXT_PUBLIC_OAUTH_URL}`}>카카오 로그인</Link>
        </Button>
      </div>
    </div>
  );
};
