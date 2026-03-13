import type { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByRole(role: string): Promise<User[]>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
