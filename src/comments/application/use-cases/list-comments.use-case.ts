import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COMMENT_REPOSITORY } from '../../domain/repositories/comment-repository.interface';
import type { ICommentRepository } from '../../domain/repositories/comment-repository.interface';
import { POST_REPOSITORY } from '../../../posts/domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../../posts/domain/repositories/post-repository.interface';
import { Comment } from '../../domain/entities/comment.entity';

@Injectable()
export class ListCommentsUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(
    postId: number,
    options: { page: number; limit: number },
  ): Promise<Comment[]> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const skip = (options.page - 1) * options.limit;
    return this.commentRepository.findByPostPaginated(post, { skip, take: options.limit });
  }
}

