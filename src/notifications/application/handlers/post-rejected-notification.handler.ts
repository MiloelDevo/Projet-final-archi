import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostRejectedEvent } from '../../../posts/domain/events/post-rejected.event';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification-repository.interface';
import type { INotificationRepository } from '../../domain/repositories/notification-repository.interface';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class PostRejectedNotificationHandler {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  @OnEvent(PostRejectedEvent.EVENT_NAME)
  async handle(event: PostRejectedEvent): Promise<void> {
    if (event.authorId == null) return;

    const notification = new Notification();
    notification.userId = event.authorId;
    notification.type = 'POST_REJECTED';
    notification.title = 'Post rejected';
    notification.message = event.reason
      ? `Your post #${event.postId} was rejected: ${event.reason}`
      : `Your post #${event.postId} has been rejected`;
    notification.link = `/posts/${event.postId}`;
    notification.isRead = false;
    notification.metadata = JSON.stringify({
      postId: event.postId,
      rejectedById: event.rejectedById,
      reason: event.reason,
    });
    await this.notificationRepository.save(notification);
  }
}
