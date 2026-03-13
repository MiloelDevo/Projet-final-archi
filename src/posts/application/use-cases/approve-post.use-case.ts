import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { POST_REPOSITORY } from '../../domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../domain/repositories/post-repository.interface';
import { PostApprovedEvent } from '../../domain/events/post-approved.event';

@Injectable()
export class ApprovePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(postId: number, currentUser: { id: number; role: string }): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    if (currentUser.role !== 'MODERATOR' && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only moderator or admin can approve');
    }

    post.status = 'ACCEPTED';
    await this.postRepository.save(post);

    this.eventEmitter.emit(
      PostApprovedEvent.EVENT_NAME,
      new PostApprovedEvent(post.id, post.authorId, currentUser.id),
    );
  }
}
