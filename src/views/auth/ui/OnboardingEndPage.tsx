'use client';
import LoadingPage from '@/app/loading';
import Image from 'next/image';
import { getUserProfile } from '@/entities/user/api/getUserProfile';
import { UserMyProfile, UserProfile } from '@/entities/user/model/types';
import { cn } from '@/shared/lib/tailwindMerge';
import { Button } from '@/shared/ui/Button';
import { ProfileCard } from '@/widgets/profile/ProfileCard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OnboardingEndPage({ delayMs = 3000 }: { delayMs?: number }) {
  const [step, setStep] = useState<'splash' | 'detail' | 'profile'>('splash');
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    getUserProfile().then(setUser).catch(console.error);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setStep('detail'), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  if (!user) return <LoadingPage />;

  return (
    <div
      className={cn(
        'flex h-dvh flex-col items-center justify-center px-4 text-stone-900',
        step === 'splash' && 'font-display-lg',
        step !== 'splash' && 'relative',
        step !== 'profile' && 'text-center',
      )}
    >
      {step === 'splash' && (
        <>
          <Image
            src="/images/logo/tokit_info.svg"
            alt="Loading"
            width={24}
            height={31}
            priority
            className="h-31 w-24"
          />
          <div className="pt-2">{user.nickname}님</div>
          <div>
            <span className="text-primary">커피챗</span> 하실래요?
          </div>
        </>
      )}
      {step === 'detail' && (
        <>
          <div className="text-xl font-semibold">
            <div className="text-primary">커피챗이란?</div>
            <div>부담 없이 서로를 알아가는</div>
            <div>IT업계 문화예요</div>
            <div className="pt-5">Tokit에서 기술 스택부터</div>
            <div>진로 고민, 일상 이야기까지</div>
            <div>지금 대화를 나눠보세요!</div>
          </div>
          <div className="safe-pb absolute bottom-3 w-11/12">
            <Button className="w-full" onClick={() => setStep('profile')}>
              완성된 프로필 확인하기
            </Button>
          </div>
        </>
      )}
      {step === 'profile' && (
        <>
          <div className="safe-pt absolute top-0 left-0 h-(--space-h-header) w-full text-center">
            <div className="flex h-full items-center">
              <Image
                src="/images/logo/tokit_symbol.svg"
                alt="Loading"
                width={92}
                height={20}
                priority
                className="h-5 w-full"
              />
            </div>
          </div>
          <ProfileCard profile={user as UserMyProfile} />
          <div className="safe-pb absolute bottom-3 w-11/12">
            <Button className="w-full" onClick={() => router.push('/explore')}>
              시작하기
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
