'use client';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import { A11y, Keyboard } from 'swiper/modules';
import 'swiper/css';
import { cn } from '@/shared/lib/tailwindMerge';

type ImageItem = { src: string; alt?: string };

type Props = {
  images: ImageItem[];
  initialIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
  height?: string;
  showIndicators?: boolean;
};

export const ProfileImageSlider = ({ images, initialIndex = 0, onChange, className, showIndicators = true }: Props) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideChange = (sw: SwiperType) => {
    setActiveIndex(sw.realIndex);
    onChange?.(sw.realIndex);
  };

  const handleDotClick = (index: number) => {
    swiperRef.current?.slideToLoop(index);
  };

  return (
    <div className={`relative h-full w-full ${className ?? ''}`}>
      <Swiper
        onSwiper={(sw) => (swiperRef.current = sw)}
        onSlideChange={handleSlideChange}
        modules={[A11y, Keyboard]}
        slidesPerView={1}
        loop
        keyboard={{ enabled: true }}
        observer
        observeParents
        className="!h-full !w-full touch-pan-y"
        style={{ borderRadius: 'inherit' }}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i} className="!h-full !w-full">
            <img
              src={img.src}
              alt={img.alt ?? `photo-${i + 1}`}
              className="h-full w-full object-cover"
              style={{ borderRadius: 'inherit' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {showIndicators && images.length > 1 && (
        <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2">
          <div className="rounded-full px-3 py-1">
            <div className="flex gap-3">
              {images.map((_, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    aria-label={`${index + 1}번째 사진으로 이동`}
                    className={cn(
                      'relative h-2 w-2 cursor-pointer rounded-full transition-all duration-200 ease-in-out',
                      isActive
                        ? 'scale-[1.4] border border-gray-300 bg-white'
                        : 'border border-gray-300/70 bg-gray-300 hover:scale-110 hover:bg-gray-200',
                      "before:absolute before:-inset-1 before:rounded-full before:content-['']",
                      isActive
                        ? 'before:bg-white before:opacity-70 before:blur-[6px]'
                        : 'before:bg-gray-400 before:opacity-45 before:blur-[3px]',
                      'focus:outline-none',
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
