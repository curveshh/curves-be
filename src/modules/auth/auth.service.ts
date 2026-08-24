import { LoginDto } from '@/apps/api/common/dto/auth/login';
import { RegisterDto } from '@/apps/api/common/dto/auth/register';
import { PrismaService } from '@/apps/database/prisma.service';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { name, email, password } = dto;
    const existed = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existed) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    return this.generateTokens(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const matched = await bcrypt.compare(dto.password, user.password);

    if (!matched) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.generateTokens(user.id, user.email);
  }

  async refresh(userId: string, email: string) {
    return this.generateTokens(userId, email);
  }

  async logout() {
    return {
      data: true,
      messsage: '',
      success: true,
    };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
      },
    });
  }

  private async generateTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_ACCESS_SECRET,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
