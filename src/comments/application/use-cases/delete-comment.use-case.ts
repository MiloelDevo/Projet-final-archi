import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COMMENT_REPOSITORY } from '../../domain/repositories/comment-repository.interface';
import type { ICommentRepository } from '../../domain/repositories/comment-repository.interface';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(
    commentId: number,
    currentUser: { id: number; role: 'USER' | 'MODERATOR' | 'ADMIN' },
  ): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const postAuthorId = comment.post.authorId;
    const isAuthor = comment.author.id === currentUser.id;
    const isPostAuthor = postAuthorId === currentUser.id;
    const isModeratorOrAdmin = currentUser.role === 'MODERATOR' || currentUser.role === 'ADMIN';

    if (!isAuthor && !isPostAuthor && !isModeratorOrAdmin) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    await this.commentRepository.delete(comment);
  }
}

