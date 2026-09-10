import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMemberFeedbackDto {
  @IsString()
  @MaxLength(150)
  fullName!: string;

  @IsString()
  @MaxLength(30)
  phone!: string;

  @IsString()
  @MaxLength(150)
  clubName!: string;

  @IsOptional()
  @IsString()
  clubId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  attendanceTime?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(6)
  rating!: number;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  favoriteAspect?: string;

  @IsString()
  @MaxLength(3000)
  content!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(1000)
  imageUrl?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  publicationConsent?: boolean;
}
