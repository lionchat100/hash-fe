import { getOAuthToken, getCurrentUser } from '@/entities/user';
import { useUserStore } from '@/entities/user';

export const userOAuthLogin = async (code: string) => {
  const userStore = useUserStore.getState();
  try {
    userStore.setLoading(true);
    const { accessToken } = await getOAuthToken(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
    const currentUser = await getCurrentUser();
    userStore.setCurrentUser(currentUser);
    userStore.setAuth(true);
    return { success: true, user: currentUser };
  } catch (error) {
    console.error('OAuth 로그인 실패:', error);
    return { success: false, error };
  } finally {
    userStore.setLoading(false);
  }
};
