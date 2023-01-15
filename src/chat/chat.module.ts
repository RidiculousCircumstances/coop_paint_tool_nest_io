import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketModule } from '../socket/socket.module';
import { User } from '../user/models/user.model';
import { UserModule } from '../user/user.module';
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
    ConfigModule,
  ],
  controllers: [ChatController, MessageController],
  providers: [ChatService],
})
export class ChatModule {}
