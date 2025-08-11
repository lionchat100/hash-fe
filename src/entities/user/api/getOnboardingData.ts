import api from '@/shared/api/axios';
import { OnboardingData } from '../model/types';
import { useQuery } from '@tanstack/react-query';

export const getOnboardingData = async () => {
  const response = await api.get<OnboardingData>('/api/users/onboarding/labels');
  return response.data;
};

export const useOnboardingData = () => {
  return useQuery({
    queryKey: ['onboarding-data'],
    queryFn: getOnboardingData,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });
};

export const sampleData = {
  genders: [
    {
      code: 'WOMEN',
      name: '여성',
    },
    {
      code: 'MEN',
      name: '남성',
    },
  ],
  universities: [
    {
      code: 'LIKELION',
      name: '멋사대학교',
    },
    {
      code: 'CATHOLIC',
      name: '가톨릭대학교',
    },
    {
      code: 'KANGNAM',
      name: '강남대학교',
    },
    {
      code: 'KYUNGPOOK',
      name: '경북대학교',
    },
    {
      code: 'KEIMYUNG',
      name: '계명대학교',
    },
    {
      code: 'KOREA_SEJONG',
      name: '고려대학교(세종)',
    },
    {
      code: 'KWANGWOON',
      name: '광운대학교',
    },
    {
      code: 'KOOKMIN',
      name: '국민대학교',
    },
    {
      code: 'KUMOH',
      name: '금오공과대학교',
    },
    {
      code: 'NAMSEOUL',
      name: '남서울대학교',
    },
    {
      code: 'DUKSUNG',
      name: '덕성여자대학교',
    },
    {
      code: 'DONGGUK',
      name: '동국대학교',
    },
    {
      code: 'DONGDUK',
      name: '동덕여자대학교',
    },
    {
      code: 'MYONGJI_HUMANITIES',
      name: '명지대학교(인문)',
    },
    {
      code: 'BAEKSEOK',
      name: '백석대학교',
    },
    {
      code: 'SAHMYOOK',
      name: '삼육대학교',
    },
    {
      code: 'SANGMYUNG_SEOUL',
      name: '상명대학교(서울)',
    },
    {
      code: 'SANGMYUNG_CHEONAN',
      name: '상명대학교(천안)',
    },
    {
      code: 'SOGANG',
      name: '서강대학교',
    },
    {
      code: 'SEOKYEONG',
      name: '서경대학교',
    },
    {
      code: 'SEOULTECH',
      name: '서울과학기술대학교',
    },
    {
      code: 'SEOUL',
      name: '서울대학교',
    },
    {
      code: 'SWOMEN',
      name: '서울여자대학교',
    },
    {
      code: 'SUNGKYUL',
      name: '성결대학교',
    },
    {
      code: 'SKHU',
      name: '성공회대학교',
    },
    {
      code: 'SKKU',
      name: '성균관대학교',
    },
    {
      code: 'SUNGSHIN',
      name: '성신여자대학교',
    },
    {
      code: 'SOOKMYUNG',
      name: '숙명여자대학교',
    },
    {
      code: 'SUNCHON',
      name: '순천대학교',
    },
    {
      code: 'SCH',
      name: '순천향대학교',
    },
    {
      code: 'SSU',
      name: '숭실대학교',
    },
    {
      code: 'YONSEI_SINCHON',
      name: '연세대학교(신촌)',
    },
    {
      code: 'YEUNGNAM',
      name: '영남대학교',
    },
    {
      code: 'EULJI_SEONGNAM',
      name: '을지대학교(성남)',
    },
    {
      code: 'EWHA',
      name: '이화여자대학교',
    },
    {
      code: 'INCHEON',
      name: '인천대학교',
    },
    {
      code: 'INHA',
      name: '인하대학교',
    },
    {
      code: 'JOONGBU_GOYANG',
      name: '중부대학교(고양)',
    },
    {
      code: 'CAU',
      name: '중앙대학교',
    },
    {
      code: 'CHEONGJU',
      name: '청주대학교',
    },
    {
      code: 'CNU',
      name: '충남대학교',
    },
    {
      code: 'KUTC',
      name: '한국교통대학교(충주)',
    },
    {
      code: 'HUFS_GLOBAL',
      name: '한국외국어대학교(글로벌)',
    },
    {
      code: 'HUFS_SEOUL',
      name: '한국외국어대학교(서울)',
    },
    {
      code: 'KAU',
      name: '한국항공대학교',
    },
    {
      code: 'HNU',
      name: '한남대학교',
    },
    {
      code: 'HANDONG',
      name: '한동대학교',
    },
    {
      code: 'HANBAT',
      name: '한밭대학교',
    },
    {
      code: 'HANSEO',
      name: '한서대학교',
    },
    {
      code: 'HANSUNG',
      name: '한성대학교',
    },
    {
      code: 'HANYANG_ERICA',
      name: '한양대학교(ERICA)',
    },
    {
      code: 'HONGIK',
      name: '홍익대학교',
    },
  ],
  positions: [
    {
      code: 'BACKEND',
      name: '백엔드',
    },
    {
      code: 'FRONTEND',
      name: '프론트엔드',
    },
    {
      code: 'UX_UI',
      name: 'UX/UI 디자이너',
    },
    {
      code: 'PM',
      name: 'PM',
    },
    {
      code: 'FULLSTACK',
      name: '풀스택',
    },
  ],
  mbtis: [
    {
      code: 'ENTJ',
      name: 'ENTJ',
    },
    {
      code: 'ENTP',
      name: 'ENTP',
    },
    {
      code: 'ENFJ',
      name: 'ENFJ',
    },
    {
      code: 'ENFP',
      name: 'ENFP',
    },
    {
      code: 'ESTJ',
      name: 'ESTJ',
    },
    {
      code: 'ESTP',
      name: 'ESTP',
    },
    {
      code: 'ESFJ',
      name: 'ESFJ',
    },
    {
      code: 'ESFP',
      name: 'ESFP',
    },
    {
      code: 'INTJ',
      name: 'INTJ',
    },
    {
      code: 'INTP',
      name: 'INTP',
    },
    {
      code: 'INFJ',
      name: 'INFJ',
    },
    {
      code: 'INFP',
      name: 'INFP',
    },
    {
      code: 'ISTJ',
      name: 'ISTJ',
    },
    {
      code: 'ISTP',
      name: 'ISTP',
    },
    {
      code: 'ISFJ',
      name: 'ISFJ',
    },
    {
      code: 'ISFP',
      name: 'ISFP',
    },
  ],
  preferenceType: [
    {
      code: 'PREFERENCE_FOCUSED',
      name: 'PREFERENCE_FOCUSED',
    },
    {
      code: 'POSITION_FOCUSED',
      name: 'POSITION_FOCUSED',
    },
    {
      code: 'CAREER_FOCUSED',
      name: 'CAREER_FOCUSED',
    },
  ],
};
