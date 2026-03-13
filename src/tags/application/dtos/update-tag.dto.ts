import { ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({
    description: 'New unique tag name, lowercase alphanumeric with hyphens, 2-50 chars',
    example: 'advanced-nestjs',
  })
  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  @Length(2, 50)
  @Matches(/^[a-z0-9-]+$/)
  name: string;
}

