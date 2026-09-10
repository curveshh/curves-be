import { Module } from '@nestjs/common';
import { MemberFeedbacksController } from './member-feedbacks.controller';
import { MemberFeedbacksService } from './member-feedbacks.service';

@Module({ controllers: [MemberFeedbacksController], providers: [MemberFeedbacksService] })
export class MemberFeedbacksModule {}
