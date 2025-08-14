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

  // 대학교 이름과 로고 파일명 매핑
  const getUniversityLogo = (universityName: string): { path: string; extension: string } | null => {
    if (!universityName) return null;

    // 대학교별 파일 확장자 매핑 (실제 파일을 확인한 결과)
    const universityLogoMap: Record<string, string> = {
      가톨릭대학교: 'png',
      강남대학교: 'png',
      경북대학교: 'png',
      계명대학교: 'png',
      고려대학교: 'jpg',
      '고려대학교(세종)': 'jpg',
      광운대학교: 'png',
      국민대학교: 'png',
      금오공과대학교: 'png',
      남서울대학교: 'png',
      덕성여자대학교: 'png',
      동국대학교: 'jpeg',
      동덕여자대학교: 'png',
      '명지대학교(인문)': 'png',
      백석대학교: 'png',
      부산대학교: 'png',
      삼육대학교: 'png',
      '상명대학교(서울)': 'png',
      '상명대학교(천안)': 'png',
      서강대학교: 'png',
      서경대학교: 'png',
      서울과학기술대학교: 'png',
      서울대학교: 'png',
      서울여자대학교: 'jpeg',
      성결대학교: 'png',
      성공회대학교: 'png',
      성균관대학교: 'png',
      성신여자대학교: 'png',
      숙명여자대학교: 'png',
      순천대학교: 'png',
      순천향대학교: 'png',
      숭실대학교: 'png',
      연세대학교: 'png',
      영남대학교: 'png',
      영남이공대학교: 'jpg',
      을지대학교: 'png',
      이화여자대학교: 'png',
      인천대학교: 'jpeg',
      인하대학교: 'png',
      중부대학교: 'png',
      중앙대학교: 'png',
      청주대학교: 'png',
      충남대학교: 'png',
      한국교통대학교: 'PNG',
      '한국외국어대학교(글로벌)': 'png',
      '한국외국어대학교(서울)': 'png',
      한국항공대학교: 'png',
      한남대학교: 'png',
      한동대학교: 'png',
      한밭대학교: 'png',
      한서대학교: 'jpg',
      한성대학교: 'png',
      '한양대학교(ERICA)': 'png',
      홍익대학교: 'png',
    };

    const extension = universityLogoMap[universityName];
    if (!extension) return null;

    // 실제 파일에서 사용되는 이름 (로고 텍스트 제거됨)
    const fileName = `${universityName}.${extension}`;

    return {
      path: `https://tokit-bucket.s3.ap-northeast-2.amazonaws.com/universityLogo/${fileName}`,
      extension,
    };
  };

  const universityLogo = getUniversityLogo(uniName);

  //대학 노출 여부(백엔드가 isVisible을 주는 설계라면)
  const showUniversity = profile.university?.isVisible && !!uniName;

  return (
    <div className="right-0 bottom-0 left-0 z-30">
      <div className="relative p-6 text-white">
        {/* 이름 + 대학 */}
        <div className="mb-3 md:mb-4">
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white">{profile.name}</h1>

            {/* 대학 정보는 있을 때만 */}
            {showUniversity && (
              <div className="flex items-center gap-1">
                {universityLogo ? (
                  // 로고 이미지가 있는 경우
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                    <img
                      src={universityLogo.path}
                      alt={`${uniName} 로고`}
                      className="h-5 w-5 rounded-full object-contain"
                      onError={(e) => {
                        // 이미지 로드 실패 시 이니셜로 fallback
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-xs font-bold text-white">${uniInitial}</span>`;
                          parent.className = 'flex h-6 w-6 items-center justify-center rounded-full bg-blue-600';
                        }
                      }}
                    />
                  </div>
                ) : (
                  // 로고 이미지가 없는 경우 기존 이니셜 표시
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                    <span className="text-xs font-bold text-white">{uniInitial}</span>
                  </div>
                )}
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
