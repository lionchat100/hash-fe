'use client';
import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/shared/lib/tailwindMerge';
import { toast } from 'sonner';
import Image from 'next/image';
import { UploadConfig, validateAndMergeFiles } from '../model/userImageUpload';

type Preview = { file: File; url: string };

interface ImageUploaderProps {
  value: File[]; // RHF로부터 받는 값
  onChange: (files: File[]) => void;
  maxFiles?: number; // default 3
  maxSizeMB?: number; // default 5
  className?: string;
}

export function ImageUploader({ value, onChange, maxFiles = 3, maxSizeMB = 5, className }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
    const next = (value ?? []).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(next);
    return () => next.forEach((p) => URL.revokeObjectURL(p.url));
  }, [value]);

  const handleClickAdd = () => {
    inputRef.current?.click();
  };

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const cfg: UploadConfig = { maxFiles, maxSizeMB };
    const res = validateAndMergeFiles(value, files, cfg);

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
    const next = (value ?? []).filter((_, i) => i !== idx);
    onChange(next);
  };

  const isFull = (value?.length ?? 0) >= maxFiles;

  return (
    <div className={cn('space-y-2', className)}>
      {/* 썸네일 리스트 */}
      <div className="flex flex-wrap gap-3">
        {previews.map((p, i) => (
          <div key={i} className="relative">
            <div className="rounded-20 relative h-[110px] w-[110px] overflow-hidden border">
              {/* 대표 태그: 첫 번째 */}
              {i === 0 && (
                <div className="absolute bottom-0 z-10 w-full bg-stone-900 px-1.5 py-1.5 text-center text-xs font-bold text-stone-100">
                  대표 사진
                </div>
              )}
              <Image src={p.url} alt={`preview-${i}`} className="h-full w-full object-cover" width="110" height="110" />
            </div>
            {/* 삭제 버튼 */}
            <button
              type="button"
              className="absolute -top-2 -right-1 rounded-full bg-stone-900 p-0.5 text-stone-100"
              onClick={() => handleRemove(i)}
              aria-label="삭제"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* 추가(+) 버튼 */}
        {!isFull && (
          <button
            type="button"
            onClick={handleClickAdd}
            className="hover:bg-muted/50 rounded-20 flex h-[110px] w-[110px] items-center justify-center border border-stone-400 text-stone-400"
            aria-label="이미지 추가"
          >
            <Plus className="h-6 w-6" />
          </button>
        )}
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
