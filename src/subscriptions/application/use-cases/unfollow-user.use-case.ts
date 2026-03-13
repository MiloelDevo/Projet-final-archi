import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription-repository.interface';
import type { ISubscriptionRepository } from '../../domain/repositories/subscription-repository.interface';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(followerId: number, followedId: number): Promise<void> {
    const subscription =
      await this.subscriptionRepository.findByFollowerAndFollowed(
        followerId,
        followedId,
      );
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    await this.subscriptionRepository.delete(subscription);
  }
}
