import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Notification } from './domain/entities/notification.entity';
import { TypeormNotificationRepositoryProvider } from './infrastructure/repositories/typeorm-notification.repository';
import { NotificationsController } from './infrastructure/controllers/notifications.controller';
import { ListMyNotificationsUseCase } from './application/use-cases/list-my-notifications.use-case';
import { MarkNotificationReadUseCase } from './application/use-cases/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from './application/use-cases/mark-all-notifications-read.use-case';
import { CommentCreatedNotificationHandler } from './application/handlers/comment-created-notification.handler';
import { PostSubmittedNotificationHandler } from './application/handlers/post-submitted-notification.handler';
import { PostApprovedNotificationHandler } from './application/handlers/post-approved-notification.handler';
import { PostRejectedNotificationHandler } from './application/handlers/post-rejected-notification.handler';
import { PostDeletedNotificationHandler } from './application/handlers/post-deleted-notification.handler';
import { UserFollowedNotificationHandler } from './application/handlers/user-followed-notification.handler';
import { UsersModule } from '../users/users.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    EventEmitterModule.forRoot(),
    UsersModule,
    SubscriptionsModule,
  ],
  controllers: [NotificationsController],
  providers: [
    TypeormNotificationRepositoryProvider,
    ListMyNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
    CommentCreatedNotificationHandler,
    PostSubmittedNotificationHandler,
    PostApprovedNotificationHandler,
    PostRejectedNotificationHandler,
    PostDeletedNotificationHandler,
    UserFollowedNotificationHandler,
  ],
})
export class NotificationsModule {}
