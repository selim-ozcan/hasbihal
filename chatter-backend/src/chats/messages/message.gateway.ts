import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { WsJwtAuthGuard } from 'src/auth/guards/ws-jwt-auth.guard';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { ChatsService } from 'src/chats/chats.service';
import { Message } from 'src/chats/messages/entities/message.entity';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly chatsService: ChatsService,
  ) {}

  async publishMessage(message: Message) {
    this.server.to(`chats/${message.chatId}`).emit('message', message);
  }

  @SubscribeMessage('message')
  @UseGuards(WsJwtAuthGuard)
  async sendMessage(@MessageBody() message, @CurrentUser() user) {
    try {
      await this.chatsService.findOne(message.chatId, user._id);
      console.log('send message' + message);
      const newMessage = await this.messagesService.create(message, user);
      this.publishMessage(newMessage);
    } catch (error) {
      return new WsException('You cannot send message to this chat.');
    }
  }

  @SubscribeMessage('join')
  @UseGuards(WsJwtAuthGuard)
  async handleJoin(
    @MessageBody() { chatId },
    @ConnectedSocket() client: Socket,
    @CurrentUser() user: TokenPayload,
  ) {
    try {
      console.log('kankaa ' + chatId);
      const chat = await this.chatsService.findOne(chatId, user._id);
      await client.join(`chats/${chat._id}`);
    } catch (error) {
      throw new WsException('You can not join this chat.');
    }
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @MessageBody() { chatId },
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(`chats/${chatId}`);
  }
}
