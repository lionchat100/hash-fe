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

<<<<<<< HEAD
/**
 * 상대방 프로필에서 사용되는 액션 버튼들
 *
 * 기능:
 * - 좋아요 버튼: 좋아요 토글 (채워진/비어있는 하트)
 * - 채팅 시작 버튼: 1:1 채팅방 생성 및 이동
 *
 * UI:
 * - 세로로 배치된 2개의 원형 버튼
 * - 좋아요 상태에 따른 시각적 피드백
 * - 로딩 상태 표시
 *
 * @param userId - 상대방의 사용자 ID
 * @param isLiked - 현재 좋아요 상태
 * @param onLikeClick - 좋아요 버튼 클릭 시 호출되는 함수
 * @param onChatClick - 채팅 시작 버튼 클릭 시 호출되는 함수
 */
export const ProfileActionButtons = ({ userId, isLiked, onLikeClick, onChatClick }: ProfileActionButtonsProps) => {
=======
export const ProfileActionButtons = ({ userId, isLiked, onChatClick }: ProfileActionButtonsProps) => {
>>>>>>> 26cb53952dea273567c14570faf5c5710b98c992
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
