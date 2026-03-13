import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post as HttpPost,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FakeAuthGuard } from '../../../common/guards/fake-auth.guard';
import type { RequestUser } from '../../../common/guards/fake-auth.guard';
import { FollowUserUseCase } from '../../application/use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from '../../application/use-cases/unfollow-user.use-case';
import { ListFollowersUseCase } from '../../application/use-cases/list-followers.use-case';
import { ListFollowingUseCase } from '../../application/use-cases/list-following.use-case';
import { ListSubscriptionsQueryDto } from '../../application/dtos/list-subscriptions-query.dto';
import { Subscription } from '../../domain/entities/subscription.entity';

@ApiTags('subscriptions')
@Controller('subscriptions')
@UseGuards(FakeAuthGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
    private readonly listFollowersUseCase: ListFollowersUseCase,
    private readonly listFollowingUseCase: ListFollowingUseCase,
  ) {}

  @HttpPost('follow/:followedId')
  @ApiOperation({ summary: 'Follow a user' })
  async follow(
    @Param('followedId', ParseIntPipe) followedId: number,
    @Req() req: { user: RequestUser },
  ): Promise<Subscription> {
    return this.followUserUseCase.execute(req.user.id, followedId);
  }

  @Delete('follow/:followedId')
  @ApiOperation({ summary: 'Unfollow a user' })
  async unfollow(
    @Param('followedId', ParseIntPipe) followedId: number,
    @Req() req: { user: RequestUser },
  ): Promise<void> {
    await this.unfollowUserUseCase.execute(req.user.id, followedId);
  }

  @Get('followers')
  @ApiOperation({ summary: 'List users who follow me (paginated)' })
  async listFollowers(
    @Req() req: { user: RequestUser },
    @Query() query: ListSubscriptionsQueryDto,
  ): Promise<Subscription[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.listFollowersUseCase.execute(req.user.id, { page, limit });
  }

  @Get('following')
  @ApiOperation({ summary: 'List users I follow (paginated)' })
  async listFollowing(
    @Req() req: { user: RequestUser },
    @Query() query: ListSubscriptionsQueryDto,
  ): Promise<Subscription[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.listFollowingUseCase.execute(req.user.id, { page, limit });
  }
}
