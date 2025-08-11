import type { DrawerConfig, OnboardingData } from '@/entities/user/model/types';

export const onboardingDataMapper = (bundle: OnboardingData): DrawerConfig[] => [
  {
    key: 'universities',
    label: '대학',
    placeholder: '선택',
    items: bundle.universities,
  },
  {
    key: 'mbti',
    label: 'MBTI',
    placeholder: '자신의 MBTI를 선택해주세요',
    items: bundle.mbtis,
  },
  {
    key: 'position',
    label: '꿈꾸는 커리어를 선택해주세요',
    placeholder: '관심있는 커리어 방향을 선택해주세요',
    contentHeader: '꿈꾸는 커리어 영역을 선택해주세요',
    items: bundle.positions,
  },
  {
    key: 'preferenceType',
    label: '같이 이야기하고 싶은 친구를 선택해주세요',
    placeholder: '만나고 싶은 친구 유형을 선택해주세요',
    contentHeader: '토킷 안에서 친구들과 이런 주제로 이야기하고 싶어요',
    items: bundle.genders,
  },
];
