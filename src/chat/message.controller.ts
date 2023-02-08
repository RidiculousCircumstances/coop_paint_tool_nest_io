import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MulterError } from 'multer';
import { UserEmail } from 'src/decorators/UserEmail.decorator';
import { validateFiles } from 'src/files/FilesValidator';
import { WebpInterceptor } from 'src/interceptors/webp.Iterceptor';
import { FilesValidator } from 'src/pipes/FilesValidatorPipe';
import { SocketGateway } from '../socket/socket.gateway';
import { JwtAuthGuard } from '../user/guards/jwtAuth.guard';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { MessageDTO } from './dto/message.dto';

@Controller('message')
export class MessageController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly socketGateway: SocketGateway,
    private readonly config: ConfigService,
  ) {}

  /**
   * Сохранить сообщение с/без изображения
   * @param messageDto
   * @param email
   * @returns
   */
  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: {
        fileSize: 8000000,
        files: 6,
      },
      fileFilter: (req, file, cb) =>
        validateFiles(req, file, cb, {
          mimetype: 'jpg|webp|png|jpeg',
        }),
    }),
    WebpInterceptor,
  )
  public async create(
    @Body() messageDto: MessageDTO,
    @UserEmail() email: string,
    @UploadedFiles()
    files?: string[],
  ) {
    const user = await this.userService.findUser(email);

    const chat = await this.chatService.findChat(messageDto.chatId);

    if (!user || !chat) {
      throw new BadRequestException();
    }
    const message = await this.chatService.createMessage(
      messageDto,
      chat,
      user,
      files,
    );
    // this.socketGateway.chatMessage(chat.id, message.messageId);
    return message;
  }

  /**
   * Получить сообщение
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  public async get(@Param('id') id: number) {
    const message = await this.chatService.getMessage(id);
    if (!message) {
      throw new NotFoundException();
    }
    return this.chatService.getMessage(id);
  }

  /**
   *
   * Получить сообщения из чата
   *
   * @param chatId
   * @returns
   */
  @Get('chat/:id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  public async getAll(
    @Param('id') chatId: string,
    @Query('limit') limit?: number,
  ) {
    const messages = await this.chatService.getMessages(chatId, limit);
    if (!messages) {
      throw new NotFoundException();
    }

    return messages;
  }
}
