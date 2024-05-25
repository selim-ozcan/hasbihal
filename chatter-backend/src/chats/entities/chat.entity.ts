import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Message } from '../messages/entities/message.entity';
import mongoose, { SchemaTypes } from 'mongoose';

@Schema()
export class Chat extends AbstractEntity {
  @Prop()
  userId: string;

  @Prop()
  isPrivate: boolean;

  @Prop([SchemaTypes.ObjectId])
  userIds: string[];

  @Prop()
  name?: string;

  @Prop([Message])
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
