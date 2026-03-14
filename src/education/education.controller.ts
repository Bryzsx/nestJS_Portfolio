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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@ApiTags('Education')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  @ApiOperation({ summary: 'List all education entries' })
  findAll() {
    return this.educationService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add an education entry' })
  create(@Body() dto: CreateEducationDto) {
    return this.educationService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an education entry' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEducationDto) {
    return this.educationService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an education entry' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.educationService.remove(id);
  }
}
