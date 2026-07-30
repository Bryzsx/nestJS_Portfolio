import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './contact.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit a contact message' })
  submit(@Body() dto: CreateContactDto): Promise<Contact> {
    return this.contactService.submit(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all contact messages' })
  findAll(): Promise<Contact[]> {
    return this.contactService.findAll();
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a message as read' })
  markAsRead(@Param('id', ParseIntPipe) id: number): Promise<Contact> {
    return this.contactService.markAsRead(id);
  }
}
