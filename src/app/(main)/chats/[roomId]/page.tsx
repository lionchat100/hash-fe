'use client';

import { ChatRoomPage } from '@/views/chat';
import { Suspense } from 'react';

export default function ChattingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatRoomPage />
    </Suspense>
  );
}
