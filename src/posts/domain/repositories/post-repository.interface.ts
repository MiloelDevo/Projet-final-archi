import type { Post } from '../entities/post.entity';

export interface IPostRepository {
  save(post: Post): Promise<Post>;
  findById(id: number): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;
  existsBySlug(slug: string): Promise<boolean>;
  findAllByTags(tagNames?: string[]): Promise<Post[]>;
  delete(post: Post): Promise<void>;
}

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');

