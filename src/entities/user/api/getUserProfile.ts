import api from '@/shared/api/axios';
import { UserMyProfile } from '../model/types';

/**
 * 현재 로그인한 사용자의 프로필 카드 정보를 조회합니다.
 * QR 코드 등에서 본인 카드를 표시할 때 사용됩니다.
 *
 * API 응답 구조가 UserMyProfile 타입과 일치하므로 별도 변환 없이 직접 반환합니다.
 *
 * @returns Promise<UserMyProfile> 사용자 프로필 카드 데이터
 * @throws API 호출 실패 시 에러
 */
export const getUserProfile = async (): Promise<UserMyProfile> => {
  const response = await api.get<UserMyProfile>('/users/card');
  return response.data;
};
