import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,
  ) {}

  findAll(): Promise<Skill[]> {
    return this.skillRepo.find({ order: { category: 'ASC', name: 'ASC' } });
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.skillRepo.findOneBy({ id });
    if (!skill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }
    return skill;
  }

  create(dto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillRepo.create(dto);
    return this.skillRepo.save(skill);
  }

  async update(id: number, dto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.findOne(id);
    Object.assign(skill, dto);
    return this.skillRepo.save(skill);
  }

  async remove(id: number): Promise<void> {
    const skill = await this.findOne(id);
    await this.skillRepo.remove(skill);
  }
}
