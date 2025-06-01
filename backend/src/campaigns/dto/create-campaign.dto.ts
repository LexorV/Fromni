import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ChannelType,
  KeyboardDisplayType,
  ButtonType,
} from '../schemas/campaign.schema';

export class CreateButtonDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsEnum(ButtonType)
  type: ButtonType;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  quickReplyText?: string;
}

export class CreateKeyboardDto {
  @IsEnum(KeyboardDisplayType)
  displayType: KeyboardDisplayType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateButtonDto)
  buttons: CreateButtonDto[];
}

export class CreateChannelMessageDto {
  @IsEnum(ChannelType)
  channelType: ChannelType;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  senderAddress?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateKeyboardDto)
  keyboard?: CreateKeyboardDto;

  @IsNumber()
  order: number;
}

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChannelMessageDto)
  messages: CreateChannelMessageDto[];
}
