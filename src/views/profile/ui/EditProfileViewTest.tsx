'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/Button';
import { FallbackScreen } from '@/widgets/common/FallbackScreen';
import { ProfileImageUploader } from '@/features/edit-profile/ui/ProfileImageUploaderTest';
import { ProfileInfoEditor } from '@/features/edit-profile/ui/ProfileInfoEditorTest';
import { uploadImagesList } from '@/features/update-user/api/uploadImagesList';
import { updateProfile, UpdateProfileRequest } from '@/features/edit-profile/model/updateProfile';
import { getUserProfile } from '@/entities/user/api/getUserProfile';
import { UserMyProfile } from '@/entities/user/model/types';

export const EditProfileView = () => {
  const router = useRouter();

  // 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserMyProfile | null>(null);

  // 폼 상태 (✅ 이미지: 새로 추가한 파일만)
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [bio, setBio] = useState('');
  const [focusType, setFocusType] = useState(''); // 한글 그대로
  const [isBioValid, setIsBioValid] = useState(false);

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

  // 저장하기 - 항상 실행되지만 조건 체크 후 경고
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // ✅ 요구사항: 편집 페이지에서는 새로운 이미지로만 구성
      if (uploadedImages.length === 0) {
        toast.error('프로필 사진은 최소 1장 이상 등록해야 합니다.');
        setIsSaving(false);
        return;
      }

      // bio 검증
      if (!isBioValid) {
        toast.error('자기소개를 5자 이상 30자 이하로 작성해주세요.');
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

      await updateProfile(updateData);

      toast.success('프로필 수정 완료.');
      router.back();
    } catch (error: any) {
      console.error('프로필 수정 실패:', error);
      toast.error('프로필 수정 실패.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh">
        <FallbackScreen text="프로필 정보를 불러오는 중..." size={120} />
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="size-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">프로필 수정하기 TEST</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 본문 */}
      <div className="space-y-6 p-4 pb-24" style={{ scrollPaddingBottom: 'calc(96px + var(--safe-bottom))' }}>
        {/* 이미지 업로드 - ✅ 기존 이미지는 표시/유지하지 않음 */}
        <div className="space-y-3">
          <ProfileImageUploader value={uploadedImages} onChange={setUploadedImages} maxFiles={3} maxSizeMB={6} />
        </div>

        {/* 프로필 정보 편집 */}
        <ProfileInfoEditor
          bio={bio}
          onBioChange={setBio}
          focusType={focusType}
          onFocusTypeChange={setFocusType}
          profileData={profileData}
          onValidationChange={setIsBioValid}
        />
      </div>

      {/* 저장 버튼 */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-4">
        <div className="safe-pb mx-auto max-w-md">
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
