export class CommentCreatedEvent {
  static readonly EVENT_NAME = 'comment.created';

  constructor(
    public readonly commentId: number,
    public readonly postId: number,
    public readonly commentAuthorId: number,
    public readonly postAuthorId: number | null,
  ) {}
}

