'use client';

import { clearUserData, getCurrentUser } from '@/entities/user';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { OnboardingPage } from '@/views/auth/ui/OnboardingPage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser.isOnboardingCompleted) {
          router.replace('/explore');
          return;
        }
        setIsLoading(false);
      } catch (error) {
        clearUserData();
        router.replace('/');
      }
    };
    checkOnboarding();
  }, [router]);

  if (isLoading) return <LoadingSpinner fullScreen />;
  return <OnboardingPage />;
}
