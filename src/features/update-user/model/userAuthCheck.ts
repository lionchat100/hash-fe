import { getCurrentUser } from '@/entities/user';
import { getCookie } from 'cookies-next';
import { useUserStore } from '@/entities/user';

export const userAuthCheck = async () => {
  const userStore = useUserStore.getState();

  try {
    userStore.setLoading(true);

    const refreshToken = getCookie('refresh_token');
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!refreshToken) {
      userStore.clearUser();
      return { success: false, isAuthenticated: false };
    }

    if (!accessToken) {
      const { newAccessToken } = await import('./newAccessToken');
      return await newAccessToken();
    }

    // 사용자 정보 조회
    try {
      const currentUser = await getCurrentUser();
      userStore.setCurrentUser(currentUser);
      userStore.setAuth(true);

      return { success: true, isAuthenticated: true, user: currentUser };
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);

      // 토큰 갱신 시도
      const { newAccessToken } = await import('./newAccessToken');
      return await newAccessToken();
    }
  } catch (error) {
    console.error('인증 확인 중 오류:', error);
    userStore.clearUser();
    return { success: false, isAuthenticated: false, error };
  } finally {
    userStore.setLoading(false);
  }
};
