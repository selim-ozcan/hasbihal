import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsRepository } from './chats.repository';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { UsersService } from 'src/users/users.service';
import { S3Service } from 'src/common/s3/s3.service';
import {
  USERS_BUCKET,
  USERS_IMAGE_FILE_EXTENSION,
} from 'src/users/users.constants';
import { MessageGateway } from './messages/message.gateway';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
    @Inject(forwardRef(() => MessageGateway))
    private readonly messageGateway: MessageGateway,
  ) {}

  async create(createChatDto: CreateChatDto, user: TokenPayload) {
    const userIds = createChatDto.userIds.filter(
      (userId) => userId !== user._id,
    );
    userIds.forEach(async (userId) => {
      try {
        await this.usersService.findOne(userId);
      } catch (error) {
        throw new NotFoundException('User not found with given userId');
      }
    });

    if (userIds.length === 0)
      throw new BadRequestException('userIds should not be empty.');

    const chat = await this.chatsRepository.create({
      name: createChatDto.name,
      userIds: userIds,
      userId: user._id,
      lastMessage: null,
    });

    chat.userIds.forEach((userId) =>
      this.messageGateway.publishChatAnnounce(userId, chat),
    );

    return chat;
  }

  async findAll(userId?: string) {
    const chats = await this.chatsRepository.find(
      {
        $or: [{ userId }, { userIds: { $in: [userId] } }],
      },
      'lastMessage',
    );

    return chats.map((chat) => ({
      ...chat,
      lastMessage: chat.lastMessage && {
        ...chat.lastMessage,
        imageUrl: this.s3Service.getObjectUrl(
          USERS_BUCKET,
          `${chat.lastMessage.userId}.${USERS_IMAGE_FILE_EXTENSION}`,
        ),
      },
    }));
  }

  async findOne(chatId: string, userId: string) {
    const chat = await this.chatsRepository.findOne(
      { _id: chatId, $or: [{ userId }, { userIds: { $in: [userId] } }] },
      'lastMessage',
    );

    if (!chat) {
      throw new ForbiddenException('You can not fetch this chat.');
    }

    return {
      ...chat,
      lastMessage: chat.lastMessage && {
        ...chat.lastMessage,
        imageUrl: this.s3Service.getObjectUrl(
          USERS_BUCKET,
          `${chat.lastMessage.userId}.${USERS_IMAGE_FILE_EXTENSION}`,
        ),
      },
    };
  }
}
