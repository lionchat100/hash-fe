import { getUserLogout } from '@/entities/user';
import { deleteCookie } from 'cookies-next';
import { useUserStore } from '@/entities/user';

export const userAuthLogout = async () => {
  const userStore = useUserStore.getState();

  try {
    userStore.setLoading(true);

    // 서버에 로그아웃 요청
    await getUserLogout();

    // 로컬 상태 정리
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
    }

    // 프론트 쿠키도 삭제
    deleteCookie('refresh_token', { path: '/' });

    // 상태 초기화
    userStore.clearUser();

    return { success: true };
  } catch (error) {
    console.error('로그아웃 실패:', error);
    // 에러가 발생해도 로컬 상태는 정리
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
    }
    deleteCookie('refresh_token', { path: '/' });
    userStore.clearUser();

    return { success: false, error };
  } finally {
    userStore.setLoading(false);
  }
};
