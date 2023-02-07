import { User } from '../../user/models/user.model';
import { SendedMessageInterface } from '../interfaces/sendedMessage.interface';
import { Message } from '../models/message.model';
import { Image } from '../models/image.model';

export class SendedMessage {
  static async getData(
    user: User,
    message: Message,
    images?: Image[] | null,
  ): Promise<SendedMessageInterface> {
    let paths = [];
    if (images) {
      paths = images.map((image) => {
        return image.path;
      });
    }

    return {
      messageId: message.id,
      userId: user.id,
      chatId: (await message.chat).id,
      text: message.text,
      images: paths ?? [],
      referencedMessage: message.referencedMessage,
      nickname: user.nickname,
      created: message.createdAt,
    };
  }
}
