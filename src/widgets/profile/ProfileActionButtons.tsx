'use client';

import { ProfileLikeButton } from '@/features/update-user';
import { StartChatButton } from '@/features/update-chat';
import { ReportButton } from '@/widgets/common/ReportButton';

interface ProfileActionButtonsProps {
  userId: number;
  isLiked: boolean;
}

export const ProfileActionButtons = ({ userId, isLiked }: ProfileActionButtonsProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <ProfileLikeButton userId={userId} isLiked={isLiked} />
      <StartChatButton userId={userId} />
    </div>
  );
};
