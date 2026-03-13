import { Body, Controller, Delete, Get, Param, Patch, Post as HttpPost, UseGuards } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTagDto } from '../../application/dtos/create-tag.dto';
import { UpdateTagDto } from '../../application/dtos/update-tag.dto';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case';
import { ListTagsUseCase } from '../../application/use-cases/list-tags.use-case';
import { UpdateTagUseCase } from '../../application/use-cases/update-tag.use-case';
import { DeleteTagUseCase } from '../../application/use-cases/delete-tag.use-case';
import { Tag } from '../../domain/entities/tag.entity';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly listTagsUseCase: ListTagsUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
  ) {}

  @HttpPost()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new tag (ADMIN only)' })
  @ApiCreatedResponse({ type: Tag })
  @ApiConflictResponse({ description: 'Tag name already exists' })
  @ApiForbiddenResponse({ description: 'Admin privileges required' })
  create(@Body() dto: CreateTagDto): Promise<Tag> {
    return this.createTagUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tags' })
  @ApiOkResponse({ type: Tag, isArray: true })
  list(): Promise<Tag[]> {
    return this.listTagsUseCase.execute();
  }

  @Patch(':name')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a tag name (ADMIN only)' })
  @ApiOkResponse({ type: Tag })
  @ApiConflictResponse({ description: 'New tag name already exists' })
  @ApiForbiddenResponse({ description: 'Admin privileges required' })
  update(@Param('name') name: string, @Body() dto: UpdateTagDto): Promise<Tag> {
    return this.updateTagUseCase.execute(name, dto);
  }

  @Delete(':name')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a tag (ADMIN only, posts are not deleted)' })
  @ApiOkResponse({ description: 'Tag deleted' })
  @ApiForbiddenResponse({ description: 'Admin privileges required' })
  async delete(@Param('name') name: string): Promise<void> {
    await this.deleteTagUseCase.execute(name);
  }
}

