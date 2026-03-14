import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Job Opportunity' })
  @IsString()
  @MinLength(1)
  subject: string;

  @ApiProperty({ example: 'Hi Bryce, I have an exciting opportunity...' })
  @IsString()
  @MinLength(10)
  message: string;
}
