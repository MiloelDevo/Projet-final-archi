import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/domain/entities/user.entity';

/**
 * Ensures a fake user with id 1 exists for FakeAuthGuard tests.
 * Minimal seed so POST /posts/:id/comments with x-user-id: 1 works.
 */
@Injectable()
export class EnsureFakeUserBootstrap implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    const existing = await this.userRepo.findOne({ where: { id: 1 } });
    if (existing) return;

    await this.userRepo.save({
      id: 1,
      email: 'fake@test.com',
      username: 'fakeuser',
      role: 'USER',
    });
  }
}
