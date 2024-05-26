import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { S3Service } from 'src/common/s3/s3.service';
import { USERS_BUCKET, USERS_IMAGE_FILE_EXTENSION } from './users.constants';
import { TokenPayload } from 'src/auth/token-payload.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private s3Service: S3Service,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const encryptedPassword = await this.hashPassword(createUserDto.password);

    let existingUser;
    try {
      existingUser = await this.usersRepository.findOne({
        username: createUserDto.username,
      });
    } catch (error) {}

    if (existingUser)
      throw new BadRequestException('This username is already taken');

    return this.usersRepository.create({
      ...createUserDto,
      password: encryptedPassword,
    });
  }

  async uploadProfileImage(file: Buffer, userId: string) {
    await this.s3Service.upload({
      bucket: USERS_BUCKET,
      key: `${userId}.${USERS_IMAGE_FILE_EXTENSION}`,
      file,
    });
  }

  getMe(user: TokenPayload) {
    return {
      ...user,
      imageUrl: this.s3Service.getObjectUrl(
        USERS_BUCKET,
        `${user._id}.${USERS_IMAGE_FILE_EXTENSION}`,
      ),
    };
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
