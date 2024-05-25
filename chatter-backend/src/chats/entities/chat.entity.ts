import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Message } from '../messages/entities/message.entity';
import { SchemaTypes } from 'mongoose';

@Schema()
export class Chat extends AbstractEntity {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  userIds: string[];

  @Prop()
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Message' })
  lastMessage?: Message;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
