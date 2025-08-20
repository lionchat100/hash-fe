import api from '@/shared/api/axios';
import { UserProfile } from '../model/types';

export interface GetUserCardsParams {
  /** 가져올 카드 수 (기본: 10) */
  size?: number;
  /** 포지션별 필터링 */
  position?: string;
  /** 제외할 사용자 ID 목록 (쉼표로 구분) */
  excludeUserIds?: string; // [추가]
}

/**
 * 사용자 카드 추천 목록을 조회합니다.
 * 클러스터링 기반 추천 시스템을 사용하여 유사한 성향의 사용자를 우선 추천합니다.
 *
 * API 엔드포인트: GET /users/cards/list
 *
 * 특징:
 * - MBTI와 포지션을 기반으로 한 클러스터링 추천
 * - 10분간 조회 이력 유지로 중복 방지
 * - 클러스터 부족 시 랜덤 보완
 *
 * @param params - 조회 옵션
 * @returns Promise<UserProfile[]> 추천 사용자 카드 목록
 * @throws API 호출 실패 시 에러
 */
export const getUserCards = async (params: GetUserCardsParams = {}): Promise<UserProfile[]> => {
  const { size = 10, position, excludeUserIds } = params; // [변경]

  // 쿼리 파라미터 구성
  const queryParams = new URLSearchParams();
  queryParams.append('size', size.toString());

  // API 문서에 따른 엔드포인트 선택
  const endpoint = position
    ? '/users/cards/category' // 포지션별 필터링
    : '/users/cards/list'; // 전체 추천

  if (position) {
    queryParams.append('position', position);
  }

  // [추가] 문서상 list에서 보장, category에서도 수용 가능하면 서버가 무시/처리
  if (excludeUserIds) {
    queryParams.append('excludeUserIds', excludeUserIds);
  }

  const fullUrl = `${endpoint}?${queryParams.toString()}`;

  try {
    const response = await api.get<UserProfile[]>(fullUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};
