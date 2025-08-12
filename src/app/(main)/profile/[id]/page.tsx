'use client';
import { useParams } from 'next/navigation';
import { Avatar } from '@/shared/ui/Avatar';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Heart, Send, ArrowLeft, MoreVertical } from 'lucide-react';
import Link from 'next/link';

// 임시 사용자 데이터 (나중에 API에서 가져올 예정)
const mockUserData = {
  id: '1',
  name: 'Andrew',
  bio: '우리 팀은 무한상사 같은 분위기를 갖고 있어요',
  mbti: 'INFP',
  focusType: 'career_focused',
  position: '전북대학교',
  university: {
    name: '전북대학교',
    logoUrl: '/university-logo.png',
    isVisible: true,
  },
  photos: ['/profile1.jpg'],
  isLikedByMe: false,
};

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const user = mockUserData;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 상단 네비게이션 바 */}
      <div className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-sm items-center justify-between p-4">
          {/* 좌측 뒤로가기 버튼 */}
          <Link href="/explore">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          {/* 중앙 제목 */}
          <div className="text-lg font-semibold">프로필</div>

          {/* 우측 점3개 메뉴 버튼 */}
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="relative mx-auto max-w-sm">
          {/* 프로필 카드 메인 영역 */}
          <div
            className="relative mx-auto h-[540px] w-[361px] overflow-hidden rounded-3xl bg-cover bg-center shadow-2xl"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%), url('/profile-bg.jpg')`,
            }}
          >
            {/* 사진 슬라이드 동그라미 - 상단 중앙 */}
            <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2">
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-white opacity-60"></div>
                <div className="h-2 w-2 rounded-full bg-white"></div>
                <div className="h-2 w-2 rounded-full bg-white opacity-60"></div>
              </div>
            </div>

            {/* 메인 프로필 정보 */}
            <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
              {/* 이름과 대학교 */}
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{user.name}.</h1>
                  <div className="flex items-center gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600">
                      <span className="text-xs font-bold text-white">전</span>
                    </div>
                    <span className="text-sm font-medium">{user.university.name}</span>
                  </div>
                </div>
                <p className="mb-4 text-base leading-relaxed opacity-90">{user.bio}</p>
              </div>

              {/* 태그들 */}
              <div className="mb-6 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  {user.mbti}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  {user.position}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/50 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  {user.focusType === 'career_focused'
                    ? '커리어 중심'
                    : user.focusType === 'position_focused'
                      ? '포지션 중심'
                      : '취향 중심'}
                </Badge>
              </div>
            </div>

            {/* 우측 액션 버튼들 - 메인 프로필 정보 우측 */}
            <div className="absolute right-6 bottom-6 flex flex-col gap-4">
              {/* 좋아요 버튼 */}
              <button className="transition-colors hover:scale-110">
                <Heart className="h-8 w-8 text-white drop-shadow-lg" />
              </button>

              {/* 채팅 시작 버튼 (화살표) */}
              <button className="transition-colors hover:scale-110">
                <Send className="h-8 w-8 text-white drop-shadow-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
