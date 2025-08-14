import { onboardingConfirm, OnboardingFormData } from '@/entities/user/model/types';
import api from '@/shared/api/axios';

export const updateOnboarding = async (payload: OnboardingFormData) => {
  try {
    const response = await api.patch<onboardingConfirm>('/users/onboarding', { payload });

    if (!response) {
      throw new Error('온보딩 실패?');
    }

    return response.data;
  } catch (error) {
    console.error('온보딩 저장 중 에러 발생:', error);
    throw error;
  }
};
