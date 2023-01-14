import { User } from 'src/user/models/user.model';
import { Message } from '../models/message.model';

export class SendedMessage {
  static async getData(user: User, message: Message) {
    return {
      messageId: message.id,
      userId: user.id,
      chatId: (await message.chat).id,
      text: message.text,
      image: message.image,
      referencedMessage: message.referencedMessage,
      nickname: user.nickname,
      created: message.createdAt,
    };
  }
}
