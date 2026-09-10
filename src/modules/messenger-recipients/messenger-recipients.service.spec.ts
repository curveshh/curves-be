import { Test, TestingModule } from '@nestjs/testing';
import { MessengerRecipientsService } from './messenger-recipients.service';

describe('MessengerRecipientsService', () => {
  let service: MessengerRecipientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessengerRecipientsService],
    }).compile();

    service = module.get<MessengerRecipientsService>(MessengerRecipientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
