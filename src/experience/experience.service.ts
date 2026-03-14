import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,
  ) {}

  findAll(): Promise<Experience[]> {
    return this.experienceRepo
      .createQueryBuilder('exp')
      .orderBy('exp.startDate', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Experience> {
    const experience = await this.experienceRepo.findOneBy({ id });
    if (!experience) {
      throw new NotFoundException(`Experience with id ${id} not found`);
    }
    return experience;
  }

  create(dto: CreateExperienceDto): Promise<Experience> {
    const experience = this.experienceRepo.create(dto);
    return this.experienceRepo.save(experience);
  }

  async update(id: number, dto: UpdateExperienceDto): Promise<Experience> {
    const experience = await this.findOne(id);
    Object.assign(experience, dto);
    return this.experienceRepo.save(experience);
  }

  async remove(id: number): Promise<void> {
    const experience = await this.findOne(id);
    await this.experienceRepo.remove(experience);
  }
}
