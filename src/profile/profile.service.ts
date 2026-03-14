import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  async get(): Promise<Profile> {
    const existing = await this.profileRepo.find();
    if (existing.length > 0) {
      return existing[0];
    }
    return this.profileRepo.save(this.profileRepo.create());
  }

  async update(dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.get();
    Object.assign(profile, dto);
    return this.profileRepo.save(profile);
  }
}
