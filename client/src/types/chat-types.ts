export interface IMessage {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface IChat {
  incidentId: string;
  responderId: string;
  reporterId: string;
  messages: IMessage[];
}

export interface ChatState {
  list: IChat[];
  loading: boolean;
  error: string | null;
}