import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatsRepository } from '../chats.repository';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { Message } from './entities/message.entity';
import { Types } from 'mongoose';
import { MessageGateway } from './message.gateway';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    //private readonly messageGateway: MessageGateway,
  ) {}

  async create(createMessageDto: CreateMessageDto, user: TokenPayload) {
    const message: Message = {
      content: createMessageDto.content,
      userId: user._id,
      createdAt: new Date(),
      chatId: createMessageDto.chatId,
      _id: new Types.ObjectId(),
    };

    try {
      const chat = await this.chatsRepository.findOneAndUpdate(
        {
          _id: createMessageDto.chatId,
          $or: [{ userId: user._id }, { userIds: { $in: [user._id] } }],
        },
        { $push: { messages: message } },
      );
    } catch (error) {
      throw new ForbiddenException('You cannot send message to this chat.');
    }

    //this.messageGateway.publishMessage(message);
    return message;
  }

  async getMessages(chatId, user) {
    try {
      const chat = await this.chatsRepository.findOne({
        _id: chatId,
        $or: [{ userId: user._id }, { userIds: { $in: [user._id] } }],
      });

      return chat.messages;
    } catch (error) {
      throw new ForbiddenException('You are not a member of this chat.');
    }
  }
}
