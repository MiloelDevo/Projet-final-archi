import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post as HttpPost,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FakeAuthGuard } from '../../../common/guards/fake-auth.guard';
import type { RequestUser } from '../../../common/guards/fake-auth.guard';
import { ListMyNotificationsUseCase } from '../../application/use-cases/list-my-notifications.use-case';
import { MarkNotificationReadUseCase } from '../../application/use-cases/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from '../../application/use-cases/mark-all-notifications-read.use-case';
import { ListNotificationsQueryDto } from '../../application/dtos/list-notifications-query.dto';
import { Notification } from '../../domain/entities/notification.entity';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(FakeAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(
    private readonly listMyNotificationsUseCase: ListMyNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List my notifications (paginated)' })
  async list(
    @Req() req: { user: RequestUser },
    @Query() query: ListNotificationsQueryDto,
  ): Promise<Notification[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return this.listMyNotificationsUseCase.execute(req.user.id, { page, limit });
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all my notifications as read (PATCH)' })
  async markAllReadPatch(@Req() req: { user: RequestUser }): Promise<void> {
    await this.markAllNotificationsReadUseCase.execute(req.user.id);
  }

  @HttpPost('mark-all-read')
  @ApiOperation({ summary: 'Mark all my notifications as read (POST)' })
  async markAllReadPost(@Req() req: { user: RequestUser }): Promise<void> {
    await this.markAllNotificationsReadUseCase.execute(req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark one notification as read' })
  async markRead(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: RequestUser },
  ): Promise<void> {
    await this.markNotificationReadUseCase.execute(id, req.user.id);
  }
}
