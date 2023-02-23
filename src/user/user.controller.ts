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
import {
  ALREDY_EXISTS_ERROR,
  WRONG_USER_PASSWORD_ERROR,
} from 'src/constants/constants';
import { UserAuthorizationDTO } from './dto/userAutorization.dto';
import { UserRegistrationDTO } from './dto/userRegistration.dto';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { UserDataInterface } from './interfaces/userData.interface';
import { UserResponseInterface } from './interfaces/userResponse.interface';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  public async register(
    @Body() registerData: UserRegistrationDTO,
  ): Promise<UserResponseInterface | null> {
    const isUserAlreadyExists: User | null = await this.userService.findUser(
      registerData.email,
    );
    if (isUserAlreadyExists) {
      throw new BadRequestException(ALREDY_EXISTS_ERROR);
    }

    return this.userService.createUser(registerData);
  }

  @Post('authorize')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  public async autorize(
    @Body() { email, password }: UserAuthorizationDTO,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(WRONG_USER_PASSWORD_ERROR);
    }
    return this.userService.authorizeUser(user);
  }

  @Get(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  public async getUser(@Param('id') id: number): Promise<UserDataInterface> {
    const user = await this.userService.getUser(id);
    if (!user) {
      throw new NotFoundException('There is no such user');
    }
    return user;
  }
}
