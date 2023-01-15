import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocketModule } from './socket/socket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MySQLConfigService } from './config/MySQLConfig.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MySQLConfigService,
      inject: [MySQLConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../storage/static/chatimg'),
    }),
    SocketModule,
    UserModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
