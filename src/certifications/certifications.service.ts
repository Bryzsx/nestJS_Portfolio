import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certification } from './certification.entity';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';

@Injectable()
export class CertificationsService {
  constructor(
    @InjectRepository(Certification)
    private readonly certRepo: Repository<Certification>,
  ) {}

  findAll(): Promise<Certification[]> {
    return this.certRepo.find({ order: { order: 'ASC' } });
  }

  async findOne(id: number): Promise<Certification> {
    const cert = await this.certRepo.findOneBy({ id });
    if (!cert) throw new NotFoundException(`Certification with id ${id} not found`);
    return cert;
  }

  create(dto: CreateCertificationDto): Promise<Certification> {
    return this.certRepo.save(this.certRepo.create(dto));
  }

  async update(id: number, dto: UpdateCertificationDto): Promise<Certification> {
    const cert = await this.findOne(id);
    Object.assign(cert, dto);
    return this.certRepo.save(cert);
  }

  async remove(id: number): Promise<void> {
    const cert = await this.findOne(id);
    await this.certRepo.remove(cert);
  }
}
