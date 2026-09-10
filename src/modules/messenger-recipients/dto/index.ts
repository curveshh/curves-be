import { MessengerChannel, MessengerStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMessengerRecipientDto {
  @IsUUID()
  customerId!: string;

  @IsEnum(MessengerChannel)
  channel!: MessengerChannel;

  @IsString()
  @MaxLength(255)
  externalId!: string;
}

export class UpdateMessengerRecipientDto {
  @IsOptional()
  @IsEnum(MessengerStatus)
  status?: MessengerStatus;
}

export class SearchMessengerRecipientDto {
  @IsOptional()
  @IsEnum(MessengerChannel)
  channel?: MessengerChannel;

  @IsOptional()
  @IsEnum(MessengerStatus)
  status?: MessengerStatus;

  @IsOptional()
  @IsString()
  keyword?: string;
}
