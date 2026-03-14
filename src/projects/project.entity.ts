import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: '' })
  imageUrl: string;

  @Column({ type: 'simple-json', default: '[]' })
  images: string[];

  @Column({ default: '' })
  liveUrl: string;

  @Column({ default: '' })
  repoUrl: string;

  @Column({ type: 'simple-json', default: '[]' })
  techStack: string[];

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
