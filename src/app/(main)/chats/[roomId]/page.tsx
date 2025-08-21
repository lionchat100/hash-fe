'use client';

import { chatContextLoad } from '@/features/update-chat';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { ChatRoomView } from '@/views/chat';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ChatRoomPage() {
  const { roomId: rib } = useParams<{ roomId: string }>();
  const [opponentNickname, setOpponentNickname] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();
  const roomId = Number(rib);

  const handleChatContextLoad = useCallback(
    async (roomId: number) => {
      try {
        setIsLoading(true);
        const result = await chatContextLoad(roomId);
        if (result.isValid) {
          setOpponentNickname(result.opponentNickname);
          setIsValid(true);
        } else {
          toast.error('채팅방 접근 권한이 없어요.');
          router.replace('/chats');
        }
      } catch (error) {
        toast.error('채팅방 정보를 불러오는데 실패했어요.');
        router.replace('/chats');
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    if (Number.isFinite(roomId)) {
      handleChatContextLoad(roomId);
    }
  }, [roomId, handleChatContextLoad]);

  // 유효하지 않은 roomId 처리
  if (!Number.isFinite(roomId)) {
    return <div>Invalid roomId</div>;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen text="채팅방 정보를 불러오는 중이에요" />;
  }

  if (!isValid) {
    return null;
  }

  return <ChatRoomView roomId={roomId} opponentNickname={opponentNickname} />;
}
