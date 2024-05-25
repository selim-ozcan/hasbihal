import { AbstractRepository } from 'src/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './entities/chat.entity';
import { Message } from './messages/entities/message.entity';

@Injectable()
export class ChatsRepository extends AbstractRepository<Chat> {
  protected readonly logger = new Logger(ChatsRepository.name);

  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {
    super(chatModel);
  }

  public async updateLastMessage(chat: Chat, message: Message) {
    return this.chatModel.updateOne(
      { _id: chat._id },
      { $set: { lastMessage: message } },
    );
  }
}
