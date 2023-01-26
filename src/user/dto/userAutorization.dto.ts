import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';

export class UserAuthorizationDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsDefined()
  password: string;
}
