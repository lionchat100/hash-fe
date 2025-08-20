'use client';

import Image from 'next/image';

export interface LoadingSpinnerProps {
  /** 로딩 텍스트 (기본: "로딩 중...") */
  text?: string;
  /** 로딩 스피너 크기 (기본: 60) */
  size?: number;
  /** 화면 전체를 덮을지 여부 (기본: false) */
  fullScreen?: boolean;
  /** 커스텀 className */
  className?: string;
}

/**
 * 토킷 로고를 사용한 공통 로딩 스피너 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <LoadingSpinner />
 *
 * // 커스텀 텍스트와 크기
 * <LoadingSpinner text="새로운 프로필을 찾는 중..." size={120} />
 *
 * // 전체 화면 로딩
 * <LoadingSpinner fullScreen text="데이터를 불러오는 중..." />
 * ```
 */
export const LoadingSpinner = ({
  text = '로딩 중이에요',
  size = 160,
  fullScreen = false,
  className = '',
}: LoadingSpinnerProps) => {
  const containerClass = fullScreen ? 'fixed inset-0 z-50 bg-white bg-opacity-90' : 'w-full';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center">
        {/* 토킷 로고 스피너 */}
        <div className="animate-wiggle mb-4" style={{ width: size, height: size }}>
          <Image
            src="/images/logo/tokit_loading.svg"
            alt="Loading"
            width={size}
            height={size}
            priority
            className="h-full w-full"
          />
        </div>

        {/* 로딩 텍스트 */}
        {text && <div className="animate-pulse text-sm font-medium text-gray-600">{text}</div>}
      </div>
    </div>
  );
};

/**
 * 전체 화면 로딩 스피너 (포털 기반)
 * 페이지 전환이나 중요한 데이터 로딩 시 사용
 */
export const FullScreenLoadingSpinner = ({
  text = '잠시만 기다려주세요',
  size = 160,
}: Omit<LoadingSpinnerProps, 'fullScreen'>) => {
  return <LoadingSpinner text={text} size={size} fullScreen />;
};

/**
 * 인라인 로딩 스피너 (작은 크기)
 * 버튼 내부나 작은 섹션에서 사용
 */
export const InlineLoadingSpinner = ({ text, size = 160 }: Omit<LoadingSpinnerProps, 'fullScreen'>) => {
  return (
    <div className="flex items-center gap-2">
      <div className="animate-wiggle" style={{ width: size, height: size }}>
        <Image
          src="/images/logo/tokit_loading.svg"
          alt="Loading"
          width={size}
          height={size}
          priority
          className="h-full w-full"
        />
      </div>
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
};
