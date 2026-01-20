export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  createdAt?: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: { [key: string]: string };
  lastMessage: string;
  lastMessageTimestamp: number;
  createdAt: number;
  updatedAt: number;
}
