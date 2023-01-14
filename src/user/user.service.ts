import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegistrationDTO } from './dto/userRegistration.dto';
import { User } from './models/user.model';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadInterface } from './interfaces/userPayload.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async findUser(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      return null;
    }

    return user;
  }

  public async createUser(dto: UserRegistrationDTO): Promise<User> {
    const salt = await genSalt(10);

    const newUser = this.userRepository.create({
      email: dto.email,
      nickname: dto.nickname,
      password: await hash(dto.password, salt),
    });
    this.userRepository.save(newUser);
    return newUser;
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

  public async authorizeUser(
    user: User,
  ): Promise<{ email: string; token: string }> {
    const payload: UserPayloadInterface = {
      email: user.email,
    };

    return {
      email: user.email,
      token: await this.jwtService.signAsync(payload),
    };
  }
}
