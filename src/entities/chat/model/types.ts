export interface ChatRoom {
  roomId: number;
  userImageUrl: string;
  opponentName: string;
  lastChat: string;
  lastChatTime: Date;
  isRead: boolean;
}

export interface ChatRoomList {
  [key: number]: ChatRoom[];
}
