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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const defaultImageUrl = '/images/profiles/white.jpg';

  const hasImages = profile.imageUrls && profile.imageUrls.length > 0;
  const hasMultiplePhotos = hasImages && profile.imageUrls.length > 1;

  const profileImages = hasImages
    ? profile.imageUrls.map((imageUrl, index) => ({
        src: imageUrl,
        alt: `${profile.nickname}의 프로필 사진 ${index + 1}`,
      }))
    : [
        {
          src: defaultImageUrl,
          alt: `${profile.nickname}의 기본 프로필 사진`,
        },
      ];

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const renderImageContent = () => {
    if (!hasMultiplePhotos) {
      return (
        <Image
          src={profileImages[0].src}
          alt={profileImages[0].alt}
          className="h-full w-full object-cover"
          style={{ borderRadius: 'inherit' }}
          sizes="100vw"
          fill
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== defaultImageUrl) {
              target.src = defaultImageUrl;
            }
          }}
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
      style={{ height: 'calc(100svh - 170px)', minHeight: '400px' }}
    >
      {renderImageContent()}

      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[60%] w-full bg-gradient-to-t from-black/90 via-black/20 to-transparent backdrop-blur-[0.3px]" />

      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="flex items-end">
          <div className="w-[90%]">
            <ProfileInfo profile={profile} />
          </div>

          <div className="w-[20%] p-3 pl-2">
            <div className="flex flex-col items-stretch gap-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
