import api from '@/shared/api/axios';
import { UserProfile } from '../model/types';

/**
 * 특정 사용자의 프로필 카드 정보를 ID로 조회합니다.
 * 상대방 프로필 페이지에서 사용됩니다.
 *
<<<<<<< HEAD
=======
 * API 엔드포인트: GET /users/profile/{id}
 * 
 * API 응답 구조가 UserProfile 타입과 일치하므로 별도 변환 없이 직접 반환합니다.
 *
>>>>>>> feat/#29-other-profile-page
 * @param userId - 조회할 사용자의 ID
 * @returns Promise<UserProfile> 사용자 프로필 카드 데이터
 * @throws API 호출 실패 시 에러
 */
export const getUserProfileById = async (userId: string): Promise<UserProfile> => {
<<<<<<< HEAD
  // TODO: 실제 API 연결 시 주석 해제
  // const response = await api.get<UserProfile>(`/users/${userId}/profile`);
  // return response.data;

  // 임시 Mock 데이터 사용 (개발 중)
  // 실제 API 연결 전까지 로컬 테스트용
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockProfile = mockOtherProfilesData[userId];

      if (mockProfile) {
        console.log(`✅ Mock: 사용자 ${userId} 프로필 조회 성공`);
        resolve(mockProfile);
      } else {
        console.error(`❌ Mock: 사용자 ${userId}를 찾을 수 없습니다`);
        reject(new Error(`사용자 ${userId}를 찾을 수 없습니다`));
      }
    }, 500); // 네트워크 지연 시뮬레이션
  });
=======
  const response = await api.get<UserProfile>(`/users/profile/${userId}`);
  return response.data;
>>>>>>> feat/#29-other-profile-page
};
