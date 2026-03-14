import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  findAll(): Promise<Contact[]> {
    return this.contactRepo.find({ order: { createdAt: 'DESC' } });
  }

  async submit(dto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepo.create(dto);
    return this.contactRepo.save(contact);
  }

  async markAsRead(id: number): Promise<Contact> {
    const contact = await this.contactRepo.findOneBy({ id });
    if (!contact) {
      throw new NotFoundException(`Contact message with id ${id} not found`);
    }
    contact.read = true;
    return this.contactRepo.save(contact);
  }
}
