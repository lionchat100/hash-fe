import type { PolicyDoc } from '@/entities/policy/model/types';

export const servicePolicy: PolicyDoc = {
  id: 'service',
  title: '서비스 이용 약관',
  blocks: [
    {
      kind: 'pageDescription',
      text: '본 약관은 Tokit 서비스(이하 "서비스")의 이용과 관련하여 이용자와 운영자 간의 권리와 의무를 규정합니다.',
    },
    { kind: 'space', space: 10 },

    { kind: 'h2', text: '제1조 (목적)' },
    {
      kind: 'p',
      text: '이 약관은 Tokit이 제공하는 커피챗 기반 네트워킹 및 커뮤니티 서비스의 이용 조건과 절차, 권리·의무 사항을 명확히 하는 것을 목적으로 합니다.',
    },

    { kind: 'space', space: 4 },

    { kind: 'h2', text: '제2조 (서비스 이용)' },
    {
      kind: 'p',
      text: '1. 이용자는 카카오 계정으로 로그인하여 회원가입을 완료해야 서비스를 이용할 수 있습니다.',
    },

    {
      kind: 'p',
      text: '2. 서비스 주요 기능은 프로필 등록, 매칭·대화, 게시판 이용 등이며, 운영자는 서비스 개선을 위해 이를 변경할 수 있습니다.',
    },

    {
      kind: 'p',
      text: '3. 이용자는 관련 법령, 본 약관, 서비스 안내에 따라 성실히 서비스를 이용해야 합니다.',
    },

    { kind: 'space', space: 4 },

    { kind: 'h2', text: '제3조 (이용자의 의무)' },
    {
      kind: 'p',
      text: '1. 이용자는 본인의 계정을 타인에게 양도하거나 공유할 수 없습니다.',
    },

    {
      kind: 'p',
      text: '2. 이용자는 서비스 이용 과정에서 다음 행위를 해서는 안 됩니다.',
    },

    { kind: 'p', space: true, text: '- 불법적, 음란·폭력적, 차별적 표현이나 콘텐츠 게시' },
    { kind: 'p', space: true, text: '- 타인의 개인정보 도용 또는 허위 정보 등록' },
    { kind: 'p', space: true, text: '- 서비스 운영을 방해하는 행위' },

    {
      kind: 'p',
      text: '3. 위반 시 운영자는 이용 제한, 게시물 삭제, 계정 정지 등의 조치를 취할 수 있습니다.',
    },

    { kind: 'space', space: 4 },

    { kind: 'h2', text: '제4조 (개인정보 보호)' },
    { kind: 'p', text: '1. 운영자는 「개인정보 보호법」 등 관련 법령에 따라 개인정보를 보호합니다.' },

    {
      kind: 'p',
      text: '2. 개인정보 수집·이용, 보관·파기에 관한 사항은 별도의 개인정보 처리방침에 따릅니다.',
    },
    { kind: 'space', space: 4 },
    { kind: 'h2', text: '제5조 (서비스 제공 및 제한)' },
    {
      kind: 'p',
      text: '1. 운영자는 서비스 안정적 제공을 위해 노력합니다.',
    },
    {
      kind: 'p',
      text: '2. 다만, 다음과 같은 경우 서비스 제공이 일시적으로 중단될 수 있습니다.',
    },
    {
      kind: 'p',
      space: true,
      text: '- 시스템 점검, 서버 장애 등 기술적 사유',
    },
    {
      kind: 'p',
      space: true,
      text: '- 천재지변 등 불가항력 사유',
    },

    { kind: 'space', space: 4 },
    { kind: 'h2', text: '제6조 (계약 해지 및 탈퇴)' },
    {
      kind: 'p',
      text: '1. 이용자는 언제든지 앱 내 설정을 통해 탈퇴할 수 있습니다.',
    },
    {
      kind: 'p',
      text: '2. 회원 탈퇴 시 개인정보는 즉시 파기되며, 법령에 따라 필요한 경우에만 보관됩니다.',
    },

    { kind: 'space', space: 4 },
    { kind: 'h2', text: '제7조 (책임의 한계)' },
    {
      kind: 'p',
      text: '1. Tokit은 이용자 간 발생한 분쟁에 직접 개입하지 않으며, 분쟁은 당사자 간에 해결해야 합니다.',
    },
    {
      kind: 'p',
      text: '2. 다만, 운영자는 서비스 건전성 유지를 위해 필요한 범위 내에서 조치를 취할 수 있습니다.',
    },

    { kind: 'space', space: 4 },
    { kind: 'h2', text: '제8조 (기타)' },
    {
      kind: 'p',
      text: '1. 본 약관에 규정되지 않은 사항은 관련 법령 및 일반 상관례에 따릅니다.',
    },
    {
      kind: 'p',
      text: '2. 운영자는 필요 시 본 약관을 변경할 수 있으며, 변경 시 앱 내 공지합니다.',
    },
  ],
};
