import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post as HttpPost,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCommentDto } from '../../application/dtos/create-comment.dto';
import { UpdateCommentDto } from '../../application/dtos/update-comment.dto';
import { ListCommentsQueryDto } from '../../application/dtos/list-comments-query.dto';
import { CreateCommentUseCase } from '../../application/use-cases/create-comment.use-case';
import { ListCommentsUseCase } from '../../application/use-cases/list-comments.use-case';
import { UpdateCommentUseCase } from '../../application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from '../../application/use-cases/delete-comment.use-case';
import { CountCommentsUseCase } from '../../application/use-cases/count-comments.use-case';
import { Comment } from '../../domain/entities/comment.entity';
import { FakeAuthGuard, RequestUser } from '../../../common/guards/fake-auth.guard';

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly listCommentsUseCase: ListCommentsUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly countCommentsUseCase: CountCommentsUseCase,
  ) {}

  @HttpPost('posts/:postId/comments')
  @UseGuards(FakeAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment on an accepted post' })
  @ApiCreatedResponse({ type: Comment })
  async create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
    @Req() req: { user: RequestUser },
  ): Promise<Comment> {
    return this.createCommentUseCase.execute(postId, dto, { id: req.user.id });
  }

  @Get('posts/:postId/comments')
  @ApiOperation({ summary: 'List comments for a post (paginated)' })
  @ApiOkResponse({ type: Comment, isArray: true })
  async list(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: ListCommentsQueryDto,
  ): Promise<Comment[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.listCommentsUseCase.execute(postId, { page, limit });
  }

  @Get('posts/:postId/comments/count')
  @ApiOperation({ summary: 'Get total count of comments for a post' })
  @ApiOkResponse({ type: Number })
  count(@Param('postId', ParseIntPipe) postId: number): Promise<number> {
    return this.countCommentsUseCase.execute(postId);
  }

  @Patch('comments/:id')
  @UseGuards(FakeAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment (author only)' })
  @ApiOkResponse({ type: Comment })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
    @Req() req: { user: RequestUser },
  ): Promise<Comment> {
    return this.updateCommentUseCase.execute(id, dto.content, { id: req.user.id });
  }

  @Delete('comments/:id')
  @UseGuards(FakeAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment (author, post author, MODERATOR, ADMIN)' })
  @ApiOkResponse({ description: 'Comment deleted' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: RequestUser },
  ): Promise<void> {
    await this.deleteCommentUseCase.execute(id, {
      id: req.user.id,
      role: req.user.role,
    });
  }
}

