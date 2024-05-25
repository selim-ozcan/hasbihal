import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsRepository } from './chats.repository';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly usersService: UsersService,
  ) {}

  create(createChatDto: CreateChatDto, user: TokenPayload) {
    createChatDto.userIds.forEach(async (userId) => {
      try {
        await this.usersService.findOne(userId);
      } catch (error) {
        throw new NotFoundException('User not found with given userId');
      }
    });
    const userIds = createChatDto.userIds.filter(
      (userId) => userId !== user._id,
    );

    return this.chatsRepository.create({
      name: createChatDto.name,
      userIds: userIds,
      userId: user._id,
      lastMessage: null,
    });
  }

  async findAll(userId?: string) {
    const chats = await this.chatsRepository.find(
      {
        $or: [{ userId }, { userIds: { $in: [userId] } }],
      },
      'lastMessage',
    );

    return chats;
  }

  async findOne(chatId: string, userId: string) {
    const chat = await this.chatsRepository.findOne(
      { _id: chatId, $or: [{ userId }, { userIds: { $in: [userId] } }] },
      'lastMessage',
    );

    if (!chat) {
      throw new ForbiddenException('You can not fetch this chat.');
    }

    return chat;
  }
}
