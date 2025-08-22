'use client';

import { ProfileLikeButton } from '@/features/update-user';
import { StartChatButton } from '@/features/update-chat';
import { UserProfile } from '@/entities/user';

export const ProfileActionButtons = ({ profile }: { profile: UserProfile }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <ProfileLikeButton profile={profile} />
      <StartChatButton userId={profile.userId} />
    </div>
  );
};
