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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/apps/api/common/decorators/user';
import { JwtUserDto } from '@/apps/api/common/dto/auth/user';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNewsPostDto } from './dto/create';
import { SearchNews } from './dto/search';
import { UpdateNewsPostDto } from './dto/update';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('check-slug')
  checkSlug(@Query('slug') slug: string) {
    return this.newsService.checkSlug(slug);
  }

  @Post('list')
  findAll(@Body() dto: SearchNews) {
    return this.newsService.findAll(dto);
  }

  @Get()
  findPublished() {
    return this.newsService.findPublished();
  }

  @Get('slug/:slug')
  findPublishedBySlug(@Param('slug') slug: string) {
    return this.newsService.findPublishedBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@CurrentUser() user: JwtUserDto, @Body() dto: CreateNewsPostDto) {
    return this.newsService.create(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNewsPostDto) {
    return this.newsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }

  @Get('badge-options')
  getBadgeOptions() {
    return this.newsService.getBadgeOptions()
  }
}
