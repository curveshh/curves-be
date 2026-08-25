import { ApiProperty } from '@nestjs/swagger';
export class JwtUserDto {
  @ApiProperty({
    example: 'clx123456789',
  })
  sub!: string;

  @ApiProperty({
    example: 'admin@gmail.com',
  })
  email!: string;
}
