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
import { ContactModule } from './modules/contact/contact.module';
import { CustomerModule } from './modules/customer/customer.module';
import { MessengerRecipientsModule } from './modules/messenger-recipients/messenger-recipients.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { WebhookMetaModule } from './modules/webhook-meta/webhook-meta.module';
import { TrialRegistrationsModule } from './modules/trial-registrations/trial-registrations.module';
import { MemberFeedbacksModule } from './modules/member-feedbacks/member-feedbacks.module';

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
    ContactModule,
    CustomerModule,
    MessengerRecipientsModule,
    CampaignModule,
    WebhookMetaModule,
    TrialRegistrationsModule,
    MemberFeedbacksModule,
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class AppModule {}
