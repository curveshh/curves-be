import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  header!: string;

  @IsString()
  @IsNotEmpty()
  primaryText!: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsOptional()
  buttonText?: string;

  @IsString()
  @IsOptional()
  buttonLink?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  createdAt?: boolean;

  @IsString()
  @IsOptional()
  updatedAt?: boolean;
}
