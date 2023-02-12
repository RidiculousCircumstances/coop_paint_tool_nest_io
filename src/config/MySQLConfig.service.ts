import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Chat } from '../chat/models/chat.model';
import { Message } from '../chat/models/message.model';
import { User } from '../user/models/user.model';
import { Image } from '../chat/models/image.model';

@Injectable()
export class MySQLConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: this.configService.get<'mysql'>('DB_CONNECTION'),
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      synchronize: true,
      autoLoadEntities: true,
      entities: [User, Chat, Message, Image],
      charset: 'utf8mb4',
    };
  }
}
