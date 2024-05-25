import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatsRepository } from './chats.repository';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { FilterQuery } from 'mongoose';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}

  create(createChatDto: CreateChatDto, user: TokenPayload) {
    return this.chatsRepository.create({
      ...createChatDto,
      userId: user._id,
      userIds: createChatDto.userIds || [],
      messages: [],
    });
  }

  async findAll(userId?: string) {
    const chats = await this.chatsRepository.find(
      { $or: [{ userId }, { userIds: { $in: [userId] } }] },
      { messages: 0 },
    );

    return chats;
  }

  async findOne(chatId: string, userId: string) {
    const chat = await this.chatsRepository.findOne(
      { _id: chatId, $or: [{ userId }, { userIds: { $in: [userId] } }] },
      { messages: 0 },
    );
    if (!chat) {
      throw new ForbiddenException('You can not fetch this chat.');
    }

    return chat;
  }
}
