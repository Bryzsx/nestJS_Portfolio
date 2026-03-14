import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  degree: string;

  @Column()
  school: string;

  @Column({ default: '' })
  location: string;

  @Column()
  startYear: number;

  @Column()
  endYear: number;

  @Column({ default: 0 })
  order: number;
}
