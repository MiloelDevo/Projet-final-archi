import { ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'Unique tag name, lowercase alphanumeric with hyphens, 2-50 chars',
    example: 'nestjs-ddd',
  })
  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  @Length(2, 50)
  @Matches(/^[a-z0-9-]+$/)
  name: string;
}

