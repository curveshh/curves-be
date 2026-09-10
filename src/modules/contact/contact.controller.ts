import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { UpdateContactDto } from './dto/update';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async getContact() {
    return this.contactService.getContact();
  }

  @Put()
  async updateContact(@Body() dto: UpdateContactDto) {
    return this.contactService.updateContact(dto);
  }
}
