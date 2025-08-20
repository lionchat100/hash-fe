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
  /** 좋아요 버튼 클릭 핸들러 */
  onLikeClick?: (userId: number, currentLikeState: boolean) => Promise<void>;
  /** 채팅 시작 버튼 클릭 핸들러 */
  onChatClick?: (userId: number) => Promise<void>;
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
export const OtherProfileCard = ({ profile, className, onLikeClick, onChatClick }: OtherProfileCardProps) => {
  // 현재 활성화된 이미지 인덱스 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 프로필 사진 개수 확인 (API 응답에서는 imageUrls 필드 사용)
  const photoCount = profile.imageUrls.length;
  const hasMultiplePhotos = photoCount > 1;

  // 프로필 사진 데이터를 ImageSlider 컴포넌트에서 요구하는 형식으로 변환
  // imageUrls(string[]) -> { src: string, alt: string }[] 형태로 변환
  const profileImages = profile.imageUrls.map((imageUrl, index) => ({
    src: imageUrl,
    alt: `${profile.nickname}의 프로필 사진 ${index + 1}`,
  }));

  // ImageSlider 컴포넌트에서 이미지가 변경될 때 호출되는 콜백 핸들러
  // Swiper의 슬라이드 변경을 감지하여 현재 인덱스 상태를 업데이트
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  // 사진이 1장인 경우 단일 이미지 표시, 여러 장인 경우 슬라이더 사용
  const renderImageContent = () => {
    // 이미지가 없는 경우 기본 플레이스홀더 표시
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
      // 사진이 1장인 경우 단일 이미지 표시
      return (
        <Image
          src={profileImages[0].src}
          alt={profileImages[0].alt}
          fill
          className="object-cover"
          style={{ borderRadius: 'inherit' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      );
    }

    // 사진이 여러 장인 경우 슬라이더 사용
    return (
      <ProfileImageSlider
        images={profileImages}
        initialIndex={currentImageIndex}
        onChange={handleImageChange}
        showIndicators={hasMultiplePhotos} // 여러 장일 때만 인디케이터 표시
      />
    );
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl shadow-2xl ${className ?? ''}`}
      style={{ height: 'calc(100dvh - 200px)', minHeight: '500px' }}
    >
      {/* 이미지 컨텐츠 */}
      {renderImageContent()}

      {/* 그라데이션 오버레이 - 시각효과만, 클릭 막지 않으려면 pointer-events-none */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[60%] w-full bg-gradient-to-t from-black/90 via-black/20 to-transparent backdrop-blur-[0.3px]" />

      {/* 오버레이 콘텐츠 래퍼 (정보 80% + 버튼 20%) */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="flex items-end">
          {/* 프로필 정보 영역 80% */}
          <div className="w-[80%]">
            {/* 
              ProfileInfo 컴포넌트 재사용
              - UserProfile 타입은 UserMyProfile과 호환됨
              - 상대방 프로필에서도 동일한 UI 제공
            */}
            <ProfileInfo profile={profile} />
          </div>

          {/* 액션 버튼들 영역 20% */}
          <div className="w-[20%] p-3 pb-12 pl-2">
            <ProfileActionButtons
              userId={profile.userId}
              isLiked={profile.isLikedByMe}
              onLikeClick={onLikeClick}
              onChatClick={onChatClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
