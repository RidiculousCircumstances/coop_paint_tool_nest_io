import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

export class UserRegistrationDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsDefined()
  nickname: string;

  @IsString()
  @IsDefined()
  @MinLength(8)
  password: string;
}
