import { Image } from '../models/image.model';

export interface SendedMessageInterface {
  messageId: number;
  userId: number;
  chatId: string;
  text: string;
  images: string[];
  referencedMessage: number | null;
  nickname: string;
  created: Date;
}
