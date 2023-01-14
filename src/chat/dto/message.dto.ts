import {
  IsDefined,
  IsNumber,
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
  @MaxLength(1000)
  text: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  referencedMesage?: number;
}
