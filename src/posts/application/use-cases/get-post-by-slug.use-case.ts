import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { POST_REPOSITORY } from '../../domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../domain/repositories/post-repository.interface';

@Injectable()
export class GetPostBySlugUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(slug: string) {
    const post = await this.postRepository.findBySlug(slug);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
}

