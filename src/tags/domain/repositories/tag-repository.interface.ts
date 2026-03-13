import { Tag } from '../entities/tag.entity';

export interface ITagRepository {
  create(name: string): Tag;
  save(tag: Tag): Promise<Tag>;
  findAll(): Promise<Tag[]>;
  findByName(name: string): Promise<Tag | null>;
  delete(id: number): Promise<void>;
}

export const TAG_REPOSITORY = Symbol('TAG_REPOSITORY');

