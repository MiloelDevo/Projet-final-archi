import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

export interface RequestUser {
  id: number;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
}

@Injectable()
export class FakeAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userIdHeader = request.headers['x-user-id'];
    const roleHeader = (request.headers['x-user-role'] as string | undefined)?.toUpperCase();

    if (!userIdHeader) {
      throw new UnauthorizedException('Authentication required');
    }

    const id = Number(userIdHeader);
    if (Number.isNaN(id)) {
      throw new UnauthorizedException('Invalid user id');
    }

    const role: RequestUser['role'] =
      roleHeader === 'ADMIN' || roleHeader === 'MODERATOR' ? roleHeader : 'USER';

    request.user = { id, role } as RequestUser;
    return true;
  }
}

