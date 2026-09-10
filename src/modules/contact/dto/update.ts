import { IsOptional, IsString, Matches } from 'class-validator';

const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  @Matches(phoneRegex, {
    message: 'Số điện thoại không hợp lệ',
  })
  hotline?: string;

  @IsOptional()
  @IsString()
  @Matches(phoneRegex, {
    message: 'Số Zalo không hợp lệ',
  })
  zalo?: string;

  @IsOptional()
  @IsString()
  facebook?: string;
}
