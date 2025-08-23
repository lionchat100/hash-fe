import type { PolicyDoc } from '@/entities/policy/model/types';

export const privacyPolicy: PolicyDoc = {
  id: 'privacy',
  title: '개인정보처리방침',
  blocks: [
    { kind: 'pageDescription', text: 'Tokit 서비스에 등록해 주셔서 감사합니다' },

    { kind: 'space', space: 5 },
    {
      kind: 'pageDescription',
      text: `본 동의서는 Tokit에서 귀하의 개인정보를 수집,\n 이용 및 필요한 경우 제3자에게 제공하는 것에 대한 동의를 구하는 것입니다.`,
    },

    { kind: 'space', space: 10 },

    { kind: 'h2', text: '1. 개인정보 수집 및 이용 동의' },

    { kind: 'space', space: 2 },

    { kind: 'h2', text: '1.1 수집하는 개인정보 항목' },
    { kind: 'p', text: '- 필수 항목:' },
    {
      kind: 'list',
      items: [
        '카카오 로그인 시 제공되는 이메일, 이름(닉네임), 프로필 사진',
        '온보딩 과정에서 추가 입력되는 성별, 대학교명',
        '추가적인 프로필 정보(자기소개 등)',
      ],
    },

    { kind: 'space', space: 3 },

    { kind: 'h2', text: '1.2 개인정보 수집 및 이용 목적' },
    {
      kind: 'list',
      items: [
        '커피챗 및 네트워킹 서비스 제공(매칭, 대화 기능)',
        '프로필 기반 검색 및 게시판 커뮤니티 운영',
        '이용자 식별 및 부정 이용 방지',
        '서비스 개선을 위한 통계 및 분석 자료 활용',
      ],
    },

    { kind: 'space', space: 3 },

    { kind: 'h2', text: '1.3 보유 및 이용 기간' },
    {
      kind: 'list',
      items: [
        '회원 탈퇴 시까지 보관',
        '관계 법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관됩니다.',
      ],
    },

    { kind: 'space', space: 6 },

    { kind: 'h2', text: '2. 개인정보 제3자 제공 동의' },

    { kind: 'space', space: 2 },

    { kind: 'h2', text: '2.1 제공받는 자' },
    {
      kind: 'list',
      items: ['현재 단계에서는 제3자 제공 없음 (단, 추후 기업 협업 서비스 개시 시 별도 동의 절차 진행 예정)'],
    },

    { kind: 'space', space: 3 },

    { kind: 'h2', text: '2.2 제공 목적' },
    {
      kind: 'list',
      items: ['해당 없음'],
    },

    { kind: 'space', space: 3 },

    { kind: 'h2', text: '2.3 제공하는 개인 정보 항목' },
    {
      kind: 'list',
      items: ['해당 없음'],
    },

    { kind: 'space', space: 3 },

    { kind: 'h2', text: '2.4 제공받는 자의 보유 및 이용 기간' },
    {
      kind: 'list',
      items: ['해당 없음'],
    },

    { kind: 'space', space: 6 },

    { kind: 'h2', text: '3. 개인정보 파기 정책' },

    { kind: 'space', space: 2 },

    { kind: 'h2', text: '3.1 파기 시점' },
    {
      kind: 'list',
      items: ['회원 탈퇴 시 또는 개인정보 제공 동의 철회 시', '개인정보 보유기간 종료 시', '수집 및 이용 목적 달성 시'],
    },

    { kind: 'space', space: 2 },

    { kind: 'h2', text: '3.2 파기 방법' },
    {
      kind: 'list',
      items: ['전자적 파일: 복구 불가능한 방법으로 영구 삭제', '기타 기록물: 파쇄 또는 소각'],
    },

    { kind: 'space', space: 6 },

    { kind: 'h2', text: '4. 동의 거부 권리 및 동의 거부 시 불이익' },
    { kind: 'p', text: '귀하는 개인정보 수집, 이용 및 제3자 제공에 대한 동의를 거부할 권리가 있습니다.' },
    {
      kind: 'p',
      text: '다만, 필수 항목에 대한 동의를 거부할 경우 Tokit 서비스(회원가입, 프로필 생성 등) 이용이 제한될 수 있습니다.',
    },

    { kind: 'space', space: 6 },

    { kind: 'h2', text: '5. 정보주체의 권리' },
    { kind: 'p', text: '귀하는 언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.' },
    {
      kind: 'p',
      text: '권리 행사는 Tokit 개인정보 보호책임자에게 서면, 전화, 이메일 등을 통해 요청하실 수 있습니다.',
    },
  ],
};
