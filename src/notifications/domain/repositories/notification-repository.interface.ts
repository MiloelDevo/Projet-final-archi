import type { Notification } from '../entities/notification.entity';

export interface INotificationRepository {
  save(notification: Notification): Promise<Notification>;
  findById(id: number): Promise<Notification | null>;
  findByUserId(
    userId: number,
    options: { skip: number; take: number },
  ): Promise<Notification[]>;
  markAsRead(id: number, userId: number): Promise<void>;
  markAllAsRead(userId: number): Promise<void>;
}

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');
