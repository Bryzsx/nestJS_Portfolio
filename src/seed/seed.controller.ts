import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Seed the database with portfolio data' })
  seed() {
    return this.seedService.seed();
  }

  @Post('force')
  @ApiOperation({ summary: 'Clear and reseed the database' })
  forceSeed() {
    return this.seedService.seed(true);
  }
}
