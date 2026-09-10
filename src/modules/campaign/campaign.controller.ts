import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateMessengerCampaignDto } from './dto/create';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  createCampaign(@Body() dto: CreateMessengerCampaignDto) {
    return this.campaignService.createCampaign(dto);
  }

  @Get('campaigns')
  getCampaigns() {
    return this.campaignService.getCampaigns();
  }

  @Get('campaigns/:id')
  getCampaign(@Param('id') id: string) {
    return this.campaignService.getCampaign(id);
  }

  @Post('campaigns/:id/send')
  sendCampaign(@Param('id') id: string) {
    return this.campaignService.sendCampaign(id);
  }

  @Post('campaigns/:id/retry')
  retryCampaign(@Param('id') id: string) {
    return this.campaignService.retryCampaign(id);
  }
}
