import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommentCreatedEvent } from '../../../comments/domain/events/comment-created.event';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification-repository.interface';
import type { INotificationRepository } from '../../domain/repositories/notification-repository.interface';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class CommentCreatedNotificationHandler {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  @OnEvent(CommentCreatedEvent.EVENT_NAME)
  async handle(event: CommentCreatedEvent): Promise<void> {
    if (!event.postAuthorId || event.postAuthorId === event.commentAuthorId) {
      return;
    }

    const notification = new Notification();
    notification.userId = event.postAuthorId;
    notification.type = 'COMMENT_CREATED';
    notification.title = 'New comment';
    notification.message = `Someone commented on your post (post #${event.postId})`;
    notification.link = `/posts/${event.postId}`;
    notification.isRead = false;
    notification.metadata = JSON.stringify({
      commentId: event.commentId,
      postId: event.postId,
      commentAuthorId: event.commentAuthorId,
    });

    await this.notificationRepository.save(notification);
  }
}
