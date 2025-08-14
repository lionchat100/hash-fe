'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useChatSubscription } from '@/features/update-chat';
import { MessageScrollArea } from '@/widgets/message';
import { MessageInput } from '@/features/update-message';

export const ChatRoomPage = () => {
  const params = useParams();
  const roomId = parseInt(params.roomId as string);

  // 채팅방 구독
  const { isSubscribed, isConnected, subscribeToRoom } = useChatSubscription(roomId);

  // 컴포넌트 마운트 시 채팅방 구독
  useEffect(() => {
    if (roomId && isConnected && !isSubscribed) {
      subscribeToRoom();
    }
  }, [roomId, isConnected, isSubscribed, subscribeToRoom]);

  console.log('현재 구독 상태:', isSubscribed);

  return (
    <div className="flex h-screen flex-col">
      {/* 채팅방 헤더 */}
      <div className="bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">채팅방 {roomId}</h1>
          <div className="flex items-center gap-2">
            {/* 연결 상태 표시 */}
            <div className={`flex items-center gap-1 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`size-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`} />
              {isConnected ? '연결됨' : '연결 끊김'}
            </div>
            {/* 구독 상태 표시 */}
            <div
              className={`rounded-full px-2 py-1 text-xs ${isSubscribed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
            >
              {isSubscribed ? '구독 중' : '구독 대기'}
            </div>
          </div>
        </div>
      </div>

      {/* 메시지 스크롤 영역 */}
      <MessageScrollArea roomId={roomId} />

      {/* 메시지 입력 영역 */}
      <MessageInput roomId={roomId} />
    </div>
  );
};
