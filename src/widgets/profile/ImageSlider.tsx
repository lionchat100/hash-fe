'use client';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import { A11y, Keyboard } from 'swiper/modules'; // Navigation, Pagination 모듈 제거
// Swiper 기본 CSS만 import (navigation, pagination CSS 제거)
import 'swiper/css';
import { cn } from '@/shared/lib/tailwindMerge';

type ImageItem = { src: string; alt?: string };

type Props = {
  images: ImageItem[];
  initialIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
  height?: string; // 커스텀 높이 옵션 추가
  showIndicators?: boolean; // 인디케이터 표시 여부
};

export const ProfileImageSlider = ({ images, initialIndex = 0, onChange, className, showIndicators = true }: Props) => {
  // 현재 활성화된 슬라이드 인덱스 상태 관리
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  // Swiper 인스턴스 참조를 위한 ref
  const swiperRef = useRef<SwiperType | null>(null);

  // 슬라이드 변경 시 호출되는 핸들러
  // Swiper의 realIndex를 사용하여 루프 모드에서도 정확한 인덱스 추적
  const handleSlideChange = (sw: SwiperType) => {
    setActiveIndex(sw.realIndex);
    onChange?.(sw.realIndex); // 부모 컴포넌트에 변경사항 전달
  };

  // 동그라미 인디케이터 클릭 시 해당 슬라이드로 이동하는 핸들러
  const handleDotClick = (index: number) => {
    swiperRef.current?.slideToLoop(index); // 루프 모드에서 정확한 슬라이드 이동
  };

  // 컴포넌트 렌더링
  return (
    <div className={`relative h-full w-full ${className ?? ''}`}>
      {/* Swiper 슬라이더 컨테이너 - 부모 컨테이너의 전체 영역을 차지하도록 설정 */}
      <Swiper
        // Swiper 인스턴스 참조 설정
        onSwiper={(sw) => (swiperRef.current = sw)}
        // 슬라이드 변경 이벤트 핸들러
        onSlideChange={handleSlideChange}
        // 사용할 Swiper 모듈 (Navigation, Pagination 제거)
        modules={[A11y, Keyboard]}
        // 슬라이더 기본 설정
        slidesPerView={1} // 한 번에 보여줄 슬라이드 수
        loop // 무한 루프 활성화
        keyboard={{ enabled: true }} // 키보드 내비게이션 활성화
        // 성능 및 레이아웃 최적화
        observer // DOM 변경사항 감지
        observeParents // 부모 요소 변경사항 감지
        // 터치 제스처 설정 - 카드 전체 영역을 차지하도록 스타일 조정
        className="!h-full !w-full touch-pan-y"
        style={{ borderRadius: 'inherit' }} // 부모의 border-radius 상속
      >
        {/* 이미지 슬라이드 렌더링 */}
        {images.map((img, i) => (
          <SwiperSlide key={i} className="!h-full !w-full">
            {/* 카드 전체 영역을 차지하는 이미지 - height prop 대신 h-full 사용 */}
            <img
              src={img.src}
              alt={img.alt ?? `photo-${i + 1}`}
              className="h-full w-full object-cover"
              style={{ borderRadius: 'inherit' }} // 부모의 border-radius 상속
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* 커스텀 동그라미 인디케이터 - 사진이 여러 장일 때만 표시 */}
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
                      // 공통 스타일
                      'relative h-2 w-2 cursor-pointer rounded-full transition-all duration-200 ease-in-out',
                      // 본체 색상 + 약한 테두리
                      isActive
                        ? 'scale-[1.4] border border-gray-300 bg-white'
                        : 'border border-gray-300/70 bg-gray-300 hover:scale-110 hover:bg-gray-200',
                      // 글로우(블러)는 유지
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
