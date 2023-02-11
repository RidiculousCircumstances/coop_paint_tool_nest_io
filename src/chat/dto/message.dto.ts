import {
  IsDefined,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class MessageDTO {
  @IsString()
  @IsDefined()
  chatId: string;

  @IsString()
  @IsDefined()
  @MaxLength(5000)
  text: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumberString()
  @IsOptional()
  referencedMessage?: string;
}
