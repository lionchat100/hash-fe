'use client';
import LoadingPage from '@/app/loading';
import { getUserProfile } from '@/entities/user/api/getUserProfile';
import { UserProfile } from '@/entities/user/model/types';
import { cn } from '@/shared/lib/tailwindMerge';
import { Button } from '@/shared/ui/Button';
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

  if (!user) return LoadingPage;

  return (
    <div
      className={cn(
        'font-display-lg flex h-screen flex-col justify-center px-4 text-center align-middle text-stone-900',
        step !== 'splash' && 'relative',
      )}
    >
      {step === 'splash' && (
        <>
          <div>{user.nickname}님</div>
          <div>
            <span className="text-primary">커피챗</span> 하실래요?
          </div>
        </>
      )}
      {step === 'detail' && (
        <>
          <div className="text-xl">
            <div className="text-primary">커피챗이란?</div>
            <div>부담 없이 서로를 알아가는</div>
            <div>IT업계 문화예요</div>
            <div className="pt-5">Tokit에서 기술 스택부터</div>
            <div>진로 고민, 일상 이야기까지</div>
            <div>지금 대화를 나눠보세요!</div>
          </div>
          <Button className="absolute bottom-3 w-11/12" onClick={() => setStep('profile')}>
            완성된 프로필 확인하기
          </Button>
        </>
      )}
      {step === 'profile' && (
        <>
          <div>{user.nickname}님 프로필카드</div>
          <Button className="absolute bottom-3 w-11/12" onClick={() => router.push('/explore')}>
            시작하기
          </Button>
        </>
      )}
    </div>
  );
}
