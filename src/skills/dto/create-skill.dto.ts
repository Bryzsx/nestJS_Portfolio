import { IsString, IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillCategory } from '../skill-category.enum';

export class CreateSkillDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ enum: SkillCategory, example: SkillCategory.WEB_BACKEND })
  @IsEnum(SkillCategory)
  @IsOptional()
  category?: SkillCategory;

  @ApiPropertyOptional({ example: 80, minimum: 1, maximum: 100 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  proficiency?: number;
}
