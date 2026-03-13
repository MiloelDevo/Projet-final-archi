import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class OverrideSlugDto {
  @ApiProperty({
    description: 'Desired slug. Must be unique; 409 returned if already used by another post.',
    example: 'my-custom-slug',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;
}

