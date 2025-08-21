'use client';

import { cn } from '@/shared/lib/tailwindMerge';
import { ProfileLikeButton } from '@/features/update-user';
import { useChatStartOnExplore } from '@/features/update-chat';
import { Button } from '@/shared/ui/Button';
import { Send } from 'lucide-react';

interface ProfileActionButtonsProps {
  userId: number;
  isLiked: boolean;
  onChatClick?: (userId: number) => Promise<void>;
}

export const ProfileActionButtons = ({ userId, isLiked, onChatClick }: ProfileActionButtonsProps) => {
  const { startChat, isLoading: isChatLoading } = useChatStartOnExplore();

  const handleChatClick = async () => {
    if (isChatLoading) return;
    try {
      if (onChatClick) {
        await onChatClick(userId);
      } else {
        await startChat(userId);
      }
    } catch (error) {
      console.error('채팅 시작 실패:', error);
      alert('채팅 시작 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <ProfileLikeButton userId={userId} isLiked={isLiked} />

      <Button
        onClick={handleChatClick}
        disabled={isChatLoading}
        variant="ghost"
        className={cn(
          'group flex h-12 w-12 items-center justify-center border-0 p-0 hover:bg-transparent',
          isChatLoading && 'opacity-70',
        )}
        aria-label="채팅 시작"
      >
        <Send
          className={cn(
            'size-8 text-white transition-all duration-150 group-hover:size-10',
            isChatLoading && 'animate-pulse',
          )}
        />
      </Button>
    </div>
  );
};
