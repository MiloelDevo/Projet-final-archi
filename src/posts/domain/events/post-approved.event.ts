export class PostApprovedEvent {
  static readonly EVENT_NAME = 'post.approved';

  constructor(
    public readonly postId: number,
    public readonly authorId: number | null,
    public readonly approvedById: number,
  ) {}
}
