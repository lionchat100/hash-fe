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
import { UserMyProfile, UploadImage } from '@/entities/user/model/types'; // [변경] UploadImage 추가
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
  // [변경] 기존 이미지를 (id + url)로 보관
  const [existingImages, setExistingImages] = useState<UploadImage[]>([]);
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

        // [변경] 서버가 응답하는 이미지 리스트에서 id+url을 보관
        // - 백엔드 응답: data.imageUrls: string[] -> UploadImage[] 형태로 변환 필요
        // - 실제 이미지 ID는 별도 API에서 관리되므로, URL 기준으로 임시 ID 부여
        const imageUrls = data.imageUrls || [];
        const images: UploadImage[] = imageUrls.map((url: string, index: number) => ({
          imageId: index + 1, // 임시 ID (실제로는 서버에서 이미지 ID를 함께 제공해야 함)
          imageUrl: url,
        }));

        setExistingImages(images);

        // 기존: 영↔한 매핑 후 코드 저장
        // 변경: UI 상태는 한글로 들고 있다가 저장 시 코드로 변환
        setFocusType(data.focusType ?? ''); // 서버에 한글 필드가 없으면 빈 값
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

      // [변경] 항상 현재 UI 상태 기준으로 최종 imageIds 구성
      // 1) 남아있는 기존 이미지들의 id
      const keptExistingIds = existingImages.map((img) => img.imageId);

      // 2) 새로 업로드한 파일들을 업로드하여 id 확보
      const newIds = uploadedImages.length > 0 ? await uploadImagesList(uploadedImages) : [];

      // 3) 최종 이미지 id 배열 (기존 + 신규), 최대 3장 방어
      const finalImageIds = [...keptExistingIds, ...newIds].slice(0, 3);

      const updateData: UpdateProfileRequest = {
        // [중요] 매번 수정 요청 시 현재 전체 이미지 구성을 전송
        // 기존 이미지(변경하지 않은 사진) + 새로 업로드한 이미지 ID들을 모두 포함
        imageIds: finalImageIds, // 백엔드에서 이 배열로 사용자의 이미지를 완전히 교체
      };

      // bio가 변경된 경우
      if (bio.trim() !== (profileData?.bio || '').trim()) {
        updateData.bio = bio.trim();
      }

      // focusType이 변경된 경우 (한글 그대로 전송)
      if (focusType && focusType !== (profileData?.focusType || '')) {
        updateData.focusType = focusType; // 한글 값 그대로 전송
      }

      // 변경사항이 하나도 없는 경우 (이미지/텍스트 모두 동일)
      const currentImageUrls = profileData?.imageUrls || [];
      const hasImageChanges = 
        finalImageIds.length !== currentImageUrls.length || 
        uploadedImages.length > 0 || 
        existingImages.length !== currentImageUrls.length;

      if (
        (updateData.bio ?? '').trim() === (profileData?.bio || '').trim() &&
        !updateData.focusType &&
        !hasImageChanges
      ) {
        toast.info('변경된 내용이 없습니다.');
        setIsSaving(false);
        return;
      }

      // 서버에 전송할 데이터 콘솔 출력
      console.log('📤 서버에 전송할 프로필 수정 데이터:', JSON.stringify(updateData, null, 2));
      console.log('📊 데이터 상세:', {
        imageIds: updateData.imageIds,
        bio: updateData.bio,
        focusType: updateData.focusType,
        keptExistingIds,
        newIds,
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
      <div className="space-y-6 p-4 pb-24">
        {/* 이미지 업로드 섹션 */}
        <div className="space-y-3">
          <ProfileImageUploader
            value={uploadedImages}
            onChange={setUploadedImages}
            // [변경] 기존 이미지 객체를 그대로 넘김
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
                handleFocusSelect(selectedName); // 그대로 저장(전송 직전에 코드 변환)
              }
            }}
          />
        </div>
      </div>

      {/* 하단 저장 버튼 - ProfileEditButton과 동일한 스타일 */}
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
