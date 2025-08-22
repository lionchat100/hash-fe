import { UserProfile } from '@/entities/user';
import { likeProfile, unlikeProfile } from '../api/updateProfileLike';

export const userLikeProfile = async ({ profile }: { profile: UserProfile }) => {
  try {
    const response = await likeProfile({ profile });
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

export const userUnlikeProfile = async ({ profile }: { profile: UserProfile }) => {
  try {
    const response = await unlikeProfile({ profile });
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
