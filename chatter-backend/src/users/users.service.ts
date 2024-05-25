import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const encryptedPassword = await this.hashPassword(createUserDto.password);

    return this.usersRepository.create({
      ...createUserDto,
      password: encryptedPassword,
    });
  }

  findAll(search: string) {
    if (search) return this.usersRepository.find({ email: { $regex: search } });
    else return this.usersRepository.find({});
  }

  findOne(_id: string) {
    return this.usersRepository.findOne({ _id });
  }

  update(_id: string, updateUserDto: UpdateUserDto) {
    const encryptedPassword =
      updateUserDto.password && this.hashPassword(updateUserDto.password);

    return this.usersRepository.findOneAndUpdate(
      { _id },
      {
        ...updateUserDto,
        password: encryptedPassword,
      },
    );
  }

  remove(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id });
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    let passwordIsValid;
    try {
      passwordIsValid = await bcrypt.compare(password, user.password);
    } catch (error) {
      this.logger.warn('Error occured on local auth strategy bcrypt compare');
      throw new UnauthorizedException('Credentials are not valid.');
    }

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }
}
