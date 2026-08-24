import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MenusModule } from './menus/menus.module';
import { NewsModule } from './news/news.module';
import { PromotionModule } from './promotion/promotion.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, AuthModule, MenusModule, NewsModule, UploadModule, PromotionModule],
})
export class ApiModule {}
