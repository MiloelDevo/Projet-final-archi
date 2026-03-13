import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { POST_REPOSITORY } from '../../domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../domain/repositories/post-repository.interface';
import { PostDeletedEvent } from '../../domain/events/post-deleted.event';
@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(postId: number, currentUser: { id: number; role: string }): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const isAuthor = post.authorId === currentUser.id;
    const isModOrAdmin =
      currentUser.role === 'MODERATOR' || currentUser.role === 'ADMIN';
    if (!isAuthor && !isModOrAdmin) {
      throw new ForbiddenException('Only the author, moderator or admin can delete');
    }

    this.eventEmitter.emit(
      PostDeletedEvent.EVENT_NAME,
      new PostDeletedEvent(post.id, post.authorId, currentUser.id),
    );

    await this.postRepository.delete(post);
  }
}
