import api from '@/shared/api/axios';
import { UserProfile } from '../model/types';

/**
 * 특정 사용자의 프로필 카드 정보를 ID로 조회합니다.
 * 상대방 프로필 페이지에서 사용됩니다.
 *
 * API 엔드포인트: GET /users/profile/{id}
 * 
 * API 응답 구조가 UserProfile 타입과 일치하므로 별도 변환 없이 직접 반환합니다.
 *
 * @param userId - 조회할 사용자의 ID
 * @returns Promise<UserProfile> 사용자 프로필 카드 데이터
 * @throws API 호출 실패 시 에러
 */
export const getUserProfileById = async (userId: string): Promise<UserProfile> => {
  const response = await api.get<UserProfile>(`/users/profile/${userId}`);
  return response.data;
};
