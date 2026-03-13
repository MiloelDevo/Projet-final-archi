import { Inject, Injectable } from '@nestjs/common';
import { TAG_REPOSITORY } from '../../domain/repositories/tag-repository.interface';
import type { ITagRepository } from '../../domain/repositories/tag-repository.interface';
import { Tag } from '../../domain/entities/tag.entity';

@Injectable()
export class ListTagsUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  execute(): Promise<Tag[]> {
    return this.tagRepository.findAll();
  }
}

