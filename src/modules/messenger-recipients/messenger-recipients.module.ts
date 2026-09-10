import { Module } from '@nestjs/common';
import { MessengerRecipientsService } from './messenger-recipients.service';
import { MessengerRecipientsController } from './messenger-recipients.controller';

@Module({
  providers: [MessengerRecipientsService],
  controllers: [MessengerRecipientsController],
})
export class MessengerRecipientsModule {}
