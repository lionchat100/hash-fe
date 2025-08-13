import { useOnboardingData } from '@/entities/user/api/getOnboardingData';
import { onboardingDataMapper } from '@/entities/user/lib/onboardingDataMapper';
import { DrawerConfig, Step2FormKey } from '@/entities/user/model/types';
import { useMemo } from 'react';

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
