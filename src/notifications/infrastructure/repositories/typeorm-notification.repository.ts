import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../domain/entities/notification.entity';
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../../domain/repositories/notification-repository.interface';

@Injectable()
export class TypeormNotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  save(notification: Notification): Promise<Notification> {
    return this.repo.save(notification);
  }

  findById(id: number): Promise<Notification | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByUserId(
    userId: number,
    options: { skip: number; take: number },
  ): Promise<Notification[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: options.skip,
      take: options.take,
    });
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    await this.repo.update({ id, userId }, { isRead: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.repo.update({ userId }, { isRead: true });
  }
}

export const TypeormNotificationRepositoryProvider = {
  provide: NOTIFICATION_REPOSITORY,
  useClass: TypeormNotificationRepository,
};
