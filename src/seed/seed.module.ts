import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Profile } from '../profile/profile.entity';
import { Project } from '../projects/project.entity';
import { Skill } from '../skills/skill.entity';
import { Experience } from '../experience/experience.entity';
import { Education } from '../education/education.entity';
import { Certification } from '../certifications/certification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile,
      Project,
      Skill,
      Experience,
      Education,
      Certification,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
