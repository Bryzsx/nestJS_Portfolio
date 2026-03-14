import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SkillCategory } from './skill-category.enum';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', default: SkillCategory.OTHER })
  category: SkillCategory;

  @Column({ default: 50 })
  proficiency: number;
}
