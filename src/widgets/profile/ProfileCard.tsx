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

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl shadow-2xl ${className ?? ''}`}
      style={{ height: 'calc(100dvh - 200px)', minHeight: '500px' }}
    >
      {/* Swiper.js 기반 ImageSlider 컴포넌트 적용 */}
      <ProfileImageSlider
        images={profileImages} // 변환된 이미지 배열 전달
        initialIndex={currentImageIndex} // 초기 슬라이드 인덱스
        onChange={handleImageChange} // 슬라이드 변경 시 콜백
        // height prop 제거 - ImageSlider가 부모 컨테이너 전체 영역을 자동으로 차지
      />
      {/* 그라데이션 오버레이 */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[50%] w-full bg-gradient-to-t from-black/90 via-black/30 to-transparent backdrop-blur-[1px]" />
      {/* 분리된 ProfileInfo 컴포넌트 사용 - 메인 프로필 정보 표시 */}
      <ProfileInfo profile={profile} />
    </div>
  );
};