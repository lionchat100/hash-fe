export interface ChatRoom {
  chatRoomId: number; // 채팅방 아이디
  name: string; // 상대방 이름
  lastContent: string; // 마지막 메시지 내용
  lastSendAt: Date; // 마지막 메시지 발신 시간
  imageUrl: string; // 상대방 프로필 이미지
  isRead: boolean; // 마지막 메시지 읽음 여부
}

export interface ChatRoomList {
  [key: number]: ChatRoom[];
}
