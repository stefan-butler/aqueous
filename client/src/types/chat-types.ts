import {User} from './user-types'
import {Incident} from './incident-types'
export interface IMessage {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface IChat {
  incidentId: Incident;
  responderId: User;
  reporterId: User;
  messages: IMessage[];
  _id: string;
}

export interface ChatState {
  list: IChat[];
  loading: boolean;
  error: string | null;
}