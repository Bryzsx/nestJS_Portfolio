import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Certification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '' })
  platform: string;

  @Column({ default: '' })
  instructor: string;

  @Column({ default: '' })
  date: string;

  @Column({ default: '' })
  hours: string;

  @Column({ default: '' })
  imageUrl: string;

  @Column({ default: '' })
  credentialUrl: string;

  @Column({ default: 0 })
  order: number;
}
