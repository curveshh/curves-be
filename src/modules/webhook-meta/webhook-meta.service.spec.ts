import { Test, TestingModule } from '@nestjs/testing';
import { WebhookMetaService } from './webhook-meta.service';

describe('WebhookMetaService', () => {
  let service: WebhookMetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookMetaService],
    }).compile();

    service = module.get<WebhookMetaService>(WebhookMetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
