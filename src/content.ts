import { Body, ConflictException, Controller, Delete, Get, HttpCode, Injectable, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { Content } from './database/entities';
import { ContentQueryDto, CreateContentDto, UpdateContentDto } from './dto';
import { AdminGuard } from './auth';

@Injectable()
export class ContentService {
  constructor(@InjectRepository(Content) private readonly repo: Repository<Content>) {}
  async list(query: ContentQueryDto, publicOnly: boolean) {
    const where: FindOptionsWhere<Content> = {};
    if (publicOnly) where.published = true;
    if (query.kind) where.kind = query.kind;
    const [items, total] = await this.repo.findAndCount({ where, order: { createdAt: 'DESC', id: 'DESC' }, skip: (query.page - 1) * query.limit, take: query.limit });
    return { items, total, page: query.page, limit: query.limit };
  }
  async publicDetail(slug: string) {
    const item = await this.repo.findOneBy({ slug, published: true });
    if (!item) throw new NotFoundException('Content not found');
    return item;
  }
  async get(id: string) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException('Content not found');
    return item;
  }
  private async save(item: Content) {
    try { return await this.repo.save(item); }
    catch (error) {
      if (error instanceof QueryFailedError && (error.driverError as { code?: string }).code === '23505') throw new ConflictException('Slug already exists');
      throw error;
    }
  }
  create(dto: CreateContentDto) { return this.save(this.repo.create(dto)); }
  async update(id: string, dto: UpdateContentDto) { return this.save(Object.assign(await this.get(id), dto)); }
  async remove(id: string) { const result = await this.repo.delete(id); if (!result.affected) throw new NotFoundException('Content not found'); }
}
@ApiTags('Public content') @Controller('content')
export class PublicContentController {
  constructor(private readonly content: ContentService) {}
  @Get() list(@Query() query: ContentQueryDto) { return this.content.list(query, true); }
  @Get(':slug') detail(@Param('slug') slug: string) { return this.content.publicDetail(slug); }
}
@ApiTags('Admin content') @ApiBearerAuth() @UseGuards(AdminGuard) @Controller('admin/content')
export class AdminContentController {
  constructor(private readonly content: ContentService) {}
  @Get() list(@Query() query: ContentQueryDto) { return this.content.list(query, false); }
  @Get(':id') detail(@Param('id', ParseUUIDPipe) id: string) { return this.content.get(id); }
  @Post() create(@Body() dto: CreateContentDto) { return this.content.create(dto); }
  @Patch(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContentDto) { return this.content.update(id, dto); }
  @Delete(':id') @HttpCode(204) remove(@Param('id', ParseUUIDPipe) id: string) { return this.content.remove(id); }
}
