'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/shared/lib/tailwindMerge';
import { userToggleProfileLike } from '../model/userLikeProfile';
import { Button } from '@/shared/ui/Button';

interface ProfileLikeButtonProps {
  userId: number;
  isLiked: boolean;
  onLikeChange?: (newLikeStatus: boolean) => void;
  className?: string;
}

export const ProfileLikeButton = ({ userId, isLiked, onLikeChange, className }: ProfileLikeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localLikeStatus, setLocalLikeStatus] = useState(isLiked);

  const handleLikeClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await userToggleProfileLike({
        userId,
        currentLikeStatus: localLikeStatus,
      });
      if (result.success) {
        const newLikeStatus = !localLikeStatus;
        setLocalLikeStatus(newLikeStatus);
        onLikeChange?.(newLikeStatus);
      } else {
        console.error('좋아요 처리 실패:', result.error);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLikeClick}
      disabled={isLoading}
      variant="ghost"
      className={cn(
        'group flex h-12 w-12 items-center justify-center border-0 p-0 hover:bg-transparent',
        isLoading && 'opacity-70',
      )}
      aria-label={localLikeStatus ? '좋아요 취소' : '좋아요'}
    >
      <Heart
        className={cn(
          'size-8 transition-all duration-150 group-hover:size-10',
          localLikeStatus ? 'fill-red-500 text-red-500' : 'fill-none text-white',
          isLoading && 'animate-pulse',
        )}
      />
    </Button>
  );
};
