import api from '@/shared/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const likeProfile = async ({ userId }: { userId: number }) => {
  const response = await api.post(`/users/likes/${userId}`);
  return response.data;
};

export const unlikeProfile = async ({ userId }: { userId: number }) => {
  const response = await api.post(`/users/likes/${userId}`);
  return response.data;
};

export const useUnlikeProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unlikeProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likeProfiles'] });
    },
  });
};
