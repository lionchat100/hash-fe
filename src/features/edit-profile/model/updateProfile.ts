import api from '@/shared/api/axios';

export interface UpdateProfileRequest {
  /** 프로필 이미지 ID 배열 (일관성을 위해 항상 배열 형태) */
  imageIds?: number[];
  /** 자기소개 */
  bio?: string;
  /** 선호 타입 (POSITION_FOCUSED, CAREER_FOCUSED, PREFERENCE_FOCUSED) */
  focusType?: string;
}

export interface UpdateProfileResponse {
  userId: number;
  message: string;
}

/**
 * 사용자 프로필 수정 API
 *
 * API 엔드포인트: PATCH /api/users/update
 *
 * @param data - 수정할 프로필 정보
 * @returns Promise<UpdateProfileResponse>
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  console.log('🔄 프로필 수정 API 호출:', data);

  try {
    const response = await api.patch<UpdateProfileResponse>('/users/update', data);
    console.log('✅ 프로필 수정 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 프로필 수정 API 에러:', error);
    throw error;
  }
};
