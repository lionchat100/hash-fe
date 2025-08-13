import { UploadImage } from '@/entities/user/model/types';
import api from '@/shared/api/axios';

export const uploadImagesList = async (files: File[]): Promise<number[]> => {
  try {
    if (!files?.length) return [];

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file, file.name);
    });

    const response = await api.post<UploadImage[]>('/images/upload/list', { formData });

    if (!response) {
      throw new Error('이미지 업로드 실패');
    }

    const imageIds = response.data.map((item) => item.imageId);
    return imageIds;
  } catch (error) {
    console.error('이미지 업로드 중 에러 발생:', error);
    throw error;
  }
};
