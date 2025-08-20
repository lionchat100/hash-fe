'use client';

import { useState } from 'react';
import { ProfileImageSlider } from './ImageSlider';
import { ProfileInfo } from './ProfileInfo';
import { UserMyProfile } from '@/entities/user/model/types';
import Image from 'next/image';

type Props = {
  profile: UserMyProfile;
  className?: string;
};

export const ProfileCard = ({ profile, className }: Props) => {
  // 현재 활성화된 이미지 인덱스 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 기본 이미지 경로
  const defaultImageUrl = '/images/profiles/white.jpg';

  // 프로필 사진 개수 확인 (API 응답에서는 imageUrls 필드 사용)
  const hasImages = profile.imageUrls && profile.imageUrls.length > 0;
  const photoCount = hasImages ? profile.imageUrls.length : 1; // 기본 이미지 포함
  const hasMultiplePhotos = hasImages && profile.imageUrls.length > 1;

  // 프로필 사진 데이터를 ImageSlider 컴포넌트에서 요구하는 형식으로 변환
  // 이미지가 없으면 기본 이미지 사용
  const profileImages = hasImages 
    ? profile.imageUrls.map((imageUrl, index) => ({
        src: imageUrl,
        alt: `${profile.nickname}의 프로필 사진 ${index + 1}`,
      }))
    : [{
        src: defaultImageUrl,
        alt: `${profile.nickname}의 기본 프로필 사진`,
      }];

  // ImageSlider 컴포넌트에서 이미지가 변경될 때 호출되는 콜백 핸들러
  // Swiper의 슬라이드 변경을 감지하여 현재 인덱스 상태를 업데이트
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  // 사진이 1장인 경우 단일 이미지 표시, 여러 장인 경우 슬라이더 사용
  const renderImageContent = () => {
    if (!hasMultiplePhotos) {
      // 사진이 1장인 경우 (기본 이미지 포함) 단일 이미지 표시
      return (
        <Image
          src={profileImages[0].src}
          alt={profileImages[0].alt}
          className="h-full w-full object-cover"
          style={{ borderRadius: 'inherit' }}
          fill
          onError={(e) => {
            // 이미지 로드 실패 시 기본 이미지로 대체
            const target = e.target as HTMLImageElement;
            if (target.src !== defaultImageUrl) {
              target.src = defaultImageUrl;
            }
          }}
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

      {/* 오버레이 콘텐츠 래퍼 (정보 90% + 버튼 10%) */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="flex items-end">
          {/* 정보 영역 90% */}
          <div className="w-[90%]">
            {/* ProfileInfo는 absolute를 제거한 버전이어야 함 */}
            <ProfileInfo profile={profile} />
          </div>

          {/* 버튼 레일 20% */}
          <div className="w-[20%] p-3 pl-2">
            <div className="flex flex-col items-stretch gap-2">
              {/* 여기에 Like/Chat 등 버튼들 */}
              {/* <LikeButton ... /> */}
              {/* <StartChatButton ... /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
