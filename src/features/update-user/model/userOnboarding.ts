import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useOnboardingStore } from '@/entities/user/model/slice';
import { AllFormData, DrawerConfig, Step2FormKey } from '@/entities/user/model/types';
import { useOnboardingData } from '@/entities/user/api/getOnboardingData';
import { onboardingDataMapper } from '@/entities/user/lib/onboardingDataMapper';
import { uploadImagesList } from '../api/uploadImagesList';
import { updateOnboarding } from '../api/UpdateOnboarding';

import { toast } from 'sonner';
import { useRouter } from 'next/router';

export function useOptionFilter() {
  const { data: bundle } = useOnboardingData();
  // const bundle = sampleData; // mock
  const configs = useMemo(() => (bundle ? onboardingDataMapper(bundle) : []), [bundle]);

  const uniConfig = useMemo(() => configs.find((c) => c.key === 'universities'), [configs]);

  const genderOptions = bundle?.genders ?? [];

  const dataKey: Step2FormKey[] = ['mbti', 'position', 'preferenceType'];

  const step2Configs = useMemo(
    () => configs.filter((c) => dataKey.includes(c.key as Step2FormKey)) as DrawerConfig<Step2FormKey>[],
    [configs],
  );

  return { bundle, configs, uniConfig, genderOptions, step2Configs };
}

export const finalOnboardingDataMapper = (data: AllFormData, imageIds: number[]) => {
  return {
    nickname: data.step1?.nickname ?? '',
    university: data.step1?.university ?? '',
    gender: data.step1?.gender ?? '',
    mbti: data.step2?.mbti ?? '',
    position: data.step2?.position ?? '',
    preferenceType: data.step2?.preferenceType ?? '',
    bio: data.step3?.bio ?? '',
    imageIds: imageIds ?? [],
    isUniversityView: data.step1?.isUniversityView ?? false,
    requiredAgreements: true,
    marketingAgreements: false,
  };
};

export function useSubmitOnboarding() {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const snap = useOnboardingStore.getState().data;

      const files = snap.step3?.images ?? [];
      const imageIds = await uploadImagesList(files);

      const finalPayload = finalOnboardingDataMapper(snap, imageIds);

      if (!finalPayload) throw new Error('유저 데이터 없음');

      return await updateOnboarding(finalPayload);
    },
    onSuccess: () => {
      toast.success('온보딩이 저장되었습니다.');
      // useOnboardingStore.getState().reset() 필요?
      router.push('/onboarding/end');
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : '저장 중 오류가 발생했습니다.';
      toast.error(msg);
      throw err;
    },
  });
}
