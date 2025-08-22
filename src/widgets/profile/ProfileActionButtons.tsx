'use client';

import { ProfileLikeButton } from '@/features/update-user';
import { StartChatButton } from '@/features/update-chat';

interface ProfileActionButtonsProps {
  userId: number;
  isLiked: boolean;
}

export const ProfileActionButtons = ({ userId, isLiked }: ProfileActionButtonsProps) => {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <ProfileLikeButton userId={userId} isLiked={isLiked} />
      <StartChatButton userId={userId} />
    </div>
  );
};
