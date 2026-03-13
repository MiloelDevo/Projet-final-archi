import { Injectable, Inject } from '@nestjs/common';
import { POST_REPOSITORY } from '../../domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../domain/repositories/post-repository.interface';

@Injectable()
export class SlugService {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
  ) {}

  private static normalizeToSlugBase(input: string): string {
    const trimmed = input.trim().toLowerCase();
    const withoutAccents = trimmed.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const withHyphens = withoutAccents.replace(/[^a-z0-9]+/g, '-');
    const collapsed = withHyphens.replace(/-+/g, '-');
    const sanitized = collapsed.replace(/^-|-$/g, '');
    return sanitized;
  }

  async generateSlugFromTitle(title: string): Promise<string> {
    let base = SlugService.normalizeToSlugBase(title);

    if (!base) {
      base = `post-${Math.random().toString(36).slice(2, 8)}`;
    }

    return this.generateUniqueSlug(base);
  }

  async generateUniqueSlug(base: string): Promise<string> {
    let attempt = base;
    let counter = 1;

    // First, try the base itself
    if (!(await this.postRepository.existsBySlug(attempt))) {
      return attempt;
    }

    // Then, suffix with -2, -3, ...
    while (counter < 1000) {
      counter += 1;
      attempt = `${base}-${counter}`;
      // eslint-disable-next-line no-await-in-loop
      const exists = await this.postRepository.existsBySlug(attempt);
      if (!exists) {
        return attempt;
      }
    }

    throw new Error('Unable to generate a unique slug');
  }

  static slugifyRaw(input: string): string {
    return SlugService.normalizeToSlugBase(input);
  }
}

