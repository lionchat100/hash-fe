import { NicknameCheckRes } from '@/entities/user/model/types';
import api from '@/shared/api/axios';

export const checkNickname = async (nickname: string): Promise<NicknameCheckRes> => {
  const response = await api.get(`/users/check-nickname/${encodeURIComponent(nickname)}`);
  if (!response) throw new Error('닉네임 확인 실패');
  return { available: response.data };
};
