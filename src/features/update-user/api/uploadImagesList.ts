import api from '@/shared/api/axios';

/** 이미지 업로드 응답 타입 (API 문서에 따른 정확한 타입) */
export interface ImageUploadResponse {
  imageId: number;
  imageUrl: string;
}

/**
 * 이미지 시스템 API를 사용한 이미지 업로드
 * 
 * API 엔드포인트: POST /api/images/upload/list
 * 
 * @param files - 업로드할 파일 배열
 * @returns Promise<ImageUploadResponse[]> - imageId와 imageUrl을 포함한 응답 배열
 */
export const uploadImagesList = async (files: File[]): Promise<ImageUploadResponse[]> => {
  try {
    if (!files?.length) return [];

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file, file.name);
    });

    const response = await api.post<ImageUploadResponse[]>('/images/upload/list', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!response?.data) {
      throw new Error('이미지 업로드 응답이 올바르지 않습니다');
    }

    console.log('✅ 이미지 업로드 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 이미지 업로드 중 에러 발생:', error);
    throw error;
  }
};
