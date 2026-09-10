import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTrialRegistrationDto {
  @IsString()
  @MaxLength(150)
  fullName!: string;

  @IsString()
  @MaxLength(30)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MaxLength(150)
  preferredClub!: string;

  @IsOptional()
  @IsString()
  clubId?: string;

  @IsOptional()
  @IsDateString()
  preferredDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredSlot?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  trainingGoal?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  marketingConsent?: boolean;
}
