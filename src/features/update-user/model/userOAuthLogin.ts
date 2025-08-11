import { getOAuthToken, getCurrentUser } from '@/entities/user';
// import { setCookie, getCookie } from 'cookies-next';
import { useUserStore } from '@/entities/user';

export const userOAuthLogin = async (code: string) => {
  const userStore = useUserStore.getState();

  try {
    userStore.setLoading(true);

    const { accessToken } = await getOAuthToken(code);

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }

    // comment: 새로고침으로 인한 토큰 휘발시 주석 해제
    // const refreshToken = getCookie('refresh_token');
    // if (refreshToken) {
    //   setCookie('refresh_token', refreshToken, {
    //     httpOnly: false,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'lax',
    //     maxAge: 7 * 24 * 60 * 60, // 7일
    //     path: '/',
    //   });
    // }

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
