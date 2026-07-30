import { IsString, IsOptional, IsInt, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCertificationDto {
  @ApiProperty({ example: 'The Complete Full-Stack Web Development Bootcamp' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: 'Udemy' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  platform?: string;

  @ApiPropertyOptional({ example: 'Dr. Angela Yu' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  instructor?: string;

  @ApiPropertyOptional({ example: 'Sept. 4, 2025' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  date?: string;

  @ApiPropertyOptional({ example: '61.5 total hours' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  hours?: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  credentialUrl?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  order?: number;
}
