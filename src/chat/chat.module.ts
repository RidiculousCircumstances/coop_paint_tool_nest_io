import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from 'src/socket/socket.module';
import { User } from 'src/user/models/user.model';
import { UserModule } from 'src/user/user.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessageController } from './message.controller';
import { Chat } from './models/chat.model';
import { Message } from './models/message.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message, User]),
    UserModule,
    SocketModule,
  ],
  controllers: [ChatController, MessageController],
  providers: [ChatService],
})
export class ChatModule {}
