import { ConflictException, Injectable, Inject } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Post } from '../../domain/entities/post.entity';
import { POST_REPOSITORY } from '../../domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../domain/repositories/post-repository.interface';
import { CreatePostDto } from '../dtos/create-post.dto';
import { SlugService } from '../services/slug.service';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    private readonly slugService: SlugService,
  ) {}

  async execute(input: CreatePostDto & { authorId?: number | null }): Promise<Post> {
    let slug: string;

    if (input.slug) {
      const normalized = SlugService.slugifyRaw(input.slug);
      if (!normalized) {
        throw new ConflictException('Provided slug is invalid');
      }

      const existing = await this.postRepository.findBySlug(normalized);
      if (existing) {
        throw new ConflictException('Slug is already in use');
      }

      slug = normalized;
    } else {
      slug = await this.slugService.generateSlugFromTitle(input.title);
    }

    const post = new Post();
    post.title = input.title;
    post.content = input.content;
    post.slug = slug;
    post.authorId = input.authorId ?? null;

    try {
      return await this.postRepository.save(post);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        /UNIQUE constraint failed/i.test(err.message || '')
      ) {
        throw new ConflictException('Slug is already in use');
      }
      throw err;
    }
  }
}

