import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatsRepository } from '../chats.repository';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { MessagesRepository } from './messages.repository';
import { S3Service } from 'src/common/s3/s3.service';
import {
  USERS_BUCKET,
  USERS_IMAGE_FILE_EXTENSION,
} from 'src/users/users.constants';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository,
    private readonly s3Service: S3Service,
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
        username: user.username,
        createdAt: new Date(),
      });

      await this.chatsRepository.updateLastMessage(chat, message);

      return {
        ...message,
        imageUrl: this.s3Service.getObjectUrl(
          USERS_BUCKET,
          `${message.userId}.${USERS_IMAGE_FILE_EXTENSION}`,
        ),
      };
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

      // populate user imageUrls
      return messages.map((message) => ({
        ...message,
        imageUrl: this.s3Service.getObjectUrl(
          USERS_BUCKET,
          `${message.userId}.${USERS_IMAGE_FILE_EXTENSION}`,
        ),
      }));
    } catch (error) {
      throw new ForbiddenException('You are not a member of this chat.');
    }
  }
}
