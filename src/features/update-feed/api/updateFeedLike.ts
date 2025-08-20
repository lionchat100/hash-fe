import api from '@/shared/api/axios';

export const likeFeed = async ({ id }: { id: number }) => {
  try {
    const response = await api.post(`/feeds/${id}/like`);

    if (!response) {
      throw new Error('피드 좋아요 실패?');
    }

    return response;
  } catch (error) {
    console.error('피드 좋아요 중 에러 발생:', error);
    throw error;
  }
};

export const unlikeFeed = async ({ id }: { id: number }) => {
  try {
    const response = await api.delete(`/feeds/${id}/like`);

    if (!response) {
      throw new Error('피드 좋아요 취소 실패?');
    }

    return response;
  } catch (error) {
    console.error('피드 좋아요 취소 중 에러 발생:', error);
    throw error;
  }
};
