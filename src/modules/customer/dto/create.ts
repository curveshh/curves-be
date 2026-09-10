import { MessengerChannel } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  zalo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  facebookUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsEnum(MessengerChannel)
  type!: MessengerChannel;
}
