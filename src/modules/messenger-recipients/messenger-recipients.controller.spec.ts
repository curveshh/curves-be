import { Test, TestingModule } from '@nestjs/testing';
import { MessengerRecipientsController } from './messenger-recipients.controller';

describe('MessengerRecipientsController', () => {
  let controller: MessengerRecipientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessengerRecipientsController],
    }).compile();

    controller = module.get<MessengerRecipientsController>(MessengerRecipientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
