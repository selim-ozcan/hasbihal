import { OmitType, PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto extends OmitType(User, ['_id']) {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  password: string;
}
