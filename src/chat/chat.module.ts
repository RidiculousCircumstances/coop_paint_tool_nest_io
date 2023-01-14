import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/models/user.model';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat } from './models/chat.model';
import { Message } from './models/message.model';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, User])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
