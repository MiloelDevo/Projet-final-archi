import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { POST_REPOSITORY } from '../../domain/repositories/post-repository.interface';
import type { IPostRepository } from '../../domain/repositories/post-repository.interface';
import { PostSubmittedForReviewEvent } from '../../domain/events/post-submitted-for-review.event';

@Injectable()
export class SubmitPostForReviewUseCase {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: IPostRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(postId: number, currentUser: { id: number; role: string }): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const isAuthor = post.authorId === currentUser.id;
    const isAdmin = currentUser.role === 'ADMIN';
    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException('Only the author or an admin can submit for review');
    }

    post.status = 'PENDING_REVIEW';
    await this.postRepository.save(post);

    this.eventEmitter.emit(
      PostSubmittedForReviewEvent.EVENT_NAME,
      new PostSubmittedForReviewEvent(post.id, post.authorId),
    );
  }
}
