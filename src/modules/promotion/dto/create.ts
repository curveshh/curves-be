import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export enum BannerBgType {
  GRADIENT = 'GRADIENT',
  IMAGE = 'IMAGE',
}

export class CreatePromotionDto {
  @IsOptional()
  @IsString()
  badge?: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  discount?: string;

  @IsOptional()
  @IsString()
  extra?: string;

  @IsOptional()
  @IsString()
  ctaText?: string;

  @IsOptional()
  @IsString()
  footerText?: string;

  @IsOptional()
  @IsUrl()
  footerLink?: string;

  @IsString()
  endDate!: string;

  @IsOptional()
  @IsBoolean()
  showOnHome?: boolean;

  @IsEnum(BannerBgType)
  bgType?: BannerBgType;

  @IsOptional()
  @IsString()
  bgFrom?: string;

  @IsOptional()
  @IsString()
  bgTo?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}
