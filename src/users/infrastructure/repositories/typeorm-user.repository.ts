import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user-repository.interface';

@Injectable()
export class TypeormUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByRole(role: string): Promise<User[]> {
    return this.repo.find({ where: { role } });
  }
}

export const TypeormUserRepositoryProvider = {
  provide: USER_REPOSITORY,
  useClass: TypeormUserRepository,
};
