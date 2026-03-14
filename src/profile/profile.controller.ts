import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './profile.entity';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get profile information' })
  get(): Promise<Profile> {
    return this.profileService.get();
  }

  @Put()
  @ApiOperation({ summary: 'Update profile information' })
  update(@Body() dto: UpdateProfileDto): Promise<Profile> {
    return this.profileService.update(dto);
  }
}
