import { Module, forwardRef } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsRepository } from './chats.repository';
import { DatabaseModule } from 'src/common/database/database.module';
import { Chat, ChatSchema } from './entities/chat.entity';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from 'src/users/users.module';
import { S3Module } from 'src/common/s3/s3.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => MessagesModule),
    UsersModule,
    S3Module,
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsRepository],
  exports: [ChatsRepository, ChatsService],
})
export class ChatsModule {}
