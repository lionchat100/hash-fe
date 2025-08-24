'use client';

import { useState } from 'react';
import { ProfileImageSlider } from './ImageSlider';
import { ProfileInfo } from './ProfileInfo';
import { ProfileActionButtons } from './ProfileActionButtons';
import { UserProfile } from '@/entities/user/model/types';
import Image from 'next/image';

interface OtherProfileCardProps {
  /** 상대방의 프로필 데이터 */
  profile: UserProfile;
  /** 커스텀 CSS 클래스 */
  className?: string;
}

/**
 * 상대방 프로필 페이지 전용 프로필 카드 컴포넌트
 *
 * 기본 구조는 마이프로필카드와 동일하지만, 다음 차이점이 있습니다:
 * - ProfileInfo 오른쪽에 좋아요/채팅 버튼 추가
 * - UserProfile 타입 사용 (UserMyProfile 대신)
 * - 상호작용 기능 강화 (좋아요, 채팅 시작)
 *
 * 레이아웃:
 * - 이미지 슬라이더 (전체 영역)
 * - 그라데이션 오버레이 (하단)
 * - 프로필 정보 (80%) + 액션 버튼들 (20%)
 *
 * @param profile - 상대방의 프로필 데이터
 * @param className - 추가할 CSS 클래스
 * @param onLikeClick - 좋아요 버튼 클릭 시 호출되는 함수
 * @param onChatClick - 채팅 시작 버튼 클릭 시 호출되는 함수
 */
export const OtherProfileCard = ({ profile, className }: OtherProfileCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const photoCount = profile.imageUrls.length;
  const hasMultiplePhotos = photoCount > 1;

  const profileImages = profile.imageUrls.map((imageUrl, index) => ({
    src: imageUrl,
    alt: `${profile.nickname}의 프로필 사진 ${index + 1}`,
  }));

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const renderImageContent = () => {
    if (photoCount === 0) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gray-200">
          <div className="text-center text-gray-500">
            <div className="mb-4 text-6xl">👤</div>
            <p>프로필 이미지가 없습니다</p>
          </div>
        </div>
      );
    }

    if (!hasMultiplePhotos) {
      return (
        <Image
          src={profileImages[0].src}
          alt={profileImages[0].alt}
          className="object-cover"
          style={{ borderRadius: 'inherit' }}
          sizes="100vw"
          fill
        />
      );
    }

    return (
      <ProfileImageSlider
        images={profileImages}
        initialIndex={currentImageIndex}
        onChange={handleImageChange}
        showIndicators={hasMultiplePhotos}
      />
    );
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl shadow-2xl ${className ?? ''}`}
      style={{
        height: className?.includes('!h-') ? undefined : 'min(calc(100svh - 180px), 620px)',
        minHeight: '400px',
      }}
    >
      {renderImageContent()}

      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[60%] w-full bg-gradient-to-t from-black/90 via-black/20 to-transparent backdrop-blur-[0.3px]" />

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="flex items-end">
          <div className="w-[80%]">
            <ProfileInfo profile={profile} />
          </div>

          <div className="w-[20%] p-3 pb-8 pl-2">
            <ProfileActionButtons profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};
