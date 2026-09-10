import { MessengerChannel } from '@prisma/client';
import { ArrayNotEmpty, IsArray, IsEnum, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMessengerCampaignDto {
  @IsString()
  @MaxLength(200)
  name!: string;

  @IsString()
  @MaxLength(2000)
  content!: string;

  @IsEnum(MessengerChannel)
  channel!: MessengerChannel;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  recipientIds!: string[];
}
