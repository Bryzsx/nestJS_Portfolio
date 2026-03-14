import { IsString, IsBoolean, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'Getting Started with NestJS' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({
    example: 'getting-started-with-nestjs',
    description: 'URL-friendly slug. Auto-generated from title if not provided.',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'NestJS is a progressive Node.js framework...' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ example: 'A beginner-friendly guide to NestJS.' })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
