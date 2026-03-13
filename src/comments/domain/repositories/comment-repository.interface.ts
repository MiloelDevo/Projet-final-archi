import { Comment } from '../entities/comment.entity';
import { Post } from '../../../posts/domain/entities/post.entity';

export interface ICommentRepository {
  save(comment: Comment): Promise<Comment>;
  findById(id: number): Promise<Comment | null>;
  delete(comment: Comment): Promise<void>;
  findByPostPaginated(
    post: Post,
    options: { skip: number; take: number },
  ): Promise<Comment[]>;
  countByPost(post: Post): Promise<number>;
}

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

