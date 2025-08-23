import api from '@/shared/api/axios';

export interface UpdateProfileRequest {
  imageIds?: number[];
  bio?: string;
  focusType?: string;
}

export interface UpdateProfileResponse {
  userId: number;
  message: string;
}

export const updateProfile = async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {

  try {
    const response = await api.patch<UpdateProfileResponse>('/users/update', data);
    return response.data;
  } catch (error) {
    console.error('❌ 프로필 수정 API 에러:', error);
    throw error;
  }
};
