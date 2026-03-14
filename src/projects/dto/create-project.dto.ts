import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Portfolio Website' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A professional portfolio built with NestJS and React.' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com/screenshot.png' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: ['/images/project1.png', '/images/project2.png'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: 'https://myportfolio.com' })
  @IsUrl()
  @IsOptional()
  liveUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/bryce/portfolio' })
  @IsUrl()
  @IsOptional()
  repoUrl?: string;

  @ApiPropertyOptional({ example: ['NestJS', 'TypeScript', 'React'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  techStack?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  order?: number;
}
