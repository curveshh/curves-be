import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';

import type { Request, Response } from 'express';

import { AuthService } from './auth.service';

import { CurrentUser } from '@/apps/api/common/decorators/user';
import { LoginDto } from '@/apps/api/common/dto/auth/login';
import { RegisterDto } from '@/apps/api/common/dto/auth/register';
import { JwtUserDto } from '@/apps/api/common/dto/auth/user';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.register(dto);

    this.setCookie(res, tokens.refreshToken);

    return {
      data: {
        accessToken: tokens.accessToken,
      },
      messsage: '',
      success: true,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);

    this.setCookie(res, tokens.refreshToken);

    return {
      data: {
        accessToken: tokens.accessToken,
      },
      messsage: '',
      success: true,
    };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const payload: any = req['user'];

    const tokens = await this.authService.refresh(payload.sub, payload.email);

    this.setCookie(res, tokens.refreshToken);

    return {
      data: {
        accessToken: tokens.accessToken,
      },
      messsage: '',
      success: true,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');

    return this.authService.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtUserDto) {
    return this.authService.me(user.sub);
  }

  private setCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }
}
