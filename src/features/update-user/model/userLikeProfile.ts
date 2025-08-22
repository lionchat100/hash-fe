import { likeProfile, unlikeProfile } from '../api/updateProfileLike';

export const userLikeProfile = async ({ userId }: { userId: number }) => {
  try {
    const response = await likeProfile({ userId });
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '좋아요 처리 중 오류가 발생했습니다.',
    };
  }
};

export const userUnlikeProfile = async ({ userId }: { userId: number }) => {
  try {
    const response = await unlikeProfile({ userId });
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '좋아요 취소 처리 중 오류가 발생했습니다.',
    };
  }
};
