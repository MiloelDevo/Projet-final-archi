import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserFollowedEvent } from '../../../subscriptions/domain/events/user-followed.event';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification-repository.interface';
import type { INotificationRepository } from '../../domain/repositories/notification-repository.interface';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class UserFollowedNotificationHandler {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  @OnEvent(UserFollowedEvent.EVENT_NAME)
  async handle(event: UserFollowedEvent): Promise<void> {
    const notification = new Notification();
    notification.userId = event.followedId;
    notification.type = 'USER_FOLLOWED';
    notification.title = 'New follower';
    notification.message = `Someone started following you`;
    notification.link = `/users/${event.followerId}`;
    notification.isRead = false;
    notification.metadata = JSON.stringify({
      followerId: event.followerId,
      followedId: event.followedId,
    });
    await this.notificationRepository.save(notification);
  }
}
