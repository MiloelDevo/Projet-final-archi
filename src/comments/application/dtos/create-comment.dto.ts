import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment content, 1-1000 non-whitespace characters',
    example: 'Great article!',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}

