import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserEmail } from 'src/decorators/UserEmail.decorator';
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
   *
   * @param messageDto
   * @param email
   * @returns
   */
  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  public async create(
    @Body() messageDto: MessageDTO,
    @UserEmail() email: string,
  ) {
    const user = await this.userService.findUser(email);
    const chat = await this.chatService.findChat(messageDto.chatId);
    if (!user || !chat) {
      throw new BadRequestException();
    }
    return this.chatService.createMessage(messageDto, chat, user);
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
    const message = this.chatService.getMessage(id);
    if (!message) {
      throw new NotFoundException();
    }
    return this.chatService.getMessage(id);
  }

  /**
   *
   * Получить все сообщения из чата
   *
   * @param chatId
   * @returns
   */
  @Get('chat/:id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  public async getAll(@Param('id') chatId: string) {
    console.log(chatId);
    const messages = this.chatService.getMessages(chatId);
    if (!messages) {
      throw new NotFoundException();
    }

    return messages;
  }
}
