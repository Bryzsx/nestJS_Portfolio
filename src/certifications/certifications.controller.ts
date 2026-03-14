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
import { CertificationsService } from './certifications.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';

@ApiTags('Certifications')
@Controller('certifications')
export class CertificationsController {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all certifications' })
  findAll() {
    return this.certificationsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add a certification' })
  create(@Body() dto: CreateCertificationDto) {
    return this.certificationsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a certification' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCertificationDto) {
    return this.certificationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a certification' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.certificationsService.remove(id);
  }
}
