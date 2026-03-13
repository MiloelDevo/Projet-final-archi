import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { TAG_REPOSITORY } from '../../domain/repositories/tag-repository.interface';
import type { ITagRepository } from '../../domain/repositories/tag-repository.interface';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { Tag } from '../../domain/entities/tag.entity';

@Injectable()
export class CreateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(dto: CreateTagDto): Promise<Tag> {
    const normalizedName = dto.name.toLowerCase();

    const existing = await this.tagRepository.findByName(normalizedName);
    if (existing) {
      throw new ConflictException('Tag name already exists');
    }

    const tag = this.tagRepository.create(normalizedName);
    return this.tagRepository.save(tag);
  }
}

