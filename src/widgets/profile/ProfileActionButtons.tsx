'use client';

import { Button } from '@/shared/ui/Button';
import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
export const ProfileActionButtons = ({
  userId,
  isLiked,
  onLikeClick,
  onChatClick
}: ProfileActionButtonsProps) => {
  const router = useRouter();
  
  // 버튼 로딩 상태 관리
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

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
    
    setIsChatLoading(true);
    
    try {
      if (onChatClick) {
        await onChatClick(userId);
      } else {
        // 기본 동작: 채팅방 생성 및 이동
        console.log(`채팅 시작 요청: 사용자 ${userId}`);
        // TODO: 실제 채팅방 생성 API 호출
        // const chatRoom = await createChatRoom(userId);
        // router.push(`/chat/${chatRoom.id}`);
        
        // 임시: 채팅 페이지로 이동 (실제 구현 시 제거)
        router.push(`/chat/${userId}`);
      }
    } catch (error) {
      console.error('채팅 시작 실패:', error);
      alert('채팅 시작 중 오류가 발생했습니다.');
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 좋아요 버튼 */}
      <Button
        onClick={handleLikeClick}
        disabled={isLikeLoading}
        className={[
          // 기본 스타일
          'flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-200',
          // 좋아요 상태에 따른 스타일 변화
          isLiked
            ? 'border-red-500 bg-red-500 text-white hover:border-red-600 hover:bg-red-600'
            : 'border-gray-300 bg-white text-gray-600 hover:border-red-500 hover:text-red-500',
          // 로딩 상태 스타일
          isLikeLoading && 'opacity-70',
        ].join(' ')}
        aria-label={isLiked ? '좋아요 취소' : '좋아요'}
      >
        <Heart 
          className={[
            'h-6 w-6 transition-transform duration-200',
            isLiked ? 'fill-current scale-110' : '',
            isLikeLoading && 'animate-pulse'
          ].join(' ')} 
        />
      </Button>

      {/* 채팅 시작 버튼 */}
      <Button
        onClick={handleChatClick}
        disabled={isChatLoading}
        className={[
          // 기본 스타일
          'flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-200',
          'border-blue-500 bg-blue-500 text-white hover:border-blue-600 hover:bg-blue-600',
          // 로딩 상태 스타일
          isChatLoading && 'opacity-70',
        ].join(' ')}
        aria-label="채팅 시작"
      >
        <MessageCircle 
          className={[
            'h-6 w-6 transition-transform duration-200',
            isChatLoading && 'animate-pulse'
          ].join(' ')} 
        />
      </Button>
    </div>
  );
};