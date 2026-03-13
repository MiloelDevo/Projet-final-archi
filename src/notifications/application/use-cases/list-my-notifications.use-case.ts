import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification-repository.interface';
import type { INotificationRepository } from '../../domain/repositories/notification-repository.interface';
import type { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class ListMyNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(
    userId: number,
    options: { page: number; limit: number },
  ): Promise<Notification[]> {
    const skip = (options.page - 1) * options.limit;
    return this.notificationRepository.findByUserId(userId, {
      skip,
      take: options.limit,
    });
  }
}
