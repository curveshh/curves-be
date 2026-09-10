import { Module } from '@nestjs/common';
import { WebhookMetaService } from './webhook-meta.service';
import { WebhookMetaController } from './webhook-meta.controller';

@Module({
  providers: [WebhookMetaService],
  controllers: [WebhookMetaController]
})
export class WebhookMetaModule {}
