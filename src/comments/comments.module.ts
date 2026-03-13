import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './domain/entities/comment.entity';
import { CommentsController } from './infrastructure/controllers/comments.controller';
import { TypeormCommentRepositoryProvider } from './infrastructure/repositories/typeorm-comment.repository';
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { ListCommentsUseCase } from './application/use-cases/list-comments.use-case';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.use-case';
import { CountCommentsUseCase } from './application/use-cases/count-comments.use-case';
import { CommentCreatedHandler } from './application/handlers/comment-created.handler';
import { Post } from '../posts/domain/entities/post.entity';
import { User } from '../users/domain/entities/user.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FakeAuthGuard } from '../common/guards/fake-auth.guard';
import { PostsModule } from '../posts/posts.module';
import { EnsureFakeUserBootstrap } from './infrastructure/bootstrap/ensure-fake-user.bootstrap';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, User]), EventEmitterModule.forRoot(), PostsModule],
  controllers: [CommentsController],
  providers: [
    EnsureFakeUserBootstrap,
    TypeormCommentRepositoryProvider,
    CreateCommentUseCase,
    ListCommentsUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    CountCommentsUseCase,
    CommentCreatedHandler,
    FakeAuthGuard,
  ],
})
export class CommentsModule {}

