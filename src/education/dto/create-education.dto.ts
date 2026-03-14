import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEducationDto {
  @ApiProperty({ example: 'Bachelor of Science in Information Technology' })
  @IsString()
  degree: string;

  @ApiProperty({ example: 'ACLC Butuan College' })
  @IsString()
  school: string;

  @ApiPropertyOptional({ example: 'Butuan City, Philippines' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 2020 })
  @IsInt()
  startYear: number;

  @ApiProperty({ example: 2026 })
  @IsInt()
  endYear: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  order?: number;
}
