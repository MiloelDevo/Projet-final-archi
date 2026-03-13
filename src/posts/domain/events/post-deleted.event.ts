export class PostDeletedEvent {
  static readonly EVENT_NAME = 'post.deleted';

  constructor(
    public readonly postId: number,
    public readonly authorId: number | null,
    public readonly deletedById: number,
  ) {}
}
