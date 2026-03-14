import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepo: Repository<Education>,
  ) {}

  findAll(): Promise<Education[]> {
    return this.educationRepo.find({ order: { startYear: 'DESC' } });
  }

  async findOne(id: number): Promise<Education> {
    const edu = await this.educationRepo.findOneBy({ id });
    if (!edu) throw new NotFoundException(`Education with id ${id} not found`);
    return edu;
  }

  create(dto: CreateEducationDto): Promise<Education> {
    return this.educationRepo.save(this.educationRepo.create(dto));
  }

  async update(id: number, dto: UpdateEducationDto): Promise<Education> {
    const edu = await this.findOne(id);
    Object.assign(edu, dto);
    return this.educationRepo.save(edu);
  }

  async remove(id: number): Promise<void> {
    const edu = await this.findOne(id);
    await this.educationRepo.remove(edu);
  }
}
