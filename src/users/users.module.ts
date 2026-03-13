import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { TypeormUserRepositoryProvider } from './infrastructure/repositories/typeorm-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [TypeormUserRepositoryProvider],
  exports: [TypeormUserRepositoryProvider],
})
export class UsersModule {}
