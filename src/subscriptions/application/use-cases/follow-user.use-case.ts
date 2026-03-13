import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription-repository.interface';
import type { ISubscriptionRepository } from '../../domain/repositories/subscription-repository.interface';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user-repository.interface';
import type { IUserRepository } from '../../../users/domain/repositories/user-repository.interface';
import { Subscription } from '../../domain/entities/subscription.entity';
import { User } from '../../../users/domain/entities/user.entity';
import { UserFollowedEvent } from '../../domain/events/user-followed.event';

@Injectable()
export class FollowUserUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    followerId: number,
    followedId: number,
  ): Promise<Subscription> {
    if (followerId === followedId) {
      throw new ConflictException('Cannot follow yourself');
    }

    const followed = await this.userRepository.findById(followedId);
    if (!followed) {
      throw new NotFoundException('User to follow not found');
    }

    const existing = await this.subscriptionRepository.findByFollowerAndFollowed(
      followerId,
      followedId,
    );
    if (existing) {
      throw new ConflictException('Already following this user');
    }

    const subscription = new Subscription();
    subscription.followerId = followerId;
    subscription.followedId = followedId;
    subscription.follower = { id: followerId } as User;
    subscription.followed = followed;

    const saved = await this.subscriptionRepository.save(subscription);

    this.eventEmitter.emit(
      UserFollowedEvent.EVENT_NAME,
      new UserFollowedEvent(followerId, followedId),
    );

    return saved;
  }
}
