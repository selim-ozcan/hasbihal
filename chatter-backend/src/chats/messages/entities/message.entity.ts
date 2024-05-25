import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/database/abstract.entity';

@Schema()
export class Message extends AbstractEntity {
  @Prop()
  content: string;

  @Prop()
  userId: string;

  @Prop()
  chatId: string;

  @Prop()
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
