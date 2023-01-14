import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/models/user.model';
import { Repository } from 'typeorm';
import { ChatCreateDTO } from './dto/chatCreate.dto';
import { MessageDTO } from './dto/message.dto';
import { SendedMessage } from './dto/sendedMessage.dto';
import { ChatInterface } from './interfaces/chat.interface';
import { CreatedChatInterface } from './interfaces/createdChat.interface';
import { SendedMessageInterface } from './interfaces/sendedMessage.interface';
import { Chat } from './models/chat.model';
import { Message } from './models/message.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async findChat(id: string): Promise<Chat | null> {
    const chat = await this.chatRepository.findOneBy({ id });
    if (!chat) {
      return null;
    }

    return chat;
  }

  public isMember(user: User, users: User[]): boolean {
    const matches = users.map((usr) => {
      return usr.id === user.id;
    });

    return matches.includes(true);
  }

  public async joinChat(chat: Chat, user: User): Promise<Chat> {
    const users = await chat.users;
    const isMember = this.isMember(user, users);
    if (isMember) {
      return chat;
    }
    users.push(user);
    chat.users = Promise.resolve(users);
    return chat;
  }

  public async createChat(
    creator: User,
    dto: ChatCreateDTO,
  ): Promise<CreatedChatInterface> {
    let newChat = this.chatRepository.create({
      name: dto.name,
    });
    newChat.creator = Promise.resolve(creator);
    newChat = await this.joinChat(newChat, creator);
    await this.chatRepository.save(newChat);
    return { id: newChat.id, name: newChat.name };
  }

  public async getChat(id: string, user: User): Promise<ChatInterface | null> {
    let chat = await this.chatRepository.findOneBy({ id });
    if (!chat) {
      return null;
    }
    chat = await this.joinChat(chat, user);
    this.chatRepository.save(chat);

    const users = (await chat.users).map((user) => {
      return {
        id: user.id,
        nickname: user.nickname,
      };
    });

    const messages = await Promise.all(
      (
        await chat.messages
      ).map(async (message) => {
        return await SendedMessage.getData(user, message);
      }),
    );

    return {
      id: chat.id,
      name: chat.name,
      creator_id: (await chat.creator).id,
      messages: messages,
      users: users,
    };
  }

  public async getChats(user: User): Promise<Chat[]> {
    const chats = await user.chats;
    return chats;
  }

  public async getMessages(id: string): Promise<SendedMessageInterface[]> {
    const chat = await this.chatRepository.findOneBy({ id });
    if (!chat) {
      return null;
    }
    const messageModels = await chat.messages;

    const messages = await Promise.all(
      messageModels.map(async (message) => {
        const user = await message.user;
        return SendedMessage.getData(user, message);
      }),
    );

    return messages;
  }

  public async getMessage(id: number): Promise<SendedMessageInterface> {
    const message = await this.messageRepository.findOneBy({ id });
    if (!message) {
      return null;
    }

    const user = await message.user;

    return await SendedMessage.getData(user, message);
  }

  public async createMessage(
    messageDto: MessageDTO,
    chat: Chat,
    user: User,
  ): Promise<SendedMessageInterface> {
    const message = this.messageRepository.create({
      text: messageDto.text,
      referencedMessage: messageDto.referencedMesage,
      image: messageDto.image,
    });
    message.chat = Promise.resolve(chat);
    message.user = Promise.resolve(user);
    await this.messageRepository.save(message);
    return await SendedMessage.getData(user, message);
  }
}
