import { Badge } from '@/shared/ui/Badge';
import { UserMyProfile } from '@/entities/user/model/types';

interface ProfileInfoProps {
  profile: UserMyProfile; // ← 로딩 중 null/undefined 대응
}

const getFocusTypeLabel = (focusType?: string) => {
  switch (focusType) {
    case 'career_focused':
      return '직무 관련';
    case 'position_focused':
      return '취업 준비';
    case 'preference_focused':
      return '일상 이야기';
    default:
      return '일상 이야기';
  }
};

export const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  //대학 정보 안전 처리
  const uniName = profile.university?.name ?? ''; // 없으면 빈 문자열
  const uniInitial = uniName ? uniName.slice(0, 1).toUpperCase() : '';

  //대학 노출 여부(백엔드가 isVisible을 주는 설계라면)
  const showUniversity = profile.university?.isVisible && !!uniName;

  return (
    <div className="absolute right-0 bottom-0 left-0 z-30">
      <div className="relative p-6 text-white">
        {/* 이름 + 대학 */}
        <div className="mb-3 md:mb-4">
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white">{profile.name}</h1>

            {/* 대학 정보는 있을 때만 */}
            {showUniversity && (
              <div className="flex items-center gap-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                  <span className="text-xs font-bold text-white">{uniInitial}</span>
                </div>
                <span className="text-sm font-medium text-white">{uniName}</span>
              </div>
            )}
          </div>

          <p className="mb-3 text-sm leading-relaxed text-white opacity-90 md:mb-4 md:text-base">{profile.bio}</p>
        </div>

        {/* 태그들 */}
        <div className="mb-6 flex flex-wrap gap-2">
          {!!profile.mbti && (
            <Badge
              variant="outline"
              className="border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              {profile.mbti}
            </Badge>
          )}

          {!!profile.position && (
            <Badge
              variant="outline"
              className="border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              {profile.position}
            </Badge>
          )}

          <Badge
            variant="outline"
            className="border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
          >
            {getFocusTypeLabel(profile.focusType)}
          </Badge>
        </div>
      </div>
    </div>
  );
};
