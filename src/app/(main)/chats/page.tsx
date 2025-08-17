'use client';

import { ChatRoomListView } from '@/views/chat';
import { Suspense } from 'react';

export default function ChatRoomListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatRoomListView />
    </Suspense>
  );
}
