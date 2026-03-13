import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../domain/entities/post.entity';
import {
  IPostRepository,
  POST_REPOSITORY,
} from '../../domain/repositories/post-repository.interface';

@Injectable()
export class TypeormPostRepository implements IPostRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>,
  ) {}

  save(post: Post): Promise<Post> {
    return this.repo.save(post);
  }

  async findById(id: number): Promise<Post | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return this.repo.findOne({ where: { slug } });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.repo.count({ where: { slug } });
    return count > 0;
  }

  async findAllByTags(tagNames?: string[]): Promise<Post[]> {
    if (!tagNames || tagNames.length === 0) {
      return this.repo.find();
    }

    const normalized = tagNames.map((name) => name.toLowerCase());

    return this.repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .where('tag.name IN (:...names)', { names: normalized })
      .getMany();
  }

  async delete(post: Post): Promise<void> {
    await this.repo.remove(post);
  }
}

export const TypeormPostRepositoryProvider = {
  provide: POST_REPOSITORY,
  useClass: TypeormPostRepository,
};

