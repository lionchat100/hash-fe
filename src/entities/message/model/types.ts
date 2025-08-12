export interface MessageReq {
  chatRoomId: number;
  content: string;
}

export interface MessageRes {
  messageId: string;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  imageUrl: string;
  createdAt: string;
  content: string;
  isEnd: boolean;
}

export interface MessageAck {
  messageId: string;
  userId: number;
}

export interface MessageList {
  [roomId: number]: MessageRes[];
}
