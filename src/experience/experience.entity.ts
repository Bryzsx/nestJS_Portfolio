import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ExperienceType } from './experience-type.enum';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company: string;

  @Column()
  role: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column()
  startDate: string;

  @Column({ type: 'varchar', nullable: true })
  endDate: string | null;

  @Column({ type: 'varchar', default: ExperienceType.WORK })
  type: ExperienceType;

  @Column({ type: 'simple-json', default: '[]' })
  images: string[];

  @Column({ default: '' })
  achievement: string;
}
