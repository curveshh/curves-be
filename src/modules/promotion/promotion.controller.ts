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
import { CreatePromotionDto } from './dto/create';
import { SearchPromotionDto } from './dto/search';
import { UpdatePromotionDto } from './dto/update';
import { PromotionService } from './promotion.service';

@ApiTags('Promotions')
@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('all')
  all(@Body() dto: SearchPromotionDto) {
    return this.promotionService.findAll(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreatePromotionDto) {
    return this.promotionService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.promotionService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.promotionService.remove(id);
  }

  @Get('details/:id')
  details(@Param('id') id: string) {
    return this.promotionService.details(id);
  }

  @Get('home')
  async findHome() {
    return this.promotionService.findHome();
  }
}
