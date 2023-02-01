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
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserEmail } from 'src/decorators/UserEmail.decorator';
import { WebpInterceptor } from 'src/interceptors/webp.Iterceptor';
import { SocketGateway } from 'src/socket/socket.gateway';
import { JwtAuthGuard } from 'src/user/guards/JwtAuth.guard';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { MessageDTO } from './dto/message.dto';

@Controller('message')
export class MessageController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly socketGateway: SocketGateway,
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
  @UseInterceptors(FileInterceptor('image', {}), WebpInterceptor)
  public async create(
    @Body() messageDto: MessageDTO,
    @UserEmail() email: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg|image/png' }),
          new MaxFileSizeValidator({ maxSize: 8000000 }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    const user = await this.userService.findUser(email);

    const fileName = file ? file.filename : null;

    const chat = await this.chatService.findChat(messageDto.chatId);

    if (!user || !chat) {
      throw new BadRequestException();
    }
    const message = await this.chatService.createMessage(
      messageDto,
      chat,
      user,
      fileName,
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
      console.log(111);
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
