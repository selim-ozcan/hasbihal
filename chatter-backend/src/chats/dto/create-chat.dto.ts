import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  userIds: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
