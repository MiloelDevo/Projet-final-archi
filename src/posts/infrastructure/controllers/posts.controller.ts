import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post as HttpPost,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from '../../application/dtos/create-post.dto';
import { OverrideSlugDto } from '../../application/dtos/override-slug.dto';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { GetPostBySlugUseCase } from '../../application/use-cases/get-post-by-slug.use-case';
import { OverridePostSlugUseCase } from '../../application/use-cases/override-post-slug.use-case';
import { Post as PostEntity } from '../../domain/entities/post.entity';
import { ListPostsUseCase } from '../../application/use-cases/list-posts.use-case';
import { SubmitPostForReviewUseCase } from '../../application/use-cases/submit-post-for-review.use-case';
import { ApprovePostUseCase } from '../../application/use-cases/approve-post.use-case';
import { RejectPostUseCase } from '../../application/use-cases/reject-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/delete-post.use-case';
import { FakeAuthGuard } from '../../../common/guards/fake-auth.guard';
import type { RequestUser } from '../../../common/guards/fake-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly getPostBySlugUseCase: GetPostBySlugUseCase,
    private readonly overridePostSlugUseCase: OverridePostSlugUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly submitPostForReviewUseCase: SubmitPostForReviewUseCase,
    private readonly approvePostUseCase: ApprovePostUseCase,
    private readonly rejectPostUseCase: RejectPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List posts, optionally filtered by tags' })
  @ApiOkResponse({ type: PostEntity, isArray: true })
  @ApiQuery({
    name: 'tags',
    required: false,
    description: 'Comma-separated list of tag names to filter posts',
    example: 'nestjs,ddd',
  })
  async list(@Query('tags') tagsQuery?: string): Promise<PostEntity[]> {
    const tags = tagsQuery
      ? tagsQuery
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      : undefined;

    return this.listPostsUseCase.execute({ tags });
  }

  @HttpPost()
  @ApiOperation({ summary: 'Create a post with automatic slug generation' })
  @ApiCreatedResponse({ type: PostEntity })
  @ApiConflictResponse({ description: 'Slug already in use or invalid' })
  async create(@Body() dto: CreatePostDto): Promise<PostEntity> {
    // For now, authorId is not derived from auth; it can be wired later.
    return this.createPostUseCase.execute({ ...dto, authorId: null });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a post by slug' })
  @ApiOkResponse({ type: PostEntity })
  async getBySlug(@Param('slug') slug: string): Promise<PostEntity> {
    return this.getPostBySlugUseCase.execute(slug);
  }

  @Patch(':id/slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Manually override the slug of a post (author or admin only)',
  })
  @ApiOkResponse({ type: PostEntity })
  @ApiConflictResponse({ description: 'Slug invalid, already in use, or unauthorized' })
  async overrideSlug(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: OverrideSlugDto,
  ): Promise<PostEntity> {
    return this.overridePostSlugUseCase.execute(id, dto, null);
  }

  @HttpPost(':id/submit')
  @UseGuards(FakeAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit post for review (author or admin)' })
  async submit(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: RequestUser },
  ): Promise<void> {
    await this.submitPostForReviewUseCase.execute(id, req.user);
  }

  @Patch(':id/approve')
  @UseGuards(FakeAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve post (moderator or admin)' })
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: RequestUser },
  ): Promise<void> {
    await this.approvePostUseCase.execute(id, req.user);
  }

  @Patch(':id/reject')
  @UseGuards(FakeAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject post (moderator or admin)' })
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { reason?: string },
    @Req() req: { user: RequestUser },
  ): Promise<void> {
    await this.rejectPostUseCase.execute(id, req.user, body.reason);
  }

  @Delete(':id')
  @UseGuards(FakeAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete post (author, moderator or admin)' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: RequestUser },
  ): Promise<void> {
    await this.deletePostUseCase.execute(id, req.user);
  }
}

