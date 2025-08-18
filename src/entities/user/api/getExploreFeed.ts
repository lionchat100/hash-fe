import { User } from '@/entities/user/model/types'; //유저 도메인 타입 불러옴
import api from '@/shared/api/axios'; //axios 인스턴스 가져옴

export interface ExploreFeedDto {
  items: User[];
  nextCursor?: string | null;
} //이 ali가 반환하는 DTO 타입, 무한스크롤을 위해 필요

//커서를 인자로 받는 비동기함수
export const getExploreFeed = async (cursor?: string) => {
  const { data } = await api.get<ExploreFeedDto>('/users/explore', { params: { cursor } });
  return data;
};
