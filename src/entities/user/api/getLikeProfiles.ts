import api from '@/shared/api/axios';
import { UserProfile } from '../model/types';
import { useQuery } from '@tanstack/react-query';

export const getLikeProfiles = async () => {
  const response = await api.get<UserProfile[]>('/users/likes/lists');
  return response.data;
};

export const useLikeProfilesQuery = () => {
  return useQuery({
    queryKey: ['likeProfiles'],
    queryFn: getLikeProfiles,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
