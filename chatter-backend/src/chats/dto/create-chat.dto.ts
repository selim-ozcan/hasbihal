import { OmitType } from '@nestjs/mapped-types';
import { Chat } from '../entities/chat.entity';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateChatDto {
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isPrivate: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  userIds?: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
