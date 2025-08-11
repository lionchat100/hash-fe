export interface MessageReq {
  chatRoomId: number;
  content: string;
}

export interface MessageRes {
  messageId: string;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  createdAt: Date;
  content: string;
}

export interface MessageAck {
  messageId: string;
  userId: number;
}

export interface LoadMessageRes {
  messageId: string;
  senderId: number;
  createdAt: Date;
  content: string;
  isEnd: boolean;
}

export interface LoadMessageList {
  [key: number]: LoadMessageRes[];
}
