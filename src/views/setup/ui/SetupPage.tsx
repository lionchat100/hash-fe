'use client';

import { useAuth } from '@/shared/model/auth';
import { Button } from '@/shared/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const SetupPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/explore');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">LIONCHAT</h1>
        <div className="mt-4">자동 로그인 확인 중...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">LIONCHAT</h1>
        <div className="mt-4">로그인 중...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">LIONCHAT</h1>
        <Button>
          <Link href="https://api.lionchat.co.kr/oauth2/authorization/kakao">카카오로 시작하기</Link>
        </Button>
      </div>
    </>
  );
};
