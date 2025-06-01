import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignDocument = Campaign & Document;

export enum ChannelType {
  VKONTAKTE = 'vkontakte',
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
}

export enum KeyboardDisplayType {
  STANDARD = 'standard',
  INLINE = 'inline',
}

export enum ButtonType {
  QUICK_REPLY = 'quick_reply',
  URL = 'url',
}

@Schema()
export class Button {
  @Prop({ required: true })
  text: string;

  @Prop({ type: String, enum: ButtonType, required: true })
  type: ButtonType;

  @Prop()
  url?: string;

  @Prop()
  quickReplyText?: string;
}

@Schema()
export class Keyboard {
  @Prop({ type: String, enum: KeyboardDisplayType, required: true })
  displayType: KeyboardDisplayType;

  @Prop({ type: [Button], default: [] })
  buttons: Button[];
}

@Schema()
export class ChannelMessage {
  @Prop({ type: String, enum: ChannelType, required: true })
  channelType: ChannelType;

  @Prop({ required: true })
  text: string;

  @Prop()
  senderAddress?: string;

  @Prop({ type: Keyboard, required: false })
  keyboard?: Keyboard;

  @Prop({ required: true, default: 0 })
  order: number;
}

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [ChannelMessage], default: [] })
  messages: ChannelMessage[];

  @Prop({ default: true })
  isActive: boolean;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
