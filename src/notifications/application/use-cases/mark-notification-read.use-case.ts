import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification-repository.interface';
import type { INotificationRepository } from '../../domain/repositories/notification-repository.interface';

@Injectable()
export class MarkNotificationReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(notificationId: number, userId: number): Promise<void> {
    const notification = await this.notificationRepository.findById(notificationId);
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId) {
      throw new ForbiddenException('Not your notification');
    }
    await this.notificationRepository.markAsRead(notificationId, userId);
  }
}
