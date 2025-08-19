import api from '@/shared/api/axios';
import { UserProfile } from '../model/types';

export interface GetUserCardsParams {
  /** 가져올 카드 수 (기본: 10) */
  size?: number;
  /** 제외할 사용자 ID 목록 (쉼표로 구분) */
  excludeUserIds?: string;
  /** 포지션별 필터링 */
  position?: string;
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
  const { size = 10, excludeUserIds, position } = params;

  // 쿼리 파라미터 구성
  const queryParams = new URLSearchParams();
  queryParams.append('size', size.toString());
  
  if (excludeUserIds) {
    queryParams.append('excludeUserIds', excludeUserIds);
  }

  const endpoint = position 
    ? '/users/cards/category'
    : '/users/cards/list';

  if (position) {
    queryParams.append('position', position);
  }

  const fullUrl = `${endpoint}?${queryParams.toString()}`;
  console.log('🔄 카드 추천 API 호출:', fullUrl);
  console.log('📋 요청 파라미터:', params);

  try {
    const response = await api.get<UserProfile[]>(fullUrl);
    console.log('✅ 카드 추천 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 카드 추천 API 에러:', error);
    throw error;
  }
};

/**
 * 포지션별 사용자 카드를 조회합니다.
 * 
 * API 엔드포인트: GET /users/cards/category
 *
 * @param position - 필터링할 포지션 (BACKEND, FRONTEND, UX_UI, PM, FULLSTACK)
 * @param size - 가져올 카드 수 (기본: 10)
 * @returns Promise<UserProfile[]> 해당 포지션의 사용자 카드 목록
 */
export const getUserCardsByPosition = async (position: string, size: number = 10): Promise<UserProfile[]> => {
  return getUserCards({ position, size });
};