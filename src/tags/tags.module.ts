import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './domain/entities/tag.entity';
import { TagsController } from './infrastructure/controllers/tags.controller';
import { TypeormTagRepositoryProvider } from './infrastructure/repositories/typeorm-tag.repository';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { ListTagsUseCase } from './application/use-cases/list-tags.use-case';
import { UpdateTagUseCase } from './application/use-cases/update-tag.use-case';
import { DeleteTagUseCase } from './application/use-cases/delete-tag.use-case';
import { AdminGuard } from './infrastructure/guards/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagsController],
  providers: [
    TypeormTagRepositoryProvider,
    CreateTagUseCase,
    ListTagsUseCase,
    UpdateTagUseCase,
    DeleteTagUseCase,
    AdminGuard,
  ],
  exports: [TypeormTagRepositoryProvider],
})
export class TagsModule {}

