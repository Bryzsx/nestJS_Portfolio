import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  title: string;

  @Column({ type: 'text', default: '' })
  bio: string;

  @Column({ default: '' })
  avatarUrl: string;

  @Column({ default: '' })
  githubUrl: string;

  @Column({ default: '' })
  linkedinUrl: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  resumeUrl: string;

  @Column({ default: false })
  availableForWork: boolean;

  @Column({ type: 'simple-json', default: '[]' })
  hirePlatforms: { name: string; url: string }[];

  @Column({ default: '' })
  location: string;

  @Column({ default: '' })
  birthDate: string;

  @Column({ default: '' })
  age: string;

  @Column({ default: '' })
  citizenship: string;

  @Column({ default: '' })
  role: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
