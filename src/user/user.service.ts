import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegistrationDTO } from './dto/userRegistration.dto';
import { User } from './models/user.model';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadInterface } from './interfaces/userPayload.interface';
import { UserResponseInterface } from './interfaces/userResponse.interface';
import { UserData } from './dto/userData.dto';
import { UserDataInterface } from './interfaces/userData.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async findUser(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      return null;
    }

    return user;
  }

  public async createUser(
    dto: UserRegistrationDTO,
  ): Promise<UserResponseInterface> {
    const salt = await genSalt(10);

    const newUser = this.userRepository.create({
      email: dto.email,
      nickname: dto.nickname,
      password: await hash(dto.password, salt),
    });
    await this.userRepository.save(newUser);
    return this.authorizeUser(newUser);
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findUser(email);
    if (!user) {
      return null;
    }
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  public async authorizeUser(user: User): Promise<UserResponseInterface> {
    const payload: UserPayloadInterface = {
      email: user.email,
      userId: user.id,
    };

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      token: await this.jwtService.signAsync(payload),
      createdAt: user.createdAt,
    };
  }

  public async getUser(id: number): Promise<UserDataInterface> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    return UserData.getData(user);
  }
}
