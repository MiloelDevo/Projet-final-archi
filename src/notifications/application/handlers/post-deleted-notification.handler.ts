import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostDeletedEvent } from '../../../posts/domain/events/post-deleted.event';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification-repository.interface';
import type { INotificationRepository } from '../../domain/repositories/notification-repository.interface';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class PostDeletedNotificationHandler {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  @OnEvent(PostDeletedEvent.EVENT_NAME)
  async handle(event: PostDeletedEvent): Promise<void> {
    if (event.authorId == null) return;

    const notification = new Notification();
    notification.userId = event.authorId;
    notification.type = 'POST_DELETED';
    notification.title = 'Post deleted';
    notification.message = `Your post #${event.postId} has been deleted`;
    notification.link = null;
    notification.isRead = false;
    notification.metadata = JSON.stringify({
      postId: event.postId,
      deletedById: event.deletedById,
    });
    await this.notificationRepository.save(notification);
  }
}
