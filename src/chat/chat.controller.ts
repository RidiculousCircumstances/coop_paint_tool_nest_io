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
import { ChatCreateDTO } from './dto/chatCreate.dto';
import { ChatInterface } from './interfaces/chat.interface';
import { Chat } from './models/chat.model';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly socketGateway: SocketGateway,
  ) {}

  /**
   * Создать чат
   */
  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  public async create(
    @Body() chatDto: ChatCreateDTO,
    @UserEmail() email: string,
  ): Promise<ChatCreateDTO> {
    const creator = await this.userService.findUser(email);
    if (!creator) {
      throw new BadRequestException();
    }
    return await this.chatService.createChat(creator, chatDto);
  }

  /**
   * Получить чат и присоединиться к чату
   */
  @Get(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  public async get(
    @Param('id') id: string,
    @UserEmail() email: string,
  ): Promise<ChatInterface> {
    /**
     * TODO: реализовать декоратор для получения user_id из токена, чтобы сократить количество запросов к бд
     */
    const user = await this.userService.findUser(email);
    const chat = await this.chatService.getChat(id, user);

    if (!chat) {
      throw new NotFoundException();
    }

    return chat;
  }

  /**
   * Получить все чаты пользователя
   */
  @Get()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  public async getAll(@UserEmail() email: string): Promise<Chat[]> {
    const user = await this.userService.findUser(email);
    if (!user) {
      throw new NotFoundException();
    }
    const chats = await this.chatService.getChats(user);

    return chats;
  }
}
