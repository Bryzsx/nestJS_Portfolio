import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCertificationDto {
  @ApiProperty({ example: 'The Complete Full-Stack Web Development Bootcamp' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Udemy' })
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiPropertyOptional({ example: 'Dr. Angela Yu' })
  @IsString()
  @IsOptional()
  instructor?: string;

  @ApiPropertyOptional({ example: 'Sept. 4, 2025' })
  @IsString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ example: '61.5 total hours' })
  @IsString()
  @IsOptional()
  hours?: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  credentialUrl?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  order?: number;
}
