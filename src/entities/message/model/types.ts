export interface MessageReq {
  chatRoomId: number;
  content: string;
}

export interface MessageRes {
  messageId: string;
  chatRoomId: number;
  senderId: number;
  createdAt: Date;
  content: string;
  isEnd: boolean;
}

export interface MessageAck {
  messageId: string;
  userId: number;
}

export interface MessageList {
  [key: number]: MessageRes[];
}
