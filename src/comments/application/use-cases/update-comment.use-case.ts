import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COMMENT_REPOSITORY } from '../../domain/repositories/comment-repository.interface';
import type { ICommentRepository } from '../../domain/repositories/comment-repository.interface';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(
    commentId: number,
    content: string,
    currentUser: { id: number },
  ) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.id !== currentUser.id) {
      throw new ForbiddenException('Only the author can update this comment');
    }

    const trimmed = content.trim();
    if (!trimmed || trimmed.length < 1 || trimmed.length > 1000) {
      throw new BadRequestException('Content must be between 1 and 1000 non-whitespace characters');
    }

    comment.content = trimmed;
    return this.commentRepository.save(comment);
  }
}

