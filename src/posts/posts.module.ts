import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Post } from './domain/entities/post.entity';
import { PostsController } from './infrastructure/controllers/posts.controller';
import { TypeormPostRepositoryProvider } from './infrastructure/repositories/typeorm-post.repository';
import { SlugService } from './application/services/slug.service';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { GetPostBySlugUseCase } from './application/use-cases/get-post-by-slug.use-case';
import { OverridePostSlugUseCase } from './application/use-cases/override-post-slug.use-case';
import { ListPostsUseCase } from './application/use-cases/list-posts.use-case';
import { SubmitPostForReviewUseCase } from './application/use-cases/submit-post-for-review.use-case';
import { ApprovePostUseCase } from './application/use-cases/approve-post.use-case';
import { RejectPostUseCase } from './application/use-cases/reject-post.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    EventEmitterModule.forRoot(),
    TagsModule,
  ],
  controllers: [PostsController],
  providers: [
    TypeormPostRepositoryProvider,
    SlugService,
    CreatePostUseCase,
    GetPostBySlugUseCase,
    OverridePostSlugUseCase,
    ListPostsUseCase,
    SubmitPostForReviewUseCase,
    ApprovePostUseCase,
    RejectPostUseCase,
    DeletePostUseCase,
  ],
  exports: [TypeormPostRepositoryProvider],
})
export class PostsModule {}

