'use client';

import { Button } from '@/shared/ui/Button';
import { Heart, Send } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/tailwindMerge';
import { useChatStartOnExplore } from '@/features/update-chat';

interface ProfileActionButtonsProps {
  /** 상대방의 사용자 ID */
  userId: number;
  /** 현재 좋아요 상태 */
  isLiked: boolean;
  /** 좋아요 버튼 클릭 핸들러 */
  onLikeClick?: (userId: number, currentLikeState: boolean) => Promise<void>;
  /** 채팅 시작 버튼 클릭 핸들러 */
  onChatClick?: (userId: number) => Promise<void>;
}

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
  const router = useRouter();
  const { startChat, isLoading: isChatLoading } = useChatStartOnExplore();

  // 버튼 로딩 상태 관리
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = async () => {
    if (isLikeLoading) return; // 중복 클릭 방지
    setIsLikeLoading(true);

    try {
      if (onLikeClick) {
        await onLikeClick(userId, isLiked);
      } else {
        // 기본 동작: API 호출 시뮬레이션
        console.log(`${isLiked ? '좋아요 취소' : '좋아요'} 요청: 사용자 ${userId}`);
        // TODO: 실제 좋아요 API 호출
        // await toggleUserLike(userId);
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLikeLoading(false);
    }
  };

  // 채팅 시작 버튼 클릭 핸들러
  const handleChatClick = async () => {
    if (isChatLoading) return; // 중복 클릭 방지

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
      {/* 좋아요 버튼 */}
      <Button
        onClick={handleLikeClick}
        disabled={isLikeLoading}
        variant="ghost"
        className={cn(
          'group flex h-12 w-12 items-center justify-center border-0 p-0 hover:bg-transparent',
          isLikeLoading && 'opacity-70',
        )}
        aria-label={isLiked ? '좋아요 취소' : '좋아요'}
      >
        <Heart
          className={cn(
            'size-8 transition-all duration-150 group-hover:size-10', // group-hover 적용
            isLiked ? 'fill-red-500 text-red-500' : 'fill-none text-white',
            isLikeLoading && 'animate-pulse',
          )}
        />
      </Button>

      {/* 채팅 시작 버튼 */}
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
            'size-8 text-white transition-all duration-150 group-hover:size-10', // group-hover 적용
            isChatLoading && 'animate-pulse',
          )}
        />
      </Button>
    </div>
  );
};
