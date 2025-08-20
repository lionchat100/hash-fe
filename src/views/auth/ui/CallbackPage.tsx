'use client';

import { getUserProfile } from '@/entities/user';
import { useProfileStore } from '@/entities/user/model/slice';
import { userOAuthLogin } from '@/features/update-user';
import { SERVICE_INFO } from '@/shared/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profileStore = useProfileStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');

      if (!code) {
        console.error('OAuth 로그인 실패: 임시 코드 없음');
        return router.push('/');
      }

      setIsProcessing(true);
      setError(null);

      try {
        const result = await userOAuthLogin(code);
        if (result.success) {
          if (result.user?.isOnboardingCompleted) {
            try {
              const currentProfile = await getUserProfile();
              if (currentProfile) {
                profileStore.setCurrentProfile(currentProfile);
                console.log('OAuth 로그인 성공: 유저, 프로필 조회 성공', currentProfile);
                router.push('/explore');
              } else {
                console.error('프로필 조회 실패: 프로필 없음');
                setError('프로필 조회에 실패했습니다.');
              }
            } catch (error) {
              console.error('프로필 조회 실패: 예상치 못한 오류', error);
              setError('프로필 조회에 실패했습니다.');
            }
          } else {
            console.log('OAuth 로그인 성공: 유저 온보딩 미완료');
            router.push('/onboarding');
          }
        } else {
          console.error('OAuth 로그인 실패: 토큰 발급 실패');
          setError('토큰 발급에 실패했습니다.');
          router.push('/');
        }
      } catch (error) {
        console.error('OAuth 로그인 실패: 예상치 못한 오류', error);
        setError('예상치 못한 오류가 발생했습니다.');
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router]);

  if (isProcessing) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{SERVICE_INFO.NAME}</h1>
        <div className="mt-4">로그인 처리 중...</div>
        <div className="mt-2 text-gray-500">잠시만 기다려주세요.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{SERVICE_INFO.NAME}</h1>
        <div className="mt-4 text-red-500">로그인 실패</div>
        <div className="mt-4 text-sm">잠시 후 로그인 페이지로 이동합니다.</div>
      </div>
    );
  }

  return null;
};
