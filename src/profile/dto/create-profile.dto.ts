import {
  IsString,
  IsEmail,
  IsOptional,
  IsUrl,
  IsBoolean,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class HirePlatformDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  url: string;
}

export class CreateProfileDto {
  @ApiPropertyOptional({ example: 'Bryce A. Corvera' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Full-Stack Developer' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'Highly motivated BSIT graduate...' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/bryce' })
  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  githubUrl?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/bryce' })
  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  linkedinUrl?: string;

  @ApiPropertyOptional({ example: 'bryce@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '0939-266-5563' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: '/resume.pdf' })
  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
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
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ example: 'July 21, 2002' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  birthDate?: string;

  @ApiPropertyOptional({ example: '23 y/o' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  age?: string;

  @ApiPropertyOptional({ example: 'Filipino' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  citizenship?: string;

  @ApiPropertyOptional({ example: 'Software Developer' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  role?: string;
}
