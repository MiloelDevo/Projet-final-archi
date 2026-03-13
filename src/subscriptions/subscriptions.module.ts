import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Subscription } from './domain/entities/subscription.entity';
import { TypeormSubscriptionRepositoryProvider } from './infrastructure/repositories/typeorm-subscription.repository';
import { SubscriptionsController } from './infrastructure/controllers/subscriptions.controller';
import { FollowUserUseCase } from './application/use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from './application/use-cases/unfollow-user.use-case';
import { ListFollowersUseCase } from './application/use-cases/list-followers.use-case';
import { ListFollowingUseCase } from './application/use-cases/list-following.use-case';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    EventEmitterModule.forRoot(),
    UsersModule,
  ],
  controllers: [SubscriptionsController],
  providers: [
    TypeormSubscriptionRepositoryProvider,
    FollowUserUseCase,
    UnfollowUserUseCase,
    ListFollowersUseCase,
    ListFollowingUseCase,
  ],
  exports: [TypeormSubscriptionRepositoryProvider],
})
export class SubscriptionsModule {}
