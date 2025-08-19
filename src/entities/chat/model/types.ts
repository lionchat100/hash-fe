export interface ChatRoom {
  chatRoomId: number; // 채팅방 아이디
  nickname: string; // 상대방 이름
  lastContent: string; // 마지막 메시지 내용
  lastSendAt: string; // 마지막 메시지 발신 시간
  imageUrl: string; // 상대방 프로필 이미지
  isRead: boolean; // 마지막 메시지 읽음 여부
}

export type ChatRoomList = ChatRoom[];
