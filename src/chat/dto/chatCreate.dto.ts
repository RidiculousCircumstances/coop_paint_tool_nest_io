import { IsDefined, IsEmail, IsString } from 'class-validator';

export class ChatCreateDTO {
  @IsString()
  @IsDefined()
  name: string;
}
