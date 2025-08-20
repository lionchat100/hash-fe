import { deleteCookie } from 'cookies-next/client';
import { useUserStore, useProfileStore } from '..';

export const clearUserData = () => {
  const userStore = useUserStore.getState();
  const profileStore = useProfileStore.getState();

  userStore.clearUser();
  profileStore.clearProfile();

  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
  deleteCookie('refresh_token', { path: '/' });
};
