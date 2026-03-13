export class PostRejectedEvent {
  static readonly EVENT_NAME = 'post.rejected';

  constructor(
    public readonly postId: number,
    public readonly authorId: number | null,
    public readonly rejectedById: number,
    public readonly reason?: string,
  ) {}
}
