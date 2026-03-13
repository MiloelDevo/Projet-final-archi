import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../domain/entities/tag.entity';
import {
  ITagRepository,
  TAG_REPOSITORY,
} from '../../domain/repositories/tag-repository.interface';

@Injectable()
export class TypeormTagRepository implements ITagRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly repo: Repository<Tag>,
  ) {}

  create(name: string): Tag {
    return this.repo.create({ name });
  }

  save(tag: Tag): Promise<Tag> {
    return this.repo.save(tag);
  }

  findAll(): Promise<Tag[]> {
    return this.repo.find();
  }

  async findByName(name: string): Promise<Tag | null> {
    return this.repo.findOne({ where: { name } });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

export const TypeormTagRepositoryProvider = {
  provide: TAG_REPOSITORY,
  useClass: TypeormTagRepository,
};

