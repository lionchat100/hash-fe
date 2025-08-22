'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { userAuthLogin } from '@/features/update-user';
import Image from 'next/image';

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
        <Image src="/images/logo/tokit_landing.svg" alt="logo" width={140} height={163} className="object-cover" />
      </div>
      <div className="mb-[120px]">
        <Button className="flex w-46 gap-5 rounded-[12px] bg-[#FEE500] text-[#2F2E2D] hover:bg-[#FEE500]">
          <Image src="/images/icon_kakao.svg" alt="kakao login" width={24} height={24} />
          <Link href={`${process.env.NEXT_PUBLIC_OAUTH_URL}`}>카카오 로그인</Link>
        </Button>
      </div>
    </div>
  );
};
