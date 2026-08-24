import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'admin@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
  })
  @IsString()
  password!: string;
}
