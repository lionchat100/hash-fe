'use client';

import { userOAuthLogin } from '@/features/update-user';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');

      if (!code) {
        console.error('OAuth 로그인 실패: code가 없습니다.');
        return router.push('/');
      }

      setIsProcessing(true);
      setError(null);

      try {
        const result = await userOAuthLogin(code);

        if (result.success) {
          router.push('/explore');
        } else {
          throw new Error('OAuth 로그인 실패');
        }
      } catch (error) {
        console.error('OAuth 로그인 실패:', error);
        setError('OAuth 로그인에 실패했습니다.');

        setTimeout(() => {
          router.push('/');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router]);

  if (isProcessing) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">LIONCHAT</h1>
        <div className="mt-4">로그인 처리 중...</div>
        <div className="mt-2 text-gray-500">잠시만 기다려주세요.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">LIONCHAT</h1>
        <div className="mt-4 text-red-500">로그인 실패</div>
        <div className="mt-4 text-sm">잠시 후 로그인 페이지로 이동합니다.</div>
      </div>
    );
  }

  return null;
};
