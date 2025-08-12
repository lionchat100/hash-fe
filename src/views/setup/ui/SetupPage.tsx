'use client';

import { userAuthCheck } from '@/features/update-user';
import { useUserStore } from '@/entities/user';
import { Button } from '@/shared/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SERVICE_INFO } from '@/shared/constants';

export const SetupPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUserStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      await userAuthCheck();
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/explore');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{SERVICE_INFO.NAME}</h1>
        <div className="mt-4">자동 로그인 확인 중...</div>
        <div className="mt-2 text-gray-500">잠시만 기다려주세요.</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{SERVICE_INFO.NAME}</h1>
        <div className="mt-4">로그인 중...</div>
        <div className="mt-2 text-gray-500">메인 페이지로 이동합니다.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">{SERVICE_INFO.NAME}</h1>
      <div className="mt-8">
        <Button asChild>
          <Link href={`${process.env.NEXT_PUBLIC_OAUTH_URL}`}>카카오 로그인</Link>
        </Button>
      </div>
      <div className="mt-4 text-sm text-gray-500">카카오 계정으로 간편하게 로그인하세요</div>
    </div>
  );
};
