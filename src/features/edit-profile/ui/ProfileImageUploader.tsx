'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/shared/lib/tailwindMerge';
import Image from 'next/image';
import { handleUploadFiles, toAcceptAttr, UploadConfig } from '@/features/update-user/model/userImageUpload';
import { ALLOWED_EXT, ALLOWED_MIME } from '@/shared/constants/constant';

type Preview = {
  file: File;
  url: string; // createObjectURL
};

interface ProfileImageUploaderProps {
  /** 새로 업로드할 파일들 (유일한 소스) */
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

export function ProfileImageUploader({
  value,
  onChange,
  maxFiles = 3,
  maxSizeMB = 6,
  className,
}: ProfileImageUploaderProps) {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // 기존 blob URL 정리
    previews.forEach((p) => URL.revokeObjectURL(p.url));

    // 새 프리뷰 생성 (value만 반영)
    const next: Preview[] = (value ?? []).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(next);

    return () => {
      next.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleClickAdd = () => {
    inputRef.current?.click();
  };

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFiles = async (files: FileList | null) => {
    const cfg: UploadConfig = { maxFiles, maxSizeMB, allowedExt: ALLOWED_EXT, allowedMime: ALLOWED_MIME };
    const next = await handleUploadFiles(value, files, cfg);
    if (next) {
      onChange(next);
    }
    resetInput();
  };

  const handleRemove = (idx: number) => {
    const next = (value ?? []).filter((_, i) => i !== idx);
    onChange(next);
  };

  const totalImages = value?.length ?? 0;
  const isFull = totalImages >= maxFiles;

  return (
    <div className={cn('space-y-2', className)}>
      {/* 썸네일 리스트 - 고정 3개 슬롯 */}
      <div className="flex gap-2">
        {Array.from({ length: maxFiles }, (_, slotIndex) => {
          const preview = previews[slotIndex];
          const hasImage = !!preview;

          return (
            <div key={slotIndex} className="relative flex-1">
              <div className="rounded-20 relative aspect-square w-full overflow-hidden border-2">
                {hasImage ? (
                  <>
                    {/* 대표 태그: 첫 번째 이미지 */}
                    {slotIndex === 0 && (
                      <div className="absolute bottom-0 z-10 w-full bg-stone-900 px-1.5 py-1.5 text-center text-xs font-bold text-stone-100">
                        대표 사진
                      </div>
                    )}
                    <Image src={preview.url} alt={`preview-${slotIndex}`} className="h-full w-full object-cover" fill />
                  </>
                ) : (
                  /* 빈 슬롯 - 추가 버튼 */
                  <button
                    type="button"
                    onClick={handleClickAdd}
                    className="hover:bg-muted/50 flex aspect-square w-full items-center justify-center text-stone-400"
                    aria-label="이미지 추가"
                    disabled={isFull}
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                )}
              </div>

              {/* 삭제 버튼 */}
              {hasImage && (
                <button
                  type="button"
                  className="absolute -top-2 -right-2 z-20 rounded-full bg-stone-900 p-1 text-stone-100 shadow-md"
                  onClick={() => handleRemove(slotIndex)}
                  aria-label="삭제"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 숨김 input */}
      <input
        ref={inputRef}
        type="file"
        accept={toAcceptAttr(ALLOWED_EXT, ALLOWED_MIME)}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-sm text-(--color-warning)">
        사진은 처음부터 다시 넣어주세요!
        <br />
        최대{maxFiles}장 가능, 용량은 1장당 {maxSizeMB}MB 미만 가능
      </p>
    </div>
  );
}
