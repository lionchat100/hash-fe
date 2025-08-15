'use client';

import { ChatRoomListPage } from '@/views/chat';
import { Suspense } from 'react';

export default function ChatsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatRoomListPage />
    </Suspense>
  );
}
