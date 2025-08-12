import { getAccessToken, getCurrentUser } from '@/entities/user';
import { useUserStore } from '@/entities/user';

export const newAccessToken = async () => {
  const userStore = useUserStore.getState();

  try {
    userStore.setLoading(true);

    const { accessToken } = await getAccessToken();

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }

    const currentUser = await getCurrentUser();

    userStore.setCurrentUser(currentUser);
    userStore.setAuth(true);

    return { success: true, user: currentUser };
  } catch (error) {
    console.error('토큰 갱신 실패:', error);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    userStore.clearUser();

    return { success: false, error };
  } finally {
    userStore.setLoading(false);
  }
};
