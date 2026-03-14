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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Skill } from './skill.entity';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'List all skills' })
  findAll(): Promise<Skill[]> {
    return this.skillsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add a new skill' })
  create(@Body() dto: CreateSkillDto): Promise<Skill> {
    return this.skillsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a skill' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSkillDto,
  ): Promise<Skill> {
    return this.skillsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a skill' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.skillsService.remove(id);
  }
}
