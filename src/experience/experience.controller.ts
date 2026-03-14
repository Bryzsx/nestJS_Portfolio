import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience } from './experience.entity';

@ApiTags('Experience')
@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  @ApiOperation({ summary: 'List all experience entries, sorted by date' })
  findAll(): Promise<Experience[]> {
    return this.experienceService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add an experience entry' })
  create(@Body() dto: CreateExperienceDto): Promise<Experience> {
    return this.experienceService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an experience entry' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExperienceDto,
  ): Promise<Experience> {
    return this.experienceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an experience entry' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.experienceService.remove(id);
  }
}
