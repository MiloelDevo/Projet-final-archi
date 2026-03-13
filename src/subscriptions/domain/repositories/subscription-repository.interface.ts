import type { Subscription } from '../entities/subscription.entity';

export interface ISubscriptionRepository {
  save(subscription: Subscription): Promise<Subscription>;
  findByFollowerAndFollowed(followerId: number, followedId: number): Promise<Subscription | null>;
  delete(subscription: Subscription): Promise<void>;
  findFollowersOf(userId: number, options: { skip: number; take: number }): Promise<Subscription[]>;
  findFollowingBy(userId: number, options: { skip: number; take: number }): Promise<Subscription[]>;
  countFollowersOf(userId: number): Promise<number>;
  countFollowingBy(userId: number): Promise<number>;
  findFollowedIdsByFollower(followerId: number): Promise<number[]>;
  findFollowerIdsByFollowed(followedId: number): Promise<number[]>;
}

export const SUBSCRIPTION_REPOSITORY = Symbol('SUBSCRIPTION_REPOSITORY');
