'use client';

import { ChatRoomView } from '@/views/chat';
import { useParams } from 'next/navigation';

export default function ChatRoomPage() {
  const { roomId: rib } = useParams<{ roomId: string }>();
  const roomId = Number(rib);

  if (!Number.isFinite(roomId)) {
    return <div>Invalid roomId</div>;
  }

  return <ChatRoomView roomId={roomId} />;
}
