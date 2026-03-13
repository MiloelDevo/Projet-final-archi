import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TAG_REPOSITORY } from '../../domain/repositories/tag-repository.interface';
import type { ITagRepository } from '../../domain/repositories/tag-repository.interface';

@Injectable()
export class DeleteTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(name: string): Promise<void> {
    const normalized = name.toLowerCase();
    const tag = await this.tagRepository.findByName(normalized);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    await this.tagRepository.delete(tag.id);
  }
}

