import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExperienceType } from '../experience-type.enum';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  role: string;

  @ApiPropertyOptional({ example: 'Built REST APIs with NestJS and PostgreSQL.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-01', description: 'YYYY-MM format' })
  @IsString()
  startDate: string;

  @ApiPropertyOptional({ example: '2025-06', description: 'YYYY-MM format, null if current' })
  @IsString()
  @IsOptional()
  endDate?: string | null;

  @ApiPropertyOptional({ enum: ExperienceType, example: ExperienceType.WORK })
  @IsEnum(ExperienceType)
  @IsOptional()
  type?: ExperienceType;

  @ApiPropertyOptional({ example: ['/images/dotr-group.png'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: 'Deployed a Face Recognition Biometric System' })
  @IsString()
  @IsOptional()
  achievement?: string;
}
