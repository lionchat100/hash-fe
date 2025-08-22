'use client';

import { CallbackPage } from '@/views/auth';
import { Suspense } from 'react';
import { FallbackScreen } from '@/widgets/common/FallbackScreen';

export default function Page() {
  return (
    <Suspense fallback={<FallbackScreen text={`로그인 진행중이에요\n조금만 기다려주세요!`} size={140} fullScreen />}>
      <CallbackPage />
    </Suspense>
  );
}
