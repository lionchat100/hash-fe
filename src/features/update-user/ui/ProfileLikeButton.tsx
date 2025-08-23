'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/shared/lib/tailwindMerge';
import { Button } from '@/shared/ui/Button';
import { useUnlikeProfileMutation, useLikeProfileMutation } from '@/features/update-user';
import { UserProfile } from '@/entities/user';

interface ProfileLikeButtonProps {
  profile: UserProfile;
  onLikeChange?: (newLikeStatus: boolean) => void;
  className?: string;
}

export const ProfileLikeButton = ({ profile, onLikeChange }: ProfileLikeButtonProps) => {
  const [localLikeStatus, setLocalLikeStatus] = useState(profile.isLikedByMe);
  const unlikeProfileMutation = useUnlikeProfileMutation();
  const likeProfileMutation = useLikeProfileMutation();

  const isPending = unlikeProfileMutation.isPending || likeProfileMutation.isPending;

  const handleLikeClick = async () => {
    try {
      if (localLikeStatus) {
        await unlikeProfileMutation.mutateAsync({ profile });
      } else {
        await likeProfileMutation.mutateAsync({ profile });
      }
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
      disabled={isPending}
      variant="ghost"
      className={cn(
        'group flex h-12 w-12 items-center justify-center border-0 p-0 hover:bg-transparent',
        isPending && 'opacity-70',
      )}
      aria-label={localLikeStatus ? '좋아요 취소' : '좋아요'}
    >
      <Heart
        className={cn(
          'size-8 transition-all duration-150 group-hover:size-10',
          localLikeStatus ? 'fill-red-500 text-red-500' : 'fill-none text-white',
          isPending && 'animate-pulse',
        )}
      />
    </Button>
  );
};
