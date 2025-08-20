import { clearUserData, getUserLogout } from '@/entities/user';

export const userAuthLogout = async () => {
  try {
    await getUserLogout();
    clearUserData();
    return { success: true };
  } catch (error) {
    console.error('로그아웃 실패: 서버 사용자 세션 삭제 실패', error);
    clearUserData();
    return { success: false, error };
  }
};
