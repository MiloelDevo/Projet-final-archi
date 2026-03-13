import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostApprovedEvent } from '../../../posts/domain/events/post-approved.event';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification-repository.interface';
import type { INotificationRepository } from '../../domain/repositories/notification-repository.interface';
import { SUBSCRIPTION_REPOSITORY } from '../../../subscriptions/domain/repositories/subscription-repository.interface';
import type { ISubscriptionRepository } from '../../../subscriptions/domain/repositories/subscription-repository.interface';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class PostApprovedNotificationHandler {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  @OnEvent(PostApprovedEvent.EVENT_NAME)
  async handle(event: PostApprovedEvent): Promise<void> {
    const toNotify: number[] = [];

    if (event.authorId != null) {
      toNotify.push(event.authorId);
      const followerIds =
        await this.subscriptionRepository.findFollowerIdsByFollowed(event.authorId);
      toNotify.push(...followerIds);
    }

    const uniqueIds = [...new Set(toNotify)];

    for (const userId of uniqueIds) {
      const notification = new Notification();
      notification.userId = userId;
      notification.type = 'POST_APPROVED';
      notification.title = 'Post approved';
      notification.message =
        userId === event.authorId
          ? `Your post #${event.postId} has been approved`
          : `A post from someone you follow has been approved (post #${event.postId})`;
      notification.link = `/posts/${event.postId}`;
      notification.isRead = false;
      notification.metadata = JSON.stringify({
        postId: event.postId,
        authorId: event.authorId,
        approvedById: event.approvedById,
      });
      await this.notificationRepository.save(notification);
    }
  }
}
