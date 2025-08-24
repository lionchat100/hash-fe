import { clearUserData, getCurrentUser, getUserProfile, useProfileStore, useUserStore } from '@/entities/user';
import { refreshManager } from '@/shared/api/refreshManager';
import { getCookie } from 'cookies-next/client';

export const userAuthLogin = async () => {
  try {
    // 리프레시 토큰 확인
    const refreshToken = getCookie('refresh_token');
    if (!refreshToken) {
      return { success: false };
    }

    // 액세스 토큰 확인
    let accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!accessToken) {
      await refreshManager.refresh();
      accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!accessToken) {
        return { success: false };
      }
    }

    // 사용자 정보 조회
    try {
      const [currentUser, currentProfile] = await Promise.all([getCurrentUser(), getUserProfile()]);
      useUserStore.getState().setCurrentUser(currentUser);
      useProfileStore.getState().setCurrentProfile(currentProfile);
      return { success: true, user: currentUser, profile: currentProfile };
    } catch (error) {
      console.error('자동 로그인 실패: 사용자 정보 조회 실패', error);
      clearUserData();
      return { success: false, error };
    }
  } catch (error) {
    console.error('자동 로그인 실패: 예상치 못한 오류', error);
    clearUserData();
    return { success: false, error };
  }
};
