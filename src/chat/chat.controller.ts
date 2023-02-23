import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserEmail } from '../decorators/UserEmail.decorator';
import { SocketGateway } from '../socket/socket.gateway';
import { JwtAuthGuard } from '../user/guards/jwtAuth.guard';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { ChatCreateDTO } from './dto/chatCreate.dto';
import { ChatInterface } from './interfaces/chat.interface';
import { ChatMemberInterface } from './interfaces/chatMember.interface';
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
  public async getAll(@UserEmail() email: string): Promise<ChatInterface[]> {
    const user = await this.userService.findUser(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const chats = await this.chatService.getChats(user);

    if (!chats.length) {
      throw new NotFoundException('Chat list is empty');
    }

    return chats;
  }

  /**
   * Получить список пользователей чата
   */
  @Get('/members/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  public async getChatMembers(
    @Param('id') id: string,
  ): Promise<ChatMemberInterface[]> {
    const chatMembers = await this.chatService.getChatMembers(id);
    if (!chatMembers) {
      throw new NotFoundException('Chat has no users');
    }
    return chatMembers;
  }
}
