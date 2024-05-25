import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsRepository } from './chats.repository';
import { TokenPayload } from 'src/auth/token-payload.interface';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  create(createChatDto: CreateChatDto, user: TokenPayload) {
    return this.chatsRepository.create({
      name: createChatDto.name,
      userIds: createChatDto.userIds,
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
