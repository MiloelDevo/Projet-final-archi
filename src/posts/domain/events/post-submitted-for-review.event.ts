export class PostSubmittedForReviewEvent {
  static readonly EVENT_NAME = 'post.submitted_for_review';

  constructor(
    public readonly postId: number,
    public readonly authorId: number | null,
  ) {}
}
