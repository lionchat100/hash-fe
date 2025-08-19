export interface MessageReq {
  chatRoomId: number;
  content: string;
}

export interface MessageRes {
  messageId: string;
  chatRoomId: number;
  id: number;
  nickname: string;
  imageUrl: string;
  createdAt: string;
  content: string;
  isEnd: boolean;
}

export interface MessageAck {
  messageId: string;
  id: number;
}

export type MessageList = MessageRes[];
