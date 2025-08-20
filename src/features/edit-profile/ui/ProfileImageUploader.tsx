'use client';
import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/shared/lib/tailwindMerge';
import { toast } from 'sonner';
import Image from 'next/image';
import { UploadConfig, validateAndMergeFiles } from '@/features/update-user/model/userImageUpload';

type Preview = {
  file?: File;
  url: string;
  isExisting?: boolean; // 기존 이미지인지 새로 업로드한 이미지인지 구분
};

interface ProfileImageUploaderProps {
  /** 새로 업로드할 파일들 */
  value: File[];
  onChange: (files: File[]) => void;
  /** 기존 이미지 URL 배열 */
  existingImages?: string[];
  /** 기존 이미지 삭제 콜백 */
  onRemoveExistingImage?: (index: number) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

export function ProfileImageUploader({
  value,
  onChange,
  existingImages = [],
  onRemoveExistingImage,
  maxFiles = 3,
  maxSizeMB = 5,
  className,
}: ProfileImageUploaderProps) {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // 기존 URL들 정리
    setPreviews((prev) => {
      prev.forEach((p) => {
        if (!p.isExisting && p.url.startsWith('blob:')) {
          URL.revokeObjectURL(p.url);
        }
      });
      return [];
    });

    const allPreviews: Preview[] = [];

    // 기존 이미지들 추가
    existingImages.forEach((imageUrl) => {
      allPreviews.push({
        url: imageUrl,
        isExisting: true,
      });
    });

    // 새로 업로드한 파일들 추가
    (value ?? []).forEach((file) => {
      allPreviews.push({
        file,
        url: URL.createObjectURL(file),
        isExisting: false,
      });
    });

    setPreviews(allPreviews);

    // cleanup function
    return () => {
      allPreviews.forEach((p) => {
        if (!p.isExisting && p.url.startsWith('blob:')) {
          URL.revokeObjectURL(p.url);
        }
      });
    };
  }, [value, existingImages]);

  const handleClickAdd = () => {
    inputRef.current?.click();
  };

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const cfg: UploadConfig = { maxFiles, maxSizeMB };

    // 현재 총 이미지 수 (기존 + 새로 업로드)
    const currentTotal = existingImages.length + (value?.length ?? 0);
    const remainingSlots = maxFiles - currentTotal;

    if (files.length > remainingSlots) {
      toast.error(`최대 ${maxFiles}장까지만 업로드 가능합니다`);
      resetInput();
      return;
    }

    const res = validateAndMergeFiles(value, files, { ...cfg, maxFiles: remainingSlots });

    if (!res.ok) {
      if (res.error === 'TOO_MANY_FILES') {
        toast.error(`최대 ${maxFiles}장까지만 업로드 가능합니다`);
      } else if (res.error === 'FILE_TOO_LARGE') {
        toast.error(`파일 크기가 ${maxSizeMB}MB 이상으로 업로드 불가합니다`);
      }
      resetInput();
      return;
    }

    onChange(res.next);
    resetInput();
  };

  const handleRemove = (idx: number) => {
    const preview = previews[idx];

    if (preview.isExisting) {
      // 기존 이미지 삭제
      if (onRemoveExistingImage) {
        onRemoveExistingImage(idx);
      } else {
        toast.info('기존 이미지를 삭제할 수 없습니다');
      }
      return;
    }

    // 새로 업로드한 파일 삭제
    const newFileIndex = idx - existingImages.length;
    if (newFileIndex >= 0) {
      const next = (value ?? []).filter((_, i) => i !== newFileIndex);
      onChange(next);
    }
  };

  const totalImages = existingImages.length + (value?.length ?? 0);
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
              <div className="rounded-20 relative aspect-square w-full overflow-hidden border">
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
                    className="hover:bg-muted/50 flex aspect-square w-full items-center justify-center border border-stone-400 text-stone-400"
                    aria-label="이미지 추가"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                )}
              </div>
              {/* 삭제 버튼 - 이미지 컨테이너 밖에 배치 */}
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
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-sm text-stone-400">
        * 사진은 최대 {maxFiles}장 가능, 용량은 1장당 {maxSizeMB}MB 미만 가능합니다
      </p>
    </div>
  );
}
