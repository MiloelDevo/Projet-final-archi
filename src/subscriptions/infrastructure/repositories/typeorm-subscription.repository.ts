import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../../domain/entities/subscription.entity';
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from '../../domain/repositories/subscription-repository.interface';

@Injectable()
export class TypeormSubscriptionRepository implements ISubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private readonly repo: Repository<Subscription>,
  ) {}

  save(subscription: Subscription): Promise<Subscription> {
    return this.repo.save(subscription);
  }

  findByFollowerAndFollowed(
    followerId: number,
    followedId: number,
  ): Promise<Subscription | null> {
    return this.repo.findOne({
      where: {
        follower: { id: followerId },
        followed: { id: followedId },
      },
    });
  }

  async delete(subscription: Subscription): Promise<void> {
    await this.repo.remove(subscription);
  }

  findFollowersOf(
    userId: number,
    options: { skip: number; take: number },
  ): Promise<Subscription[]> {
    return this.repo.find({
      where: { followed: { id: userId } },
      relations: ['follower'],
      order: { createdAt: 'DESC' },
      skip: options.skip,
      take: options.take,
    });
  }

  findFollowingBy(
    userId: number,
    options: { skip: number; take: number },
  ): Promise<Subscription[]> {
    return this.repo.find({
      where: { follower: { id: userId } },
      relations: ['followed'],
      order: { createdAt: 'DESC' },
      skip: options.skip,
      take: options.take,
    });
  }

  countFollowersOf(userId: number): Promise<number> {
    return this.repo.count({ where: { followed: { id: userId } } });
  }

  countFollowingBy(userId: number): Promise<number> {
    return this.repo.count({ where: { follower: { id: userId } } });
  }

  async findFollowedIdsByFollower(followerId: number): Promise<number[]> {
    const list = await this.repo.find({
      where: { follower: { id: followerId } },
      relations: ['followed'],
    });
    return list.map((s) => s.followed.id);
  }

  async findFollowerIdsByFollowed(followedId: number): Promise<number[]> {
    const list = await this.repo.find({
      where: { followed: { id: followedId } },
      relations: ['follower'],
    });
    return list.map((s) => s.follower.id);
  }
}

export const TypeormSubscriptionRepositoryProvider = {
  provide: SUBSCRIPTION_REPOSITORY,
  useClass: TypeormSubscriptionRepository,
};
