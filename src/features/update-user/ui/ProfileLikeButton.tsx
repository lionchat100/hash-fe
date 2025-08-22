'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/shared/lib/tailwindMerge';
import { Button } from '@/shared/ui/Button';
import { useUnlikeProfileMutation, likeProfile } from '@/features/update-user';

interface ProfileLikeButtonProps {
  userId: number;
  isLiked: boolean;
  onLikeChange?: (newLikeStatus: boolean) => void;
  className?: string;
}

export const ProfileLikeButton = ({ userId, isLiked, onLikeChange }: ProfileLikeButtonProps) => {
  const [localLikeStatus, setLocalLikeStatus] = useState(isLiked);

  const unlikeProfileMutation = useUnlikeProfileMutation();

  const handleLikeClick = async () => {
    try {
      if (localLikeStatus) {
        // 좋아요 취소 - useUnlikeProfile 훅 사용
        await unlikeProfileMutation.mutateAsync({ userId });
      } else {
        // 좋아요 추가 - 직접 API 호출
        await likeProfile({ userId });
      }

      // 성공 시 로컬 상태 업데이트
      const newLikeStatus = !localLikeStatus;
      setLocalLikeStatus(newLikeStatus);
      onLikeChange?.(newLikeStatus);
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
    }
  };

  return (
    <Button
      onClick={handleLikeClick}
      disabled={unlikeProfileMutation.isPending}
      variant="ghost"
      className={cn(
        'group flex h-12 w-12 items-center justify-center border-0 p-0 hover:bg-transparent',
        unlikeProfileMutation.isPending && 'opacity-70',
      )}
      aria-label={localLikeStatus ? '좋아요 취소' : '좋아요'}
    >
      <Heart
        className={cn(
          'size-8 transition-all duration-150 group-hover:size-10',
          localLikeStatus ? 'fill-red-500 text-red-500' : 'fill-none text-white',
          unlikeProfileMutation.isPending && 'animate-pulse',
        )}
      />
    </Button>
  );
};
