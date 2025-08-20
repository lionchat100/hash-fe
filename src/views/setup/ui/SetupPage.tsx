'use client';

import { userAutoLogin } from '@/features/update-user';
import { Button } from '@/shared/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SERVICE_INFO } from '@/shared/constants';

export const SetupPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUserAuth = async () => {
      const result = await userAutoLogin();
      if (result.success) {
        console.log('자동 로그인 성공: 유저, 프로필 조회 성공');
        router.push('/explore');
      }
    };
    checkUserAuth();
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
