import api from '@/shared/api/axios';
import { OnboardingData } from '../model/types';
import { useQuery } from '@tanstack/react-query';

export const getOnboardingData = async () => {
  const response = await api.get<OnboardingData>('/users/onboarding/labels');
  return response.data;
};

export const useOnboardingData = () => {
  return useQuery({
    queryKey: ['onboarding-data'],
    queryFn: getOnboardingData,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });
};
