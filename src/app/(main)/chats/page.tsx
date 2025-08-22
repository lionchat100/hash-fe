'use client';

import { ChatRoomListView } from '@/views/chat';
import { Suspense } from 'react';
import { FallbackScreen } from '@/widgets/common/FallbackScreen';

export default function ChatRoomListPage() {
  return (
    <Suspense fallback={<FallbackScreen text="채팅 목록을 불러오는 중..." size={120} />}>
      <ChatRoomListView />
    </Suspense>
  );
}
