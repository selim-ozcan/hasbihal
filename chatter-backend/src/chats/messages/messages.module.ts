import { Module, forwardRef } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ChatsModule } from '../chats.module';
import { MessageGateway } from './message.gateway';
import { MessagesRepository } from './messages.repository';
import { DatabaseModule } from 'src/common/database/database.module';
import { Message, MessageSchema } from './entities/message.entity';

@Module({
  imports: [
    forwardRef(() => ChatsModule),
    DatabaseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessageGateway, MessagesRepository],
  exports: [MessageGateway],
})
export class MessagesModule {}
