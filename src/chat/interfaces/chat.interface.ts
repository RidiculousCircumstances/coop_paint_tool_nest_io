import { SendedMessageInterface } from './sendedMessage.interface';

export interface ChatInterface {
  id: string;
  name: string;
  creator: {
    id: number;
    nickname: string;
  };
  messages?: SendedMessageInterface[];
  users: { id: number; nickname: string }[];
  created_at: Date;
}
