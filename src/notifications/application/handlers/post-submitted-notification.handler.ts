import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostSubmittedForReviewEvent } from '../../../posts/domain/events/post-submitted-for-review.event';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification-repository.interface';
import type { INotificationRepository } from '../../domain/repositories/notification-repository.interface';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../../users/domain/repositories/user-repository.interface';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class PostSubmittedNotificationHandler {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  @OnEvent(PostSubmittedForReviewEvent.EVENT_NAME)
  async handle(event: PostSubmittedForReviewEvent): Promise<void> {
    const moderators = await this.userRepository.findByRole('MODERATOR');
    const admins = await this.userRepository.findByRole('ADMIN');
    const recipients = [...moderators, ...admins].map((u) => u.id);
    const uniqueIds = [...new Set(recipients)];

    for (const userId of uniqueIds) {
      const notification = new Notification();
      notification.userId = userId;
      notification.type = 'POST_SUBMITTED_FOR_REVIEW';
      notification.title = 'Post submitted for review';
      notification.message = `Post #${event.postId} has been submitted for review`;
      notification.link = `/posts/${event.postId}`;
      notification.isRead = false;
      notification.metadata = JSON.stringify({
        postId: event.postId,
        authorId: event.authorId,
      });
      await this.notificationRepository.save(notification);
    }
  }
}
