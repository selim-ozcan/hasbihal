import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';

@Injectable()
export class MessagesRepository extends AbstractRepository<Message> {
  protected readonly logger = new Logger(MessagesRepository.name);

  constructor(@InjectModel(Message.name) messagesModel: Model<Message>) {
    super(messagesModel);
  }
}
