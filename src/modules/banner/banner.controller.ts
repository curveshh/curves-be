import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create';
import { MoveBannerDto } from './dto/order';
import { UpdateBannerDto } from './dto/update';

@ApiTags('Banners')
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }

  @Get('details/:id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateBannerDto) {
    return this.bannerService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.bannerService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }

  @Patch(':id/move')
  move(@Param('id') id: string, @Body() dto: MoveBannerDto) {
    return this.bannerService.move(id, dto);
  }
}
