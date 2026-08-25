import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import configuration from './apps/config/configuration';
import { envValidation } from './apps/config/env.validation';
import { PrismaModule } from './apps/database/prisma.module';
import { ApiModule } from './modules';
import { BannerController } from './modules/banner/banner.controller';
import { BannerService } from './modules/banner/banner.service';
import { CategoryModule } from './modules/category/category.module';
import { PromotionModule } from './modules/promotion/promotion.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [configuration],
      validationSchema: envValidation,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
    }),
    PrismaModule,
    ApiModule,
    PromotionModule,
    CategoryModule,
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class AppModule {}
