import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Updated comment content, 1-1000 non-whitespace characters',
    example: 'Updated comment',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}

