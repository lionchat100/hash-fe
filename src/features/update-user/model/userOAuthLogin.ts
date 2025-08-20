import { getOAuthToken, getCurrentUser, clearUserData } from '@/entities/user';
import { useUserStore } from '@/entities/user';

export const userOAuthLogin = async (code: string) => {
  try {
    const { accessToken } = await getOAuthToken(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
    const currentUser = await getCurrentUser();
    useUserStore.getState().setCurrentUser(currentUser);
    return { success: true, user: currentUser };
  } catch (error) {
    console.error('OAuth 로그인 실패: 토큰 발급 실패', error);
    clearUserData();
    return { success: false, error };
  }
};
