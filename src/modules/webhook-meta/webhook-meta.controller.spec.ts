import { Test, TestingModule } from '@nestjs/testing';
import { WebhookMetaController } from './webhook-meta.controller';

describe('WebhookMetaController', () => {
  let controller: WebhookMetaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookMetaController],
    }).compile();

    controller = module.get<WebhookMetaController>(WebhookMetaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
