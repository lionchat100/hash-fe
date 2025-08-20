'use client';

import { CallbackPage } from '@/views/auth';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner text="로그인 처리 중..." size={120} fullScreen />}>
      <CallbackPage />
    </Suspense>
  );
}
