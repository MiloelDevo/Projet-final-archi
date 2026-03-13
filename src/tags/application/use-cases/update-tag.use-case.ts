import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TAG_REPOSITORY } from '../../domain/repositories/tag-repository.interface';
import type { ITagRepository } from '../../domain/repositories/tag-repository.interface';
import { UpdateTagDto } from '../dtos/update-tag.dto';
import { Tag } from '../../domain/entities/tag.entity';

@Injectable()
export class UpdateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(currentName: string, dto: UpdateTagDto): Promise<Tag> {
    const normalizedCurrent = currentName.toLowerCase();
    const tag = await this.tagRepository.findByName(normalizedCurrent);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    const newName = dto.name.toLowerCase();
    if (newName !== tag.name) {
      const existing = await this.tagRepository.findByName(newName);
      if (existing) {
        throw new ConflictException('Tag name already exists');
      }
      tag.name = newName;
    }

    return this.tagRepository.save(tag);
  }
}

