import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/models/user.model';
import { Repository } from 'typeorm';
import { ChatCreateDTO } from './dto/chatCreate.dto';
import { MessageDTO } from './dto/message.dto';
import { SendedMessage } from './dto/sendedMessage.dto';
import { ChatInterface } from './interfaces/chat.interface';

import { SendedMessageInterface } from './interfaces/sendedMessage.interface';
import { Chat } from './models/chat.model';
import { Message } from './models/message.model';

import { ConfigService } from '@nestjs/config';
import { Image } from './models/image.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,
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
  ): Promise<ChatInterface> {
    let newChat = this.chatRepository.create({
      name: dto.name,
    });
    newChat.creator = Promise.resolve(creator);
    newChat = await this.joinChat(newChat, creator);
    await this.chatRepository.save(newChat);

    return {
      id: newChat.id,
      name: newChat.name,
      creator: {
        id: creator.id,
        nickname: creator.nickname,
      },
      users: [
        {
          id: creator.id,
          nickname: creator.nickname,
        },
      ],
      created_at: newChat.createdAt,
    };
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

    const creator = await chat.creator;

    return {
      id: chat.id,
      name: chat.name,
      creator: {
        id: creator.id,
        nickname: creator.nickname,
      },
      users: users,
      created_at: chat.createdAt,
    };
  }

  public async getChats(user: User): Promise<ChatInterface[]> {
    const chatModels = await user.chats;
    const chats = await Promise.all(
      chatModels.map(async (chat) => {
        return await this.getChat(chat.id, user);
      }),
    );
    return chats;
  }

  public async getMessages(
    id: string,
    limit?: number,
  ): Promise<SendedMessageInterface[]> {
    limit = limit ?? 20;

    const messageModels = await this.messageRepository.find({
      relations: {
        user: true,
        images: true,
      },
      where: {
        chat: {
          id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
    });

    if (!messageModels) {
      return null;
    }

    const messages = await Promise.all(
      messageModels.map(async (message) => {
        const user = await message.user;
        return SendedMessage.getData(user, message, await message.images);
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

    return await SendedMessage.getData(user, message, await message.images);
  }

  public async createMessage(
    messageDto: MessageDTO,
    chat: Chat,
    user: User,
    fileNames?: string[],
  ): Promise<SendedMessageInterface> {
    let images = [];
    if (fileNames) {
      images = fileNames.map((path) => {
        return this.imageRepository.create({
          path,
        });
      });
    }

    await Promise.all(
      images.map(async (image) => {
        await this.imageRepository.save(image);
      }),
    );

    const message = this.messageRepository.create({
      text: messageDto.text,
      referencedMessage: messageDto.referencedMesage,
    });
    message.chat = Promise.resolve(chat);
    message.user = Promise.resolve(user);
    message.images = Promise.resolve(images);
    await this.messageRepository.save(message);
    return await SendedMessage.getData(user, message, images);
  }
}
