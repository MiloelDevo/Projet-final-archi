import { Inject, Injectable } from '@nestjs/common';
import { POST_REPOSITORY } from '../../domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../domain/repositories/post-repository.interface';
import { Post } from '../../domain/entities/post.entity';

@Injectable()
export class ListPostsUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  execute(filter?: { tags?: string[] }): Promise<Post[]> {
    return this.postRepository.findAllByTags(filter?.tags);
  }
}

