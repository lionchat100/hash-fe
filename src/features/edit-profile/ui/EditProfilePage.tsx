'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/Button';
import { Textarea } from '@/shared/ui/Textarea';
import { DrawerSelect } from '@/widgets/form';
import { ProfileImageUploader } from './ProfileImageUploader';
import { uploadImagesList } from '@/features/update-user/api/uploadImagesList';
import { updateProfile, UpdateProfileRequest } from '../model/updateProfile';
import { getUserProfile } from '@/entities/user/api/getUserProfile';
import { UserMyProfile } from '@/entities/user/model/types';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

const FOCUS_OPTIONS = ['직무 관련', '취업 준비', '일상 이야기'];

export const EditProfilePage = () => {
  const router = useRouter();

  // 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserMyProfile | null>(null);

  // 폼 상태 (✅ 이미지: 새로 추가한 파일만)
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [bio, setBio] = useState('');
  const [focusType, setFocusType] = useState(''); // 한글 그대로

  // 초기 스냅샷(텍스트 변경 감지용)
  const initialBioRef = useRef<string>('');
  const initialFocusRef = useRef<string>('');

  // 초기 데이터 로드 (✅ 이미지 관련 정보는 무시하고 텍스트/읽기전용만 세팅)
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        setProfileData(data);
        setBio(data.bio || '');
        setFocusType(data.focusType ?? '');
        initialBioRef.current = data.bio || '';
        initialFocusRef.current = data.focusType || '';
      } catch (e) {
        console.error('프로필 데이터 로드 실패:', e);
        toast.error('프로필 데이터를 불러오는 데 실패했어.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // 뒤로가기
  const handleBack = () => router.back();

  // 저장하기 (✅ 새 이미지가 최소 1장 없으면 저장 불가)
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // ✅ 요구사항: 편집 페이지에서는 새로운 이미지로만 구성
      if (uploadedImages.length === 0) {
        toast.error('프로필 사진은 최소 1장 이상 등록해야 합니다.');
        setIsSaving(false);
        return;
      }

      // 새 이미지 업로드 → imageIds 획득
      const newIds = await uploadImagesList(uploadedImages);
      const finalImageIds = newIds.slice(0, 3);

      if (finalImageIds.length === 0) {
        toast.error('프로필 사진은 최소 1장 이상 등록해야 합니다.');
        setIsSaving(false);
        return;
      }

      const updateData: UpdateProfileRequest = {
        imageIds: finalImageIds, // ✅ 항상 새 이미지로 전체 교체
      };

      // 텍스트가 변경된 경우에만 포함
      if (bio.trim() !== initialBioRef.current.trim()) {
        updateData.bio = bio.trim();
      }
      if (focusType && focusType !== initialFocusRef.current) {
        updateData.focusType = focusType;
      }

      console.log('📤 서버 전송 데이터:', JSON.stringify(updateData, null, 2));
      await updateProfile(updateData);

      toast.success('프로필이 수정 완료.');
      router.back();
    } catch (error: any) {
      console.error('프로필 수정 실패:', error);
      console.log('응답 본문:', error?.response?.data);
      toast.error('프로필 수정 실패.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFocusSelect = (value: string) => setFocusType(value);

  if (isLoading) {
    return (
      <div className="min-h-dvh">
        <LoadingSpinner text="프로필 정보를 불러오는 중..." size={120} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">프로필 수정하기</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 본문 */}
      <div className="space-y-6 p-4 pb-24">
        {/* 이미지 업로드 - ✅ 기존 이미지는 표시/유지하지 않음 */}
        <div className="space-y-3">
          <ProfileImageUploader value={uploadedImages} onChange={setUploadedImages} maxFiles={3} maxSizeMB={5} />
        </div>

        {/* 자기소개 */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">자신을 소개해주세요</h2>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="해커톤에 참가한 연합동아리 회장입니다 동아리에 관심 있으신분들 채팅주세요~"
            maxLength={500}
            rows={4}
            className="w-full resize-none"
          />
          <div className="text-right text-sm text-gray-500">최소 5자 ~ 최대 30자</div>
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
            <span className="text-gray-400">{profileData?.position || '프론트엔드'}</span>
            <ChevronDown className="h-5 w-5 text-gray-300" />
          </div>
        </div>

        {/* 관심있는 대화 주제 */}
        <div className="space-y-3">
          <DrawerSelect
            label="관심있는 대화 주제"
            placeholder="선택해주세요"
            value={focusType}
            renderOptions={(temp, setTemp) => (
              <div className="space-y-3">
                {FOCUS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setTemp(option)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      temp === option ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            onConfirm={(selectedName) => {
              if (selectedName) setFocusType(selectedName);
            }}
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-4">
        <div className="mx-auto max-w-md">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-14 w-full cursor-pointer rounded-4xl text-lg font-semibold disabled:opacity-50"
            size="lg"
          >
            {isSaving ? '수정 중...' : '수정 완료'}
          </Button>
        </div>
      </div>
    </div>
  );
};
