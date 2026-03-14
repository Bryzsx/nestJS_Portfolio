import {
  IsString,
  IsEmail,
  IsOptional,
  IsUrl,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class HirePlatformDto {
  @IsString()
  name: string;

  @IsString()
  url: string;
}

export class CreateProfileDto {
  @ApiPropertyOptional({ example: 'Bryce A. Corvera' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Full-Stack Developer' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Highly motivated BSIT graduate...' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/bryce' })
  @IsString()
  @IsOptional()
  githubUrl?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/bryce' })
  @IsString()
  @IsOptional()
  linkedinUrl?: string;

  @ApiPropertyOptional({ example: 'bryce@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '0939-266-5563' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '/resume.pdf' })
  @IsString()
  @IsOptional()
  resumeUrl?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  availableForWork?: boolean;

  @ApiPropertyOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HirePlatformDto)
  @IsOptional()
  hirePlatforms?: HirePlatformDto[];

  @ApiPropertyOptional({ example: 'Butuan City, Philippines' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'July 21, 2002' })
  @IsString()
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({ example: '23 y/o' })
  @IsString()
  @IsOptional()
  age?: string;

  @ApiPropertyOptional({ example: 'Filipino' })
  @IsString()
  @IsOptional()
  citizenship?: string;

  @ApiPropertyOptional({ example: 'Software Developer' })
  @IsString()
  @IsOptional()
  role?: string;
}
