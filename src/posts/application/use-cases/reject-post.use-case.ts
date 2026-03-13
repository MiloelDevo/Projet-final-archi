import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { POST_REPOSITORY } from '../../domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../domain/repositories/post-repository.interface';
import { PostRejectedEvent } from '../../domain/events/post-rejected.event';

@Injectable()
export class RejectPostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    postId: number,
    currentUser: { id: number; role: string },
    reason?: string,
  ): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    if (currentUser.role !== 'MODERATOR' && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only moderator or admin can reject');
    }

    post.status = 'REJECTED';
    await this.postRepository.save(post);

    this.eventEmitter.emit(
      PostRejectedEvent.EVENT_NAME,
      new PostRejectedEvent(post.id, post.authorId, currentUser.id, reason),
    );
  }
}
