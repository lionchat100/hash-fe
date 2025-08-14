'use client';

import { useState } from 'react';
import { ProfileImageSlider } from './ImageSlider';
import { ProfileInfo } from './ProfileInfo';
import { UserMyProfile } from '@/entities/user/model/types';

type Props = {
  profile: UserMyProfile;
  className?: string;
};

export const ProfileCard = ({ profile, className }: Props) => {
  // 현재 활성화된 이미지 인덱스 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 프로필 사진 개수 확인
  const photoCount = profile.photos.length;
  const hasMultiplePhotos = photoCount > 1;

  // 프로필 사진 데이터를 ImageSlider 컴포넌트에서 요구하는 형식으로 변환
  // string[] -> { src: string, alt: string }[] 형태로 변환
  const profileImages = profile.photos.map((photo, index) => ({
    src: photo,
    alt: `${profile.name}의 프로필 사진 ${index + 1}`,
  }));

  // ImageSlider 컴포넌트에서 이미지가 변경될 때 호출되는 콜백 핸들러
  // Swiper의 슬라이드 변경을 감지하여 현재 인덱스 상태를 업데이트
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  // 사진이 1장인 경우 단일 이미지 표시, 여러 장인 경우 슬라이더 사용
  const renderImageContent = () => {
    if (!hasMultiplePhotos) {
      // 사진이 1장인 경우 단일 이미지 표시
      return (
        <img
          src={profileImages[0].src}
          alt={profileImages[0].alt}
          className="h-full w-full object-cover"
          style={{ borderRadius: 'inherit' }}
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
      {/* 이미지 컨텐츠 렌더링 */}
      {renderImageContent()}

      {/* 그라데이션 오버레이 */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[60%] w-full bg-gradient-to-t from-black/90 via-black/20 to-transparent backdrop-blur-[0.3px]" />

      {/* 분리된 ProfileInfo 컴포넌트 사용 - 메인 프로필 정보 표시 */}
      <ProfileInfo profile={profile} />
    </div>
  );
};
