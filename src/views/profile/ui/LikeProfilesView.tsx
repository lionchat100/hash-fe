import { LikeProfileCard, LikeProfilesHeader, useLikeProfilesQuery } from '@/entities/user';
import { FallbackScreen } from '@/widgets/common/FallbackScreen';

export const LikeProfilesView = () => {
  const { data: likeProfiles, isLoading, error } = useLikeProfilesQuery();

  if (isLoading) {
    return <FallbackScreen text="좋아요한 사람 목록을 불러오는 중이에요" />;
  }

  if (error) {
    return <div>문제가 발생했어요</div>;
  }

  if (!likeProfiles || likeProfiles.length === 0) {
    return <div>아직 좋아요한 사람이 없어요</div>;
  }

  return (
    <div>
      <LikeProfilesHeader />

      {likeProfiles.map((profile) => (
        <LikeProfileCard key={profile.userId} profile={profile} />
      ))}
    </div>
  );
};
