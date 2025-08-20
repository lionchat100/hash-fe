import { Badge } from '@/shared/ui/Badge';
import { UserMyProfile } from '@/entities/user/model/types';
import Image from 'next/image';
import { useState } from 'react'; // [추가] 로고 로드 실패 상태 관리

interface ProfileInfoProps {
  profile: UserMyProfile; // ← 로딩 중 null/undefined 대응
}

export const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  // 대학 정보 안전 처리 (API 응답에서는 university가 문자열로 제공)
  const uniName = profile.university ?? ''; // API에서 직접 문자열로 제공

  // [변경] 이니셜 기반 폴백 대신 서비스 기본 로고(SVG)로 폴백
  const FALLBACK_LOGO_SRC = '/images/logo/tokit_univlogo.svg';

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
      '연세대학교(신촌)': 'png',
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

  // [추가] 로고 로드 실패 시 기본 로고로 전환하기 위한 상태
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);

  // 대학 노출 여부 (API 응답에서 isUniversityVisible 필드로 제공)
  const showUniversity = profile.isUniversityVisible && !!uniName;

  // [추가] 실제로 대학교 로고를 보여줄 수 있는지 판단
  const canShowRealLogo = !!universityLogo && !logoLoadFailed;

  return (
    <div className="right-0 bottom-0 left-0 z-30">
      <div className="relative px-6 pb-2 text-white">
        {/* 이름 + 대학 */}
        <div className="mb-3 md:mb-4">
          {/* 대학 정보는 있을 때만 */}
          {showUniversity && (
            <div className="mb-1 flex items-center gap-1">
              {/* 로고 이미지가 있는 경우 → 실 로고 표시, 실패/부재 시 → 기본 로고(SVG) 표시 */}
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                {canShowRealLogo ? (
                  // 로고 이미지가 있는 경우
                  <Image
                    src={universityLogo!.path}
                    alt={`${uniName} 로고`}
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full object-contain"
                    // 이미지 로드 실패 시 기본 로고로 폴백
                    onError={() => setLogoLoadFailed(true)}
                  />
                ) : (
                  // 로고 이미지가 없는 경우 기본 로고(SVG) 표시
                  <Image
                    src={FALLBACK_LOGO_SRC}
                    alt="Tokit 기본 로고"
                    width={20}
                    height={20}
                    className="h-4 w-4 object-contain"
                    priority
                  />
                )}
              </div>

              <span className="text-sm font-medium text-white">{uniName}</span>
            </div>
          )}

          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white">{profile.nickname}</h1>
          </div>

          <p className="mb-3 text-sm leading-relaxed text-white opacity-90 md:mb-4 md:text-base">{profile.bio}</p>
        </div>

        {/* 태그들 */}
        <div className="mb-6 flex flex-wrap gap-2">
          {/* MBTI 태그 - API에서 mbti 필드 제공됨 */}
          {!!profile.mbti && (
            <Badge
              variant="outline"
              className="rounded-full border-none bg-white/20 px-3 py-2 text-xs text-white backdrop-blur-sm hover:bg-white/20"
            >
              {profile.mbti}
            </Badge>
          )}

          {!!profile.position && (
            <Badge
              variant="outline"
              className="rounded-full border-none bg-white/20 px-3 py-2 text-xs text-white backdrop-blur-sm hover:bg-white/20"
            >
              {profile.position}
            </Badge>
          )}

          <Badge
            variant="outline"
            className="rounded-full border-none bg-white/20 px-3 py-2 text-xs text-white backdrop-blur-sm hover:bg-white/20"
          >
            {profile.focusType}
          </Badge>
        </div>
      </div>
    </div>
  );
};
