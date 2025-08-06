export interface Message {
  id: number;
  senderName: string;
  senderId: number;
  date: Date;
  content: string;
}

export interface MessageList {
  [key: number]: Message[];
}
