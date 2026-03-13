export class UserFollowedEvent {
  static readonly EVENT_NAME = 'user.followed';

  constructor(
    public readonly followerId: number,
    public readonly followedId: number,
  ) {}
}
