import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CommentCreatedEvent } from '../../domain/events/comment-created.event';

@Injectable()
export class CommentCreatedHandler {
  private readonly logger = new Logger(CommentCreatedHandler.name);

  @OnEvent(CommentCreatedEvent.EVENT_NAME)
  handle(event: CommentCreatedEvent) {
    if (!event.postAuthorId || event.postAuthorId === event.commentAuthorId) {
      // No notification for self-comments
      return;
    }

    // Placeholder for real notification logic
    this.logger.log(
      `Notify user ${event.postAuthorId} about new comment ${event.commentId} on post ${event.postId}`,
    );
  }
}

