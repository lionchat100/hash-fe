'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/Button';
import { Textarea } from '@/shared/ui/Textarea';
import { DrawerSelect } from '@/features/update-user/ui/DrawerSelect';
import { ProfileImageUploader } from './ProfileImageUploader';
import { uploadImagesList } from '@/features/update-user/api/uploadImagesList';
import { updateProfile, UpdateProfileRequest } from '../model/updateProfile';
import { getUserProfile } from '@/entities/user/api/getUserProfile';
import { UserMyProfile } from '@/entities/user/model/types';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

const FOCUS_OPTIONS = [
  // 관심있는 대화 주제 옵션 (서버로도 한글 그대로 전송)
  '직무 관련',
  '취업 준비',
  '일상 이야기',
];

export const EditProfilePage = () => {
  const router = useRouter();

  // 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserMyProfile | null>(null);

  // 폼 상태
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [focusType, setFocusType] = useState(''); // ← preference → focus로 통일 (한글 값 그대로 보관)

  // 초기 데이터 로드
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        setProfileData(data);
        setBio(data.bio || '');
        setExistingImages(data.imageUrls || []);

        // 기존: 영↔한 매핑 후 코드 저장
        // 변경: 서버 응답 값(한글)을 그대로 상태에 저장
        setFocusType(data.focusType || '');
      } catch (error) {
        console.error('프로필 데이터 로드 실패:', error);
        toast.error('프로필 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // 뒤로가기
  const handleBack = () => {
    router.back();
  };

  // 저장하기
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const updateData: UpdateProfileRequest = {};

      // 이미지 변경 체크
      const originalImageUrls = profileData?.imageUrls || [];
      const hasImageChanges =
        uploadedImages.length > 0 ||
        existingImages.length !== originalImageUrls.length ||
        !existingImages.every((img, idx) => img === originalImageUrls[idx]);

      // 이미지가 변경된 경우
      if (hasImageChanges) {
        const allImageIds: number[] = [];

        // 새로 업로드된 이미지 처리
        if (uploadedImages.length > 0) {
          console.log('🖼️ 새 이미지 업로드 중...', uploadedImages.length, '개');
          const uploadResponse: number[] = await uploadImagesList(uploadedImages);

          if (uploadResponse.length > 0) {
            allImageIds.push(...uploadResponse);
            console.log('✅ 새 이미지 업로드 완료. imageIds:', uploadResponse);
          } else {
            throw new Error('이미지 업로드 응답이 비어있습니다');
          }
        }

        // 기존 이미지는 유지 (기존 이미지의 imageId는 알 수 없으므로 새 이미지만 전송)
        // 서버에서 기존 이미지를 모두 교체하는 방식으로 처리
        if (allImageIds.length > 0) {
          // 항상 배열 형태로 전송 (일관성 유지)
          updateData.imageIds = allImageIds;
          console.log('📤 전송할 imageIds (배열):', updateData.imageIds);
        } else {
          // 새로 업로드된 이미지가 없고 기존 이미지가 삭제된 경우
          updateData.imageIds = [];
          console.log('🗑️ 모든 이미지 삭제');
          toast.info('이미지가 모두 삭제되었습니다');
        }
      }

      // bio가 변경된 경우
      if (bio.trim() !== (profileData?.bio || '').trim()) {
        updateData.bio = bio.trim();
      }

      // 선호(=focus) 타입이 변경된 경우 - 기존 focusType과 비교
      // 기존: 코드 매핑 후 전송
      // 변경: 한글 값을 그대로 전송
      if ((focusType || '') !== (profileData?.focusType || '')) {
        updateData.focusType = focusType;
      }

      // 변경사항이 없는 경우
      if (Object.keys(updateData).length === 0 && !hasImageChanges) {
        toast.info('변경된 내용이 없습니다.');
        return;
      }

      // 서버에 전송할 데이터 콘솔 출력
      console.log('📤 서버에 전송할 프로필 수정 데이터:', JSON.stringify(updateData, null, 2));
      console.log('📊 데이터 상세:', {
        imageIds: updateData.imageIds,
        bio: updateData.bio,
        focusType: updateData.focusType,
        hasImageChanges,
        uploadedImagesCount: uploadedImages.length,
        existingImagesCount: existingImages.length,
      });

      await updateProfile(updateData);
      toast.success('프로필이 성공적으로 수정되었습니다.');
      router.back();
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      toast.error('프로필 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 관심있는 대화 주제 선택 (focus)
  const handleFocusSelect = (value: string) => {
    setFocusType(value); // 한글 그대로 저장
  };

  // 기존 이미지 삭제
  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 로딩 중
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
          <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="space-y-6 p-4">
        {/* 이미지 업로드 섹션 */}
        <div className="space-y-3">
          <ProfileImageUploader
            value={uploadedImages}
            onChange={setUploadedImages}
            existingImages={existingImages}
            onRemoveExistingImage={handleRemoveExistingImage}
            maxFiles={3}
            maxSizeMB={5}
          />
        </div>

        {/* 자기소개 섹션 */}
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

        {/* MBTI 섹션 (읽기 전용) */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-400">MBTI</h2>
          <div className="flex cursor-not-allowed items-center justify-between rounded-lg bg-gray-100 p-4 opacity-60">
            <span className="text-gray-400">{profileData?.mbti || 'INFP'}</span>
            <ChevronDown className="h-5 w-5 text-gray-300" />
          </div>
        </div>

        {/* 커리어 영역 섹션 (읽기 전용) */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-400">자신의 커리어 영역</h2>
          <div className="flex cursor-not-allowed items-center justify-between rounded-lg bg-gray-100 p-4 opacity-60">
            <span className="text-gray-400">{profileData?.position || '프론트엔드'}</span>
            <ChevronDown className="h-5 w-5 text-gray-300" />
          </div>
        </div>

        {/* 관심있는 대화 주제 섹션 */}
        <div className="space-y-3">
          <DrawerSelect
            label="관심있는 대화 주제"
            placeholder="선택해주세요"
            value={focusType} // 한글 값 그대로 표시
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
              if (selectedName) {
                handleFocusSelect(selectedName); // 그대로 저장
              }
            }}
          />
        </div>
      </div>

      {/* 하단 저장 버튼 */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-4">
        <div className="mx-auto max-w-md">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-12 w-full rounded-lg bg-gray-800 font-semibold text-white hover:bg-gray-900 disabled:opacity-50"
          >
            {isSaving ? '수정 완료' : '수정 완료'}
          </Button>
        </div>
      </div>
    </div>
  );
};
