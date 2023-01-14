import { SendedMessageInterface } from './sendedMessage.interface';

export interface ChatInterface {
  id: string;
  name: string;
  creator_id: number;
  messages: SendedMessageInterface[];
  users: { id: number; nickname: string }[];
}
