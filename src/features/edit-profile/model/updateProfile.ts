import api from '@/shared/api/axios';

export interface UpdateProfileRequest {
  imageId?: number;
  imageIds?: number[];
  bio?: string;
  focusType?: string;
}

export interface UpdateProfileResponse {
  userId: number;
  message: string;
}

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
