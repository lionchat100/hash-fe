import { UserProfile } from '@/entities/user';
import api from '@/shared/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const likeProfile = async ({ profile }: { profile: UserProfile }) => {
  const response = await api.post(`/users/likes/${profile.userId}`);
  return response.data;
};

export const unlikeProfile = async ({ profile }: { profile: UserProfile }) => {
  const response = await api.post(`/users/likes/${profile.userId}`);
  return response.data;
};

export const useLikeProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likeProfile,
    onSuccess: (_, { profile }: { profile: UserProfile }) => {
      queryClient.setQueryData(['likeProfiles'], (oldData: any) => {
        if (!oldData) return oldData;
        // 이미 캐시에 있는지 확인
        const existingProfile = oldData.pages
          .flatMap((page: any) => page.content)
          .find((p: UserProfile) => p.userId === profile.userId);
        if (existingProfile) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any, index: number) => {
            if (index === 0) {
              return {
                ...page,
                content: [profile, ...page.content],
                numberOfElements: page.numberOfElements + 1,
              };
            }
            return page;
          }),
          totalElements: oldData.totalElements + 1,
        };
      });
    },
  });
};

export const useUnlikeProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unlikeProfile,
    onSuccess: (_, { profile }: { profile: UserProfile }) => {
      queryClient.setQueryData(['likeProfiles'], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            content: page.content.filter((p: UserProfile) => p.userId !== profile.userId),
            numberOfElements: page.content.filter((p: UserProfile) => p.userId !== profile.userId).length,
          })),
          totalElements: oldData.totalElements - 1,
        };
      });
    },
  });
};
