import api from '@/shared/api/axios';
import { UserProfile } from '../model/types';

export interface GetUserCardsParams {
  /** 가져올 카드 수 (기본: 10) */
  size?: number;
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
  const { size = 10, position } = params;

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

  const fullUrl = `${endpoint}?${queryParams.toString()}`;
  
  console.log('🔄 카드 추천 API 호출 상세 정보:');
  console.log('  - 엔드포인트:', endpoint);
  console.log('  - 전체 URL:', fullUrl);
  console.log('  - 요청 파라미터:', {
    size,
    position,
    originalParams: params
  });
  console.log('  - 쿼리 문자열:', queryParams.toString());

  try {
    console.log('📡 API 요청 시작...');
    const response = await api.get<UserProfile[]>(fullUrl);
    
    console.log('✅ 카드 추천 API 응답 상세:');
    console.log('  - 응답 상태:', response.status);
    console.log('  - 응답 데이터 개수:', response.data.length);
    console.log('  - 응답 데이터 (첫 3개):', response.data.slice(0, 3));
    console.log('  - 전체 응답 데이터:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ 카드 추천 API 에러 상세:', {
      message: error instanceof Error ? error.message : '알 수 없는 에러',
      error,
      endpoint,
      fullUrl,
      params
    });
    throw error;
  }
};

// getUserCardsByPosition 함수 제거: 이제 getUserCards의 position 파라미터를 직접 사용
