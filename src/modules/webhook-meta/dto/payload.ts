import { IsArray, IsString } from 'class-validator';

export class SendBulkMessageDto {
  @IsArray()
  @IsString({ each: true })
  recipientIds!: string[];

  @IsString()
  message!: string;
}
