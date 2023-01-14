export interface MessageInterface {
  userId: number;
  chatId: number;
  refferencedMessageId?: number;
  text: string;
  image: string;
}
