import { ConflictException, Injectable, NotFoundException, Inject } from '@nestjs/common';
import { POST_REPOSITORY } from '../../domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../domain/repositories/post-repository.interface';
import { OverrideSlugDto } from '../dtos/override-slug.dto';
import { SlugService } from '../services/slug.service';

@Injectable()
export class OverridePostSlugUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    private readonly slugService: SlugService,
  ) {}

  async execute(
    postId: number,
    input: OverrideSlugDto,
    currentUser: { id: number; isAdmin: boolean } | null,
  ) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Ownership / admin rule placeholder:
    // Only author or admin can override slug.
    if (
      currentUser &&
      !currentUser.isAdmin &&
      post.authorId &&
      post.authorId !== currentUser.id
    ) {
      throw new ConflictException('Only the author or an admin can override the slug');
    }

    const normalized = SlugService.slugifyRaw(input.slug);
    if (!normalized) {
      throw new ConflictException('Provided slug is invalid');
    }

    const existing = await this.postRepository.findBySlug(normalized);
    if (existing && existing.id !== post.id) {
      throw new ConflictException('Slug is already in use');
    }

    post.slug = normalized;
    return this.postRepository.save(post);
  }
}

