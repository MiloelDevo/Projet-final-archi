import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COMMENT_REPOSITORY } from '../../domain/repositories/comment-repository.interface';
import type { ICommentRepository } from '../../domain/repositories/comment-repository.interface';
import { POST_REPOSITORY } from '../../../posts/domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../../posts/domain/repositories/post-repository.interface';

@Injectable()
export class CountCommentsUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: number): Promise<number> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.commentRepository.countByPost(post);
  }
}

