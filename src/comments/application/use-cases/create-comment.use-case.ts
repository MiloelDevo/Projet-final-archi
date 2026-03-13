import { BadRequestException, Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { COMMENT_REPOSITORY } from '../../domain/repositories/comment-repository.interface';
import type { ICommentRepository } from '../../domain/repositories/comment-repository.interface';
import { POST_REPOSITORY } from '../../../posts/domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../../posts/domain/repositories/post-repository.interface';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { Comment } from '../../domain/entities/comment.entity';
import { User } from '../../../users/domain/entities/user.entity';
import { CommentCreatedEvent } from '../../domain/events/comment-created.event';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    postId: number,
    dto: CreateCommentDto,
    currentUser: { id: number },
  ): Promise<Comment> {
    const trimmed = dto.content.trim();
    if (!trimmed || trimmed.length < 1 || trimmed.length > 1000) {
      throw new BadRequestException('Content must be between 1 and 1000 non-whitespace characters');
    }

    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.status !== 'ACCEPTED') {
      throw new ForbiddenException('Comments can only be added to accepted posts');
    }

    const comment = new Comment();
    comment.content = trimmed;
    comment.post = post;
    const author = new User();
    author.id = currentUser.id;
    comment.author = author;

    const saved = await this.commentRepository.save(comment);

    if (!post.authorId || post.authorId === currentUser.id) {
      return saved;
    }

    this.eventEmitter.emit(
      CommentCreatedEvent.EVENT_NAME,
      new CommentCreatedEvent(saved.id, post.id, currentUser.id, post.authorId),
    );

    return saved;
  }
}

