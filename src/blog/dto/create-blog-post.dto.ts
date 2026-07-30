import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'Getting Started with NestJS' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    example: 'getting-started-with-nestjs',
    description: 'URL-friendly slug. Auto-generated from title if not provided.',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  slug?: string;

  @ApiProperty({ example: 'NestJS is a progressive Node.js framework...' })
  @IsString()
  @MinLength(10)
  @MaxLength(50000)
  content: string;

  @ApiPropertyOptional({ example: 'A beginner-friendly guide to NestJS.' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  excerpt?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
