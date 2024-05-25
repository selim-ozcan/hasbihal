import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatsRepository } from '../chats.repository';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository,
  ) {}

  async create(createMessageDto: CreateMessageDto, user: TokenPayload) {
    try {
      const chat = await this.chatsRepository.findOne({
        _id: createMessageDto.chatId,
        $or: [{ userId: user._id }, { userIds: { $in: [user._id] } }],
      });

      const message = await this.messagesRepository.create({
        content: createMessageDto.content,
        chatId: createMessageDto.chatId,
        userId: user._id,
        createdAt: new Date(),
      });

      await this.chatsRepository.updateLastMessage(chat, message);

      return message;
    } catch (error) {
      throw new ForbiddenException('You cannot send message to this chat.');
    }
  }

  async getMessages(chatId, user) {
    try {
      await this.chatsRepository.findOne({
        _id: chatId,
        $or: [{ userId: user._id }, { userIds: { $in: [user._id] } }],
      });

      const messages = await this.messagesRepository.find({ chatId });

      return messages;
    } catch (error) {
      throw new ForbiddenException('You are not a member of this chat.');
    }
  }
}
