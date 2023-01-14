import { Message } from '../models/message.model';
import { MessageInterface } from './message.interface';

export interface ChatInterface {
  id: string;
  name: string;
  creator_id: number;
  messages: Message[];
}
