'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Textarea } from '@/shared/ui/Textarea';
import { DrawerSelect } from '@/widgets/form';
import { Badge } from '@/shared/ui/Badge';
import { UserMyProfile } from '@/entities/user/model/types';
import { cn } from '@/shared/lib/tailwindMerge';

const FOCUS_OPTIONS = [
  '직무 관련 : 기술 스택, 툴 사용법 등',
  '취업 준비 : 진로 선택, 포트폴리오 작성 등',
  '일상 이야기 : 개인적인 고민, 네트워킹 등',
];

interface ProfileInfoEditorProps {
  bio: string;
  onBioChange: (value: string) => void;
  focusType: string;
  onFocusTypeChange: (value: string) => void;
  profileData: UserMyProfile | null;
  onValidationChange?: (isValid: boolean) => void;
}

const validateBio = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return '';
  if (trimmed.length < 5) return '최소 5자 이상 입력해주세요.';
  if (trimmed.length > 30) return '최대 30자까지 입력할 수 있습니다.';
  return '';
};

export const ProfileInfoEditor = ({
  bio,
  onBioChange,
  focusType,
  onFocusTypeChange,
  profileData,
  onValidationChange,
}: ProfileInfoEditorProps) => {
  const bioError = validateBio(bio);
  const isBioValid = !bioError && bio.trim().length >= 5;
  
  // 검증 상태 변경 시 부모에게 알림
  React.useEffect(() => {
    onValidationChange?.(isBioValid);
  }, [isBioValid, onValidationChange]);
  
  const handleBioChange = (value: string) => {
    // 30자를 초과하지 않도록 제한
    if (value.length <= 30) {
      onBioChange(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* 자기소개 */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">자신을 소개해주세요</h2>
        <Textarea
          value={bio}
          onChange={(e) => handleBioChange(e.target.value)}
          placeholder="해커톤에 참가한 연합동아리 회장입니다 동아리에 관심 있으신분들 채팅주세요~"
          maxLength={30}
          rows={4}
          className={cn(
            "w-full resize-none",
            bioError ? "border-red-500 focus:border-red-500" : ""
          )}
        />
        <div className="flex justify-between text-sm">
          <div className={bioError ? "text-red-500" : "text-gray-500"}>
            {bioError || "최소 5자 ~ 최대 30자"}
          </div>
          <div className={cn(
            "text-gray-500",
            bio.length > 25 ? "text-orange-500" : "",
            bio.length === 30 ? "text-red-500" : ""
          )}>
            {bio.length}/30
          </div>
        </div>
      </div>

      {/* MBTI (읽기 전용) */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-400">MBTI</h2>
        <div className="flex cursor-not-allowed items-center justify-between rounded-lg bg-gray-100 p-4 opacity-60">
          <span className="text-gray-400">{profileData?.mbti || 'INFP'}</span>
          <ChevronDown className="h-5 w-5 text-gray-300" />
        </div>
      </div>

      {/* 커리어 영역 (읽기 전용) */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-400">자신의 커리어 영역</h2>
        <div className="flex cursor-not-allowed items-center justify-between rounded-lg bg-gray-100 p-4 opacity-60">
          <span className="text-gray-400">{profileData?.position}</span>
          <ChevronDown className="h-5 w-5 text-gray-300" />
        </div>
      </div>

      {/* 관심있는 대화 주제 */}
      <div className="space-y-3">
        <DrawerSelect
          label="관심있는 대화 주제"
          placeholder="선택해주세요"
          value={focusType ? FOCUS_OPTIONS.find((option) => option.startsWith(focusType)) || focusType : ''}
          renderOptions={(temp, setTemp) => (
            <>
              {FOCUS_OPTIONS.map((option) => (
                <Badge
                  key={option}
                  className={cn(
                    'cursor-pointer px-6 py-2.5',
                    temp === option ? 'bg-primary font-bold text-stone-100' : '',
                  )}
                  onClick={() => setTemp(option)}
                >
                  {option}
                </Badge>
              ))}
            </>
          )}
          onConfirm={(selectedName) => {
            if (selectedName) {
              // 콜론(:) 앞 부분만 추출하여 전달
              const focusTypeValue = selectedName.split(' : ')[0];
              onFocusTypeChange(focusTypeValue);
            }
          }}
        />
      </div>
    </div>
  );
};
