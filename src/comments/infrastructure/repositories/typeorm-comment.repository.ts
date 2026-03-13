import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../domain/entities/comment.entity';
import {
  COMMENT_REPOSITORY,
  ICommentRepository,
} from '../../domain/repositories/comment-repository.interface';
import { Post } from '../../../posts/domain/entities/post.entity';

@Injectable()
export class TypeormCommentRepository implements ICommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}

  save(comment: Comment): Promise<Comment> {
    return this.repo.save(comment);
  }

  async findById(id: number): Promise<Comment | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['post', 'author'],
    });
  }

  async delete(comment: Comment): Promise<void> {
    await this.repo.remove(comment);
  }

  findByPostPaginated(
    post: Post,
    options: { skip: number; take: number },
  ): Promise<Comment[]> {
    return this.repo.find({
      where: { post: { id: post.id } },
      order: { createdAt: 'DESC' },
      skip: options.skip,
      take: options.take,
    });
  }

  countByPost(post: Post): Promise<number> {
    return this.repo.count({ where: { post: { id: post.id } } });
  }
}

export const TypeormCommentRepositoryProvider = {
  provide: COMMENT_REPOSITORY,
  useClass: TypeormCommentRepository,
};

