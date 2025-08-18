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
    items: bundle.mbti,
  },
  {
    key: 'position',
    label: '꿈꾸는 커리어 영역',
    placeholder: '관심있는 커리어 영역을 선택해주세요',
    items: bundle.positions,
  },
  {
    key: 'preferenceType',
    label: '관심있는 대화 주제',
    placeholder: '관심있는 대화 주제를 선택해주세요',
    items: bundle.preferenceType,
  },
];

export const preferenceLableMapper = (preferenceType: string): string => {
  const labels = [
    { key: '직무 관련', label: '직무 관련 : 기술 스택, 툴 사용법 등' },
    { key: '취업 준비', label: '취업 준비 : 진로 선택, 포트폴리오 작성 등' },
    { key: '일상 이야기', label: '일상 이야기 : 개인적인 고민, 네트워킹 등' },
  ];

  const found = labels.find((item) => item.key === preferenceType);
  return found ? found.label : preferenceType;
};
