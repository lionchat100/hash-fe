'use client';

import { getUserProfile } from '@/entities/user';
import { useProfileStore } from '@/entities/user/model/slice';
import { userOAuthLogin } from '@/features/update-user';
import { FallbackScreen } from '@/widgets/common/FallbackScreen';
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
        return router.replace('/');
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
                router.replace('/explore');
              } else {
                console.error('프로필 조회 실패: 프로필 없음');
                setError('프로필 조회에 실패했습니다.');
              }
            } catch (error) {
              console.error('프로필 조회 실패: 예상치 못한 오류', error);
              setError('프로필 조회에 실패했습니다.');
            }
          } else {
            router.replace('/onboarding');
          }
        } else {
          console.error('OAuth 로그인 실패: 토큰 발급 실패');
          setError('토큰 발급에 실패했습니다.');
          router.replace('/');
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
    return <FallbackScreen fullScreen size={140} text={`로그인 진행중이에요\n조금만 기다려주세요!`} />;
  }

  if (error) {
    return (
      <FallbackScreen
        type="error"
        fullScreen
        image="hold"
        size={100}
        text="잠시 연결이 불안해요"
        smallText={`불편을 드려 죄송해요\n잠시 후에 다시 접속해주세요`}
        hasButtonLink="/"
        buttonText="다시 시도"
      />
    );
  }

  return null;
};
