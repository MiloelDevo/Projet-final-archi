import { Inject, Injectable } from '@nestjs/common';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/repositories/subscription-repository.interface';
import type { ISubscriptionRepository } from '../../domain/repositories/subscription-repository.interface';
import type { Subscription } from '../../domain/entities/subscription.entity';

@Injectable()
export class ListFollowingUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(
    userId: number,
    options: { page: number; limit: number },
  ): Promise<Subscription[]> {
    const skip = (options.page - 1) * options.limit;
    return this.subscriptionRepository.findFollowingBy(userId, {
      skip,
      take: options.limit,
    });
  }
}
