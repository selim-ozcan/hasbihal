import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  arrayNotEmpty,
} from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayNotEmpty()
  userIds: string[];

  @IsString()
  @IsNotEmpty()
  name: string;
}
