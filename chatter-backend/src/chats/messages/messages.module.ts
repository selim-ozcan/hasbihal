import { Module, forwardRef } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ChatsModule } from '../chats.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [forwardRef(() => ChatsModule)],
  controllers: [MessagesController],
  providers: [MessagesService, MessageGateway],
  exports: [MessageGateway],
})
export class MessagesModule {}
