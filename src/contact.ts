import { Body, Controller, Get, Injectable, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Repository } from 'typeorm';
import { ContactRequest } from './database/entities';
import { CreateContactDto, PaginationDto, UpdateContactDto } from './dto';
import { AdminGuard } from './auth';

@Injectable()
export class ContactService {
  constructor(@InjectRepository(ContactRequest) private readonly repo: Repository<ContactRequest>) {}
  async create(dto: CreateContactDto) { const item = await this.repo.save(this.repo.create(dto)); return { id: item.id, message: 'Your request has been received.' }; }
  async list(query: PaginationDto) {
    const [items, total] = await this.repo.findAndCount({ order: { createdAt: 'DESC', id: 'DESC' }, skip: (query.page - 1) * query.limit, take: query.limit });
    return { items, total, page: query.page, limit: query.limit };
  }
  async update(id: string, dto: UpdateContactDto) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException('Contact request not found');
    return this.repo.save(Object.assign(item, dto));
  }
}
@ApiTags('Contact') @Controller('contact-requests')
export class PublicContactController {
  constructor(private readonly contacts: ContactService) {}
  @Post() @Throttle({ default: { limit: 3, ttl: 60000 } }) create(@Body() dto: CreateContactDto) { return this.contacts.create(dto); }
}
@ApiTags('Admin contact') @ApiBearerAuth() @UseGuards(AdminGuard) @Controller('admin/contact-requests')
export class AdminContactController {
  constructor(private readonly contacts: ContactService) {}
  @Get() list(@Query() query: PaginationDto) { return this.contacts.list(query); }
  @Patch(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContactDto) { return this.contacts.update(id, dto); }
}
