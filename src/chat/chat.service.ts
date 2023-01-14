import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './models/chat.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private userRepository: Repository<Chat>,
  ) {}
}
