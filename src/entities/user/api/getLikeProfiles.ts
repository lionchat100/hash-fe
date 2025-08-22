import api from '@/shared/api/axios';
import { UserProfile, PageResponse } from '@/entities/user';
import { useInfiniteQuery } from '@tanstack/react-query';

export const getLikeProfiles = async (page: number = 0, size: number = 30) => {
  const response = await api.get<PageResponse<UserProfile>>('/users/likes/lists', {
    params: {
      page,
      size,
    },
  });
  return response.data;
};

export const useLikeProfilesQuery = () => {
  return useInfiniteQuery({
    queryKey: ['likeProfiles'],
    queryFn: ({ pageParam = 0 }) => getLikeProfiles(pageParam, 30),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
