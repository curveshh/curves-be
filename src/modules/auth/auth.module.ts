import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshStrategy } from './jwt.refresh.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
